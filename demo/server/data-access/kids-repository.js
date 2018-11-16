'use strict';

const ObjectID = require('mongodb').ObjectID;
const DbConnection = require('./persist-manager');

const collection = 'kids';

const db = DbConnection.get();

const filters = {
    kindergartenRegistrar: (kindergarten, year) => {
        return {
            'registrar': {
                "kindergartenId" : new ObjectID(kindergarten.id), 
                "year" : year
            }
        }
    },
    kidid: (kindergartenId, kidId, year) => {
        console.log('kidId')
        console.log(kidId)
        return {
            '_id': new ObjectID(kidId),
            'registrar': {
                'kindergartenId': ObjectID(kindergartenId),
                'year': year
            }
        }
    },

};

const projections = {
    kidsNameId: () => {
        return {
            fields: { registrar: 0 }
        }
    }
};

class KidRepository {

    async list(kindergarten, year) {
        return await db.collection(collection)
            .find(filters.kindergartenRegistrar(kindergarten, year), projections.kidsNameId())
            .sort({ lname: +1, fname: +1 })
            .toArray()
    }

    async isKid(kindergartenid, kidid, year) {
        const result = await db.collection(collection)
          .find(filters.kidid(kindergartenid, kidid, year))
          .toArray();
      
        return result.length > 0
      }
}

module.exports = KidRepository;