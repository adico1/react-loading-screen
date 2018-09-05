const MongoClient = require('mongodb').MongoClient
const { ConnectionString } = require('mongo-connection-string');

const connectionString = new ConnectionString({
  hosts: [{ host: 'localhost', port: 27017 }, { host: 'localhost', port: 27018 }],
  database: 'lab',
  options: {
    replicaSet: 'rs0'
  }
});

const DBS_URI = [
  connectionString.toURI()
]

class PersistantStorage {
  constructor(app) {
    this.db = null;
  }

  log(msg) {
    console.log(msg)
  }
  
  
  async connect(url) {
    const db = await MongoClient.connect(url, {
      reconnectTries : Number.MAX_VALUE,
      autoReconnect : true,
      useNewUrlParser: true
    });

    
    const log = dbInstance.log.bind(dbInstance);

    db.on('close', () => {log('db close')});
    db.on('error', () => {log('db error')});
    db.on('fullsetup', () => {log('db fullsetup')})
    db.on('parseError', () => {log('db parseError')})
    db.on('reconnect', () => {log('db reconnect')})
    db.on('timeout', () => {log('db timeout')})

    return db;
  }

  async ready() {
    const promises = DBS_URI.map(this.connect);
    this.client = await Promise.all(promises);
    this.db = this.client.map(item => item.db('lab'));
  }

  get() {
    if(!this.db) {
      throw new Error('not ready');
    }

    return this.db[0];
  }

  close() {
    if (this.db) {
      this.db.map(item => {
        item.close().catch(error => console.log(error))
      })
    }
  }
}

const dbInstance = new PersistantStorage();

exports = module.exports = {  
  get: dbInstance.get.bind(dbInstance),
  close: dbInstance.close.bind(dbInstance),
  ready: dbInstance.ready.bind(dbInstance)
};