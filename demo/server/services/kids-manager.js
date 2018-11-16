'use strict';

const KidsRepository = require('../data-access/kids-repository');
const assert = require('assert');
const kidsRepository = new KidsRepository();

const mapToKidsDto = (kids) => {
    assert(kids, 'Kids list required');

    return kids;
};

const createKindergarten = (id) => {
    return { id };
};

class KidsManager {

    list(id) {
        
        assert(id, 'Id is required');
        
        const kindergarten = createKindergarten(id);
        
        return new Promise((resolve, reject) => {
            kidsRepository
                .list(kindergarten)
                .then(kids => resolve(mapToKidsDto(kids)))
                .catch(error => reject(error));
        });
    }
}

module.exports = KidsManager;