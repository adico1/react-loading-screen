'use strict';

const HoursReportRepository = require('../data-access/hours-report-repository');
const assert = require('assert');
const hoursReportRepository = new HoursReportRepository();

const mapToHoursReportDto = (hoursReport) => {
    assert(hoursReport, 'Note is required');

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
        month: now.getMonth(),
        day: now.getDay(),
        time: now.getHours() + ':' + now.getMinutes()
    };
};

const createKindergarten = (id) => {
    return { id };
};

const createEmployee = (id, employeeCode) => {
    return { 
        id, 
        code: employeeCode 
    };
};

class HoursReportManager {    

    async addEntry(kindergartenId, employeeId, employeeCode) {

        assert(kindergartenId, 'Kindergarten Id is required');
        assert(employeeId, 'Employee Id is required');
        assert(employeeCode, 'Employee Code is required');
        
        const kindergarten = createKindergarten(kindergartenId);
        const employee = createEmployee(employeeId, employeeCode);
        const entry = createNewEntry();
        
        return await hoursReportRepository
                .addEntry(kindergarten, employee, entry)
    }

    async addExit(employee, date) {

      assert(title, 'Title is required');
      assert(content, 'Content is required');
      
      const entry = createNewEntry(date);

      return await hoursReportRepository
              .addExit(employee, entry)
    }

    async findHoursReportByMonth(kindergartenid, employeeid, monthofyear) {
        
        assert(kindergartenid, 'KindergartenId is required');
        assert(employeeid, 'EmployeeId is required');
        assert(monthofyear, 'MonthOfYear is required');
        
        return await hoursReportRepository
            .findHoursReportByMonth(kindergartenid, employeeid, monthofyear)
    }
}

module.exports = HoursReportManager;