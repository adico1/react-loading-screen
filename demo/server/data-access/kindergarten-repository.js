'use strict';

const ObjectID = require('mongodb').ObjectID;
const DbConnection = require('./persist-manager');

const collection = 'kindergartens';

const db = DbConnection.get();

const filters = {
    id: (kindergarten) => {
        return {
            '_id': new ObjectID(kindergarten.id)
        }
    },
    employeeid: (kindergartenId, employeeId) => {
        console.log('employeeId')
        console.log(employeeId)
        return {
            '_id': new ObjectID(kindergartenId),
            'employees': {$elemMatch:{$eq:new ObjectID(employeeId)}}
        }
    },
    month: (employee, entry) => {
        return { 
            'employeeId': new ObjectID(employee.id), 
            'year': entry.year,
            'month': entry.month
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

class KindergartenRepository {

    listKindergartens() {
        return new Promise((resolve, reject) => {
            db.collection(collection)
                .find({},{employees:0})
                .sort({ name: +1})
                .toArray()
                .then(kindergartens => {
                    resolve(kindergartens);
                })
        });
    }

    listKindergartenEmployees(kindergarten) {
        return new Promise((resolve, reject) => {
            db.collection(collection)
                .find(filters.id(kindergarten), {_id: 0, employees:1})
                .sort({ name: +1})
                .toArray()
                .then(employees => {
                    resolve(employees);
                })
        });
    }

    async isEmployee(kindergartenid, employeeid) {
      const result = await db.collection(collection)
        .find(filters.employeeid(kindergartenid, employeeid), {_id: 0, employees:1})
        .toArray();
    
      return result.length > 0
    }
}

module.exports = KindergartenRepository;