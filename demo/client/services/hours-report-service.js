'use strict';


// package references


import * as axios from 'axios';


// db options


const baseApiUrl = 'http://localhost:3000/api';


const signEntry = (id, employeeid, employeecode) => {
    return new Promise((resolve, reject) => {
        axios
            .post(`${baseApiUrl}/kindergarten/${id}/employee/${employeeid}/${employeecode}/hours-report/entry`)
            .then(response => {
                console.log('service->response:')
                console.dir(response)
                resolve(response.data);
                return;
            })
            .catch(error => {
                console.log('service->error:')
                console.dir(error)
                reject(error.response.data);
                return;
            });
    });

};

const signExit = (id, employeeid, employeecode) => {

    return new Promise((resolve, reject) => {
        axios
            .post(`${baseApiUrl}/kindergarten/${id}/employee/${employeeid}/${employeecode}/hours-report/exit`)
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
    'signEntry': signEntry,
    'signExit': signExit,
};