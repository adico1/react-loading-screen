'use strict';

const KidsPresenceReportRepository = require('../data-access/kids-presence-report-repository');
const assert = require('assert');
const kidsPresenceReportRepository = new KidsPresenceReportRepository();

const mapToKidsReportDto = (kidsReport) => {
    assert(kidsReport, 'Note is required');

    return {
        id: note._id,
        title: note.title,
        content: note.content,
        tags: note.tags,
        createdDate: note.created_date,
        updatedDate: note.updated_date
    };
};

const createUpdatedNote = (title, content, tags) => {
    return { 
        title: title, 
        content: content,
        tags: !Array.isArray(tags) ? convertTagsCsvToArray(tags) : tags,
        updated_date: new Date() 
    };
};

const createNewEntry = () => {
    const now = new Date();

    return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        time: now.getHours() + ':' + now.getMinutes()
    };
};

const createKindergarten = (id) => {
    return { id };
};

const createKid = (id) => {
    return { 
        id
    };
};

class KidsPresenceReportManager {    

    async addEntry(kindergartenId, kidId) {

        assert(kindergartenId, 'Kindergarten Id is required');
        assert(kidId, 'Kid Id is required');
        
        const kindergarten = createKindergarten(kindergartenId);
        const kid = createKid(kidId);
        const entry = createNewEntry();
        
        console.log('entry:');
        console.dir(entry);

        return await kidsPresenceReportRepository
                .addEntry(kindergarten, kid, entry)
    }

    async addExit(kindergartenId, kidId) {

        assert(kindergartenId, 'Kindergarten Id is required');
        assert(kidId, 'Kid Id is required');
        
        const kindergarten = createKindergarten(kindergartenId);
        const kid = createKid(kidId);
        const entry = createNewEntry();

      return await kidsPresenceReportRepository
              .addExit(kindergarten, kid, entry)
    }

    async removeEntry(kindergartenId, kidId) {

        assert(kindergartenId, 'Kindergarten Id is required');
        assert(kidId, 'Kid Id is required');
        
        const kindergarten = createKindergarten(kindergartenId);
        const kid = createKid(kidId);
        const entry = createNewEntry();
        
        console.log('entry:');
        console.dir(entry);

        return await kidsPresenceReportRepository
                .removeEntry(kindergarten, kid, entry)
    }

    async removeExit(kindergartenId, kidId) {

        assert(kindergartenId, 'Kindergarten Id is required');
        assert(kidId, 'Kid Id is required');
        
        const kindergarten = createKindergarten(kindergartenId);
        const kid = createKid(kidId);
        const entry = createNewEntry();

      return await kidsPresenceReportRepository
              .removeExit(kindergarten, kid, entry)
    }

    async findKidsPresenceReportByDate(kindergartenId) {
        
        assert(kindergartenId, 'KindergartenId is required');
        
        const kindergarten = createKindergarten(kindergartenId);
        const entry = createNewEntry();

        return await kidsPresenceReportRepository
            .findKidsPresenceReportByDate(kindergarten, entry)
    }
}

module.exports = KidsPresenceReportManager;