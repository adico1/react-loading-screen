'use strict';

const assert = require('assert');

const ObjectID = require('mongodb').ObjectID;
const DbConnection = require('./persist-manager');

const KindergartenRepository = require('./kindergarten-repository');
const kindergartenRepository = new KindergartenRepository();

const KidRepository = require('./kids-repository');
const kidsRepository = new KidRepository();

const collection = 'kids_presence_report';

const db = DbConnection.get();

import { NOT_KID_ID, ENTRY_SUCCESS, EXIT_SUCCESS, REMOVE_ENTRY_SUCCESS, REMOVE_EXIT_SUCCESS, 
    DOUBLE_ENTRY, DOUBLE_EXIT } from '../shared/kids-report-consts';

const toDate = entry => new Date(entry.year + '-' + entry.month + '-' + entry.day);
const toTime = entry => {
    const [hours, minutes] = entry.time.split(':');

    console.log('entry.time', entry.time);

    console.log('hours', hours, 'minutes', minutes);
    
    return minutes * 60 + hours * 3600;
};

const filters = {
    monthIn: (kindergarten, entry) => {
        return {
            "kindergartenId" : new ObjectID(kindergarten.id), 
            "date" : toDate(entry)
        }
    },
    monthOut: (kindergarten, kid, entry) => {
        return {
            "kindergartenId" : new ObjectID(kindergarten.id), 
            "date" : toDate(entry), 
            "presence.kidid": new ObjectID(kid.id)
       }
    },
    presence: (kindergarten, entry) => {
        console.log('kindergarten.id:', kindergarten.id);

        return { 
            'kindergartenId': new ObjectID(kindergarten.id), 
            'date': toDate(entry)
        };
    },
    todays_presence: (kindergarten, kid, entry, direction) => {
        let directionKey = '';
        
        if(direction === 'IN') {
            directionKey = 'in';
        } else {
            directionKey = 'out';
        }

        const tempFilter = { 
            'kindergartenId': new ObjectID(kindergarten.id), 
            'date': toDate(entry),
            'presence': {
                '$elemMatch': {
                    'kidid': new ObjectID(kid.id)
                }
            }
        };

        tempFilter.presence['$elemMatch'][directionKey] = { '$eq': null };

        console.log('tempFilter');
        console.dir(tempFilter);

        return tempFilter;
    },
};

const projections = {
    presence: () => {
        return {
            fields: { _id: 0, presence: 1 }
        }
    }
};

class KidsPresenceReportRepository {

    async addStrategyIn(kindergarten, kid, entry) {
        const r = await db.collection(collection)
            .updateOne(
                filters.monthIn(kindergarten, entry),
                {$push: { 
                    presence: {
                        "kidid" : ObjectID(kid.id), 
                        "in" : toTime(entry)
                    } 
                }},
                { upsert: true }
            )

            console.log('filters.monthIn(kindergarten, entry)');
            console.dir(filters.monthIn(kindergarten, entry));

        if(r.matchedCount === 0) {
            assert.equal(true, typeof r.upsertedId !== 'undefind');
        } else {
            assert.equal(1, r.modifiedCount);
        }

        return ENTRY_SUCCESS;
    }

    async addStrategyOut(kindergarten, kid, entry) {
        const r = await db.collection(collection)
            .updateOne(
                filters.monthOut(kindergarten, kid, entry),
                {$set: { "presence.$.out": toTime(entry) }}
            )

        if(r.matchedCount === 0) {
            assert.equal(1, r.upsertedCount);
        } else {
            assert.equal(1, r.modifiedCount);
        }

        return EXIT_SUCCESS;
    }
    
    calcRegistrarYear(entry) {
        if(entry.month >= 7) {
            return entry.year + 1;
        }

        return entry.year;
    }

    async addStrategy(kindergarten, kid, entry, direction) {
        const registrarYear = this.calcRegistrarYear(entry);
        const isKid = await kidsRepository.isKid(kindergarten.id, kid.id, registrarYear);
        if(!isKid) {
            return NOT_KID_ID;
        }
    
        // cases:
        // {}
        // { "entries" : {  } }
        // { "entries" : { "18" : { "in" : "2:48" } } }
        // { "entries" : { "18" : { "out" : "2:52" } } }
        // { "entries" : { "18" : { "in" : "2:48", "out" : "2:52" } } }
        const currentMonthKidsArrivalReport = 
            await this.findTodaysKidsPresenceReportEntries(kindergarten, kid, entry, direction);

        console.log('currentMonthKidsArrivalReport:');
        console.dir(currentMonthKidsArrivalReport);

        if(currentMonthKidsArrivalReport) {
            if( direction === 'IN') return DOUBLE_ENTRY;
        } else {
            if( direction === 'OUT') return DOUBLE_EXIT;
        }

        console.log('direction', direction);

        if(direction === 'IN') {
            return this.addStrategyIn(kindergarten, kid, entry)
        } else {
            return this.addStrategyOut(kindergarten, kid, entry)
        }
    }

    async removeStrategyIn(kindergarten, kid, entry, direction) {
        const r = await db.collection(collection)
            .updateOne(
                filters.monthIn(kindergarten, entry),
                {$pull: { 
                    "presence" : {
                        "kidid": ObjectID(kid.id) 
                    }
                }}
            )

        if(r.matchedCount === 0) {
            assert.equal(1, r.upsertedCount);
        } else {
            assert.equal(1, r.modifiedCount);
        }

        return REMOVE_ENTRY_SUCCESS;
    }

    async removeStrategyOut(kindergarten, kid, entry, direction) {
        const r = await db.collection(collection)
            .updateOne(
                filters.monthOut(kindergarten, kid, entry),
                {$unset: { "presence.$.out": "" }}
            )

        if(r.matchedCount === 0) {
            assert.equal(1, r.upsertedCount);
        } else {
            assert.equal(1, r.modifiedCount);
        }

        return REMOVE_EXIT_SUCCESS;
    }

    async removeStrategy(kindergarten, kid, entry, direction) {
        if(direction === 'IN') {
            return this.removeStrategyIn(kindergarten, kid, entry, direction)
        } else {
            return this.removeStrategyOut(kindergarten, kid, entry, direction)
        }
    }
    async addEntry(kindergarten, kid, entry) {
        return await this.addStrategy(kindergarten, kid, entry, 'IN')
    }

    async addExit(kindergarten, kid, entry) {
        return await this.addStrategy(kindergarten, kid, entry, 'OUT')
    }

    async removeEntry(kindergarten, kid, entry) {
        return await this.removeStrategy(kindergarten, kid, entry, 'IN')
    }

    async removeExit(kindergarten, kid, entry) {
        return await this.removeStrategy(kindergarten, kid, entry, 'OUT')
    }

    async findTodaysKidsPresenceReportEntries(kindergarten, kid, entry, direction) {
        return await db.collection(collection)
            .findOne(filters.todays_presence(kindergarten, kid, entry, direction));
    }

    mergeRelationship(kids, presence) {
        const result = kids.map(val => {
            
          const matchingKidPresence = presence.filter(v => {
            return v.kidid.toString() === val._id.toString()
          })[0];
            
          if(matchingKidPresence){
            return Object.assign({}, val, { in: matchingKidPresence.in, out: matchingKidPresence.out });
          }

          return Object.assign({}, val, matchingKidPresence);
        });
        
        return result;
    }

    calcRegistrarYear(entry) {
        if(entry.month >= 7) {
            return entry.year + 1;
        }

        return entry.year;
    }

    async findKidsPresenceReportByDate(kindergarten, entry) {
        const registrarYear = this.calcRegistrarYear(entry);
        const kids = await kidsRepository.list(kindergarten, registrarYear);

        const report = await db.collection(collection)
            .findOne(filters.presence(kindergarten, entry), projections.presence());

        if(report && report.presence) {
            return this.mergeRelationship(kids, report.presence);
        } else {
            return this.mergeRelationship(kids, []);
        }

    }
}

module.exports = KidsPresenceReportRepository;