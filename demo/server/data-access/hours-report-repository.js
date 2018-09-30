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

import { NOT_EMPLOYEE, EMPLOYEE_CODE_INVALID, ENTRY_SUCCESS, DOUBLE_ENTRY, DOUBLE_EXIT } from '../shared/hours-report-consts';

const filters = {
    month: (employee, entry) => {
        return { 
            'employeeId': new ObjectID(employee.id), 
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
    
        // cases:
        // {}
        // { "entries" : {  } }
        // { "entries" : { "18" : { "in" : "2:48" } } }
        // { "entries" : { "18" : { "out" : "2:52" } } }
        // { "entries" : { "18" : { "in" : "2:48", "out" : "2:52" } } }
        const currentMonthEmployeeHoursReport = 
            await this.findTodaysHoursReportEntries(employee, entry);

            console.log('entry.day', entry.day);
        let currDay = entry.day;
        let keyField = 'entries.' + currDay;
        let directionField;

        if(direction === 'IN') {
            directionField = 'in';
        } else {
            directionField = 'out';
        }
        keyField = keyField + '.' + directionField;
        
        const tmpInsertDocument = {};
        tmpInsertDocument[keyField] = entry.time;

        console.log('currentMonthEmployeeHoursReport:');
        console.dir(currentMonthEmployeeHoursReport);

        if(currentMonthEmployeeHoursReport && 'entries' in currentMonthEmployeeHoursReport && currDay in currentMonthEmployeeHoursReport.entries) {
            if(directionField in currentMonthEmployeeHoursReport.entries[currDay]) {
                if(directionField === 'in') {
                    return DOUBLE_ENTRY;
                } else {
                    return DOUBLE_EXIT;
                }
            }
        }

        const r = await db.collection(collection)
            .updateOne(
                filters.month(employee, entry),
                {$set:tmpInsertDocument},
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

    async findTodaysHoursReportEntries(kindergarten, entry) {
        const projectionEntryKey = 'entries.' + entry.day;
        const projection = {};
        projection[projectionEntryKey] = 1;

        return await db.collection(collection)
            .findOne(filters.month(kindergarten, entry), projection);
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