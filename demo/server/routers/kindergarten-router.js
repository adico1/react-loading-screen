'use strict';

// package references
const express = require('express');

// app references
const KindergartenManager = require('../services/kindergarten-manager');

// initialization
const kindergartenManager = new KindergartenManager();

// build router

const kindergartenRouter = () => {
    const router = express.Router();

    router
        .get('/kindergartens', (request, response) => {

            kindergartenManager
              .find()
              .then(() => response.status(200).send('Entry checked'))
              .catch(error => {
                  console.log(error.message);
                  response.status(500).send();
              });
        })

    return router;
};

module.exports = kindergartenRouter;