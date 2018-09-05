'use strict';

const assert = require('assert');

const ObjectID = require('mongodb').ObjectID;
const DbConnection = require('./persist-manager');

const KindergartenRepository = require('./kindergarten-repository');
const kindergartenRepository = new KindergartenRepository();

const EmployeeRepository = require('./employees-repository');
const employeesRepository = new EmployeeRepository();

const collection = 'hours-report';

const db = DbConnection.get();

import { NOT_EMPLOYEE, EMPLOYEE_CODE_INVALID, ENTRY_SUCCESS } from '../shared/hours-report-consts';

const filters = {
    month: (employeeid, year, month) => {
        return { 
            'employeeId': new ObjectID(employeeid), 
            'year': year,
            'month': month
        };
    },
    entry: (employee, entry) => {
        return { 
            'employeeId': new ObjectID(employee.id), 
            'code': employee.code,
            'year': entry.year,
            'month': entry.month
        };
    }
};

class HoursReportRepository {

    async addStrategy(kindergarten, employee, entry, direction) {
        const isEmployee = await kindergartenRepository.isEmployee(kindergarten.id, employee.id);
        if(!isEmployee) {
            return NOT_EMPLOYEE;
        }

        const isEmployeeCodeValid = await employeesRepository.isEmployeeCodeValid(employee);
        if(!isEmployeeCodeValid) {
            return EMPLOYEE_CODE_INVALID;
        }
    
        const key = 'entries.' + ( entry.day - 1 ) + direction;

        if(direction === 'IN') {
            key + '.in';
        } else {
            key + '.out';
        }
        
        const r = await db.collection(collection)
            .updateOne(
                filters.entry(employee, entry),
                {$set:{ key: entry.time}},
                {upsert: true}
            )

        if(r.matchedCount === 0) {
            assert.equal(1, r.upsertedCount);
        } else {
            assert.equal(1, r.modifiedCount);
        }

        return ENTRY_SUCCESS;
    }

    async addEntry(kindergarten, employee, entry) {
        return await this.addStrategy(kindergarten, employee, entry, 'IN')
    }

    async addExit(kindergarten, employee, entry) {
        return await this.addStrategy(kindergarten, employee, entry, 'OUT')
    }

    async findHoursReportByMonth(kindergartenid, employeeid, monthofyear) {
        const projection = {'entries': 1};

        const isEmployee = await kindergartenRepository.isEmployee(kindergartenid, employeeid);
        if(isEmployee) {
            return await db.collection(collection)
            .findOne(filters.month(kindergartenid, employeeid, monthofyear), projection)  
        }
    }
}

module.exports = HoursReportRepository;