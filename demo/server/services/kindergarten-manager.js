'use strict';

const KindergartenRepository = require('../data-access/kindergarten-repository');
const assert = require('assert');
const kindergartenRepository = new KindergartenRepository();

const mapToKindergartenDto = (kindergarten) => {
    assert(kindergarten, 'Kindergarten is required');

    return {
        id: kindergarten._id,
        name: kindergarten.name
    };
};

const mapToEmployeesDto = (employees) => {
    assert(employees, 'Employees list required');

    return employees;
};

const createKindergarten = (id) => {
    return { id };
};

const createUpdatedNote = (title, content, tags) => {
    return { 
        title: title, 
        content: content,
        tags: !Array.isArray(tags) ? convertTagsCsvToArray(tags) : tags,
        updated_date: new Date() 
    };
};

const createNewKindergarten = (date) => {
    return {
        year: title,
        month: content,
        day: convertTagsCsvToArray(tags),
        time: new Date()
    };
};

class KindergartenManager {    

    listKindergartens() {

        assert(name, 'Name is required');
        
        const kindergarten = createNewKindergarten(name);

        return new Promise((resolve, reject) => {
            kindergartenRepository
                .listKindergartens()
                .then(kindergartens => resolve(mapToKindergartenDto(kindergartens)))
                .catch(error => reject(error));
        });
    }

    findEmployees(id) {
        
        assert(id, 'Id is required');
        
        const kindergarten = createKindergarten(id);
        
        return new Promise((resolve, reject) => {
            kindergartenRepository
                .listKindergartenEmployees(kindergarten)
                .then(employees => resolve(mapToEmployeesDto(employees)))
                .catch(error => reject(error));
        });
    }
}

module.exports = KindergartenManager;