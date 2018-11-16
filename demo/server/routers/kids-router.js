'use strict';

// package references
const express = require('express');

// app references
const KidsManager = require('../services/kids-manager');

// initialization
const kidsManager = new KidsManager();

// build router

const kidsRouter = () => {
    const router = express.Router();

    router
        .get('/kindergarten/:id/kids', (request, response) => {

            const kindergartenid = request.params.id;

            if (!kindergartenid) {
              response.status(400).send('Kindergarten id is required');
            } else {
                kidsManager
                    .list(kindergartenid)
                    .then((kids) => response.status(200).send(JSON.stringify(kids)))
                    .catch(error => {
                        console.log(error.message);
                        response.status(500).send();
                    });
            }
        });

    return router;
};

module.exports = kidsRouter;