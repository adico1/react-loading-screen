'use strict';

const EmployeesRepository = require('../data-access/employees-repository');
const assert = require('assert');
const employeesRepository = new EmployeesRepository();

const mapToEmployeesDto = (employees) => {
    assert(employees, 'Employees list required');

    return employees;
};

const createKindergarten = (id) => {
    return { id };
};

class EmployeesManager {

    list(id) {
        
        assert(id, 'Id is required');
        
        const kindergarten = createKindergarten(id);
        
        return new Promise((resolve, reject) => {
            employeesRepository
                .list(kindergarten)
                .then(employees => resolve(mapToEmployeesDto(employees)))
                .catch(error => reject(error));
        });
    }
}

module.exports = EmployeesManager;