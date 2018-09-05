'use strict';


// package references


import * as axios from 'axios';


// db options


const baseApiUrl = 'http://localhost:3000/api';


const listEmployeesByKindergarten = (id) => {

    return new Promise((resolve, reject) => {
        axios
            .get(`${baseApiUrl}/kindergarten/${id}/employees`)
            .then(response => {
                resolve(response.data);
                return;
            })
            .catch(error => {
                reject(error.message);
                return;
            });
    });

};

// exports


module.exports = {
    'listEmployeesByKindergarten': listEmployeesByKindergarten
};