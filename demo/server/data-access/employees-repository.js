'use strict';

const ObjectID = require('mongodb').ObjectID;
const DbConnection = require('./persist-manager');

const collection = 'employees';

const db = DbConnection.get();

const filters = {
    id: (employee) => {
        return {
            '_id': new ObjectID(employee.id)
        }
    },
    kindergartenid: (kindergarten) => {
        return {
            'kindergartenId': new ObjectID(kindergarten.id)
        }
    },
    code: (employee) => {
        return {
            '_id': new ObjectID(employee.id), 
            'hrcore': employee.code,
        }
    }
};

const projections = {
    employeesNameId: () => {
        return {
            fields: { name: 1 }
        }
    }
};

class EmployeeRepository {

    list(kindergarten) {
        return new Promise((resolve, reject) => {
            db.collection(collection)
                .find(filters.kindergartenid(kindergarten), projections.employeesNameId())
                .sort({ name: +1})
                .toArray()
                .then(employees => {
                    console.log('employees: ');
                    console.dir(employees);
                    resolve(employees);
                })
        });
    }

    async isEmployeeCodeValid(employee) {
        console.log('filters code:');
        console.dir(filters.code(employee));
      const result = await db.collection(collection)
        .find(filters.code(employee))
        .toArray();
    
        console.log('isEmployeeCodeValid result:');
        console.dir(result);
      return result.length > 0
    }
}

module.exports = EmployeeRepository;