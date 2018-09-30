'use strict';

// package references
const express = require('express');

// app references
const HoursReportManager = require('../services/hours-report-manager');

// initialization
const hoursReportManager = new HoursReportManager();

import { KINDERGARTEN_ID_REQUIRED, EMPLOYEE_ID_REQUIRED, EMPLOYEE_CODE_REQUIRED, 
  NOT_EMPLOYEE, EMPLOYEE_CODE_INVALID, ENTRY_SUCCESS, EXIT_SUCCESS, UNEXPECTED_ERROR, DOUBLE_EXIT, DOUBLE_ENTRY } from '../shared/hours-report-consts';

const reportStrategy = (request, response, direction) => {

  const { kindergartenid, employeeid, employeecode } = request.params;

  if (!kindergartenid) {
      response.status(400).send(KINDERGARTEN_ID_REQUIRED);
  } else if (!employeeid) {
    response.status(400).send(EMPLOYEE_ID_REQUIRED);
  } else if (!employeecode) {
    response.status(400).send(EMPLOYEE_CODE_REQUIRED);
  } else {
    let strategy = null;
    let message = null;

    if(direction === 'IN') {
      strategy = hoursReportManager
        .addEntry(kindergartenid, employeeid, employeecode)
        message = ENTRY_SUCCESS
    } else {
      strategy = hoursReportManager
        .addExit(kindergartenid, employeeid, employeecode)
        message = EXIT_SUCCESS;
    }
    
    strategy.then((result) => {
      console.log('result: ', result);
      switch(result) {
        case NOT_EMPLOYEE:
          response.status(400).send(NOT_EMPLOYEE) 
          break;
        case EMPLOYEE_CODE_INVALID:
          response.status(400).send(EMPLOYEE_CODE_INVALID) 
          break;
        case DOUBLE_ENTRY:
          response.status(400).send(DOUBLE_ENTRY) 
          break;
        case DOUBLE_EXIT:
          response.status(400).send(DOUBLE_EXIT) 
          break;
        case ENTRY_SUCCESS:
          response.status(200).send(message) 
          break;
        default:
          response.status(500).send(UNEXPECTED_ERROR) 
      }
    })
      .catch(error => {
          console.log(error.message);
          response.status(500).send(UNEXPECTED_ERROR);
      });
  }
}
// build router

const hoursReportRouter = () => {
    const router = express.Router();

    router
        .post('/kindergarten/:kindergartenid/employee/:employeeid/:employeecode/hours-report/entry', (request, response) => {
          reportStrategy(request, response, 'IN');
        })
        .post('/kindergarten/:kindergartenid/employee/:employeeid/:employeecode/hours-report/exit', (request, response) => {
          reportStrategy(request, response, 'OUT');
        })
        .get('/kindergarten/:kindergartenid/employee/:employeeid/hours-report/:monthofyear', (request, response) => {

            const { kindergartenid, employeeid, monthofyear } = request.params;

            if (!kindergartenid) {
              response.status(400).send(KINDERGARTEN_ID_REQUIRED);
            } else if (!employeeid) {
              response.status(400).send(EMPLOYEE_ID_REQUIRED);
            } else if (!monthofyear) {
              response.status(400).send(REPORT_DAY_REQUIRED);
            } else {
              hoursReportManager
                    .findHoursReportByMonth(kindergartenid, employeeid, monthofyear)
                    .then(hoursReport => response.json(hoursReport))
                    .catch(error => {                    
                        console.log(error);
                        response.status(500).send(UNEXPECTED_ERROR);
                    });
            }
        });

    return router;
};

module.exports = hoursReportRouter;