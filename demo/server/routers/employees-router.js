'use strict';

// package references
const express = require('express');

// app references
const EmployeesManager = require('../services/employees-manager');

// initialization
const employeesManager = new EmployeesManager();

// build router

const employeesRouter = () => {
    const router = express.Router();

    router
        .get('/kindergarten/:id/employees', (request, response) => {

            const kindergartenid = request.params.id;

            if (!kindergartenid) {
              response.status(400).send('Kindergarten id is required');
            } else {
                employeesManager
                    .list(kindergartenid)
                    .then((employees) => response.status(200).send(JSON.stringify(employees)))
                    .catch(error => {
                        console.log(error.message);
                        response.status(500).send();
                    });
            }
        });

    return router;
};

module.exports = employeesRouter;