'use strict';

// package references
const express = require('express');

// app references
const KidsPresenceReportManager = require('../services/kids-presence-report-manager');

// initialization
const kidsPresenceReportManager = new KidsPresenceReportManager();

import { KINDERGARTEN_ID_REQUIRED, KID_ID_REQUIRED, NOT_KID, 
  ENTRY_SUCCESS, EXIT_SUCCESS, REMOVE_ENTRY_SUCCESS, REMOVE_EXIT_SUCCESS, 
  UNEXPECTED_ERROR, DOUBLE_EXIT, DOUBLE_ENTRY } 
  from '../shared/kids-report-consts';

const reportStrategy = (request, response, direction) => {

  const { kindergartenid, kidid } = request.params;

  if (!kindergartenid) {
      response.status(400).send(KINDERGARTEN_ID_REQUIRED);
  } else if (!kidid) {
    response.status(400).send(KID_ID_REQUIRED);
  } else {
    let strategy = null;
    let message = null;

    console.log('direction', direction);

    if(direction === 'IN') {
      strategy = kidsPresenceReportManager
        .addEntry(kindergartenid, kidid)
        message = ENTRY_SUCCESS
    } else if(direction === 'OUT') {
      strategy = kidsPresenceReportManager
        .addExit(kindergartenid, kidid)
        message = EXIT_SUCCESS;
    } else if(direction === 'REMOVE-IN') {
      strategy = kidsPresenceReportManager
        .removeEntry(kindergartenid, kidid)
        message = REMOVE_ENTRY_SUCCESS
    } else if(direction === 'REMOVE-OUT') {
      strategy = kidsPresenceReportManager
        .removeExit(kindergartenid, kidid)
        message = REMOVE_EXIT_SUCCESS;
    }
    
    strategy.then((result) => {
      console.log('result: ', result);
      switch(result) {
        case NOT_KID:
          response.status(400).send(NOT_EMPLOYEE) 
          break;
        case DOUBLE_ENTRY:
          response.status(400).send(DOUBLE_ENTRY) 
          break;
        case DOUBLE_EXIT:
          response.status(400).send(DOUBLE_EXIT) 
          break;
        case ENTRY_SUCCESS:
        case EXIT_SUCCESS:
        case REMOVE_ENTRY_SUCCESS:
        case REMOVE_EXIT_SUCCESS:
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

const kidsPresenceReportRouter = () => {
    const router = express.Router();

    router
        .post('/kindergarten/:kindergartenid/kid/:kidid/kids-presence-report/entry', (request, response) => {
          reportStrategy(request, response, 'IN');
        })
        .post('/kindergarten/:kindergartenid/kid/:kidid/kids-presence-report/exit', (request, response) => {
          reportStrategy(request, response, 'OUT');
        })
        .post('/kindergarten/:kindergartenid/kid/:kidid/kids-presence-report/remove-entry', (request, response) => {
          reportStrategy(request, response, 'REMOVE-IN');
        })
        .post('/kindergarten/:kindergartenid/kid/:kidid/kids-presence-report/remove-exit', (request, response) => {
          reportStrategy(request, response, 'REMOVE-OUT');
        })
        .get('/kindergarten/:kindergartenid/kids-presence-report', (request, response) => {

          const { kindergartenid } = request.params;

          if (!kindergartenid) {
            response.status(400).send(KINDERGARTEN_ID_REQUIRED);
          } else {
            kidsPresenceReportManager
              .findKidsPresenceReportByDate(kindergartenid)
              .then(kidsReport => response.json(kidsReport))
              .catch(error => {                    
                  console.log(error);
                  response.status(500).send(UNEXPECTED_ERROR);
              });
          }
        });

    return router;
};

module.exports = kidsPresenceReportRouter;