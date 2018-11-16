'use strict';


// package references


import * as axios from 'axios';


// db options


const baseApiUrl = 'http://localhost:3000/api';


const listKidsPresenceByDate = (id) => {

    return new Promise((resolve, reject) => {
        axios
            .get(`${baseApiUrl}/kindergarten/${id}/kids-presence-report`)
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

const signEntry = (id, kidid) => {
    return new Promise((resolve, reject) => {
        axios
            .post(`${baseApiUrl}/kindergarten/${id}/kid/${kidid}/kids-presence-report/entry`)
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

const signExit = (id, kidid) => {

    return new Promise((resolve, reject) => {
        axios
            .post(`${baseApiUrl}/kindergarten/${id}/kid/${kidid}/kids-presence-report/exit`)
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

const removeEntry = (id, kidid) => {
    return new Promise((resolve, reject) => {
        axios
            .post(`${baseApiUrl}/kindergarten/${id}/kid/${kidid}/kids-presence-report/remove-entry`)
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

const removeExit = (id, kidid) => {

    return new Promise((resolve, reject) => {
        axios
            .post(`${baseApiUrl}/kindergarten/${id}/kid/${kidid}/kids-presence-report/remove-exit`)
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
    'listKidsPresenceByDate': listKidsPresenceByDate,
    'signEntry': signEntry,
    'signExit': signExit,
    'removeEntry': removeEntry,
    'removeExit': removeExit,
};