const MongoClient = require('mongodb').MongoClient
const { ConnectionString } = require('mongo-connection-string');

// const connectionString = new ConnectionString({
//   hosts: [{ host: 'localhost', port: 27017 }, { host: 'localhost', port: 27018 }],
//   database: 'lab',
//   options: {
//     replicaSet: 'rs0'
//   }
// });

const dbName = 'lab';
const connectionString = new ConnectionString({
  hosts: [{ host: 'db', port: 27017 }],
  database: dbName
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
  
  async onConnectError(err, url) {
    const log = dbInstance.log.bind(dbInstance);

    log('db error');
    process.exit(50000);

    // If first connect fails because mongod is down, try again later.
    // This is only needed for first connect, not for runtime reconnects.
    // See: https://github.com/Automattic/mongoose/issues/5169
    // if (err.message && err.message.match(/failed to connect to server .* on first connect/)) {
    //   console.log(new Date(), String(err));

    //   // Wait for a bit, then try to connect again
    //   setTimeout(async function () {
    //       console.log("Retrying first connect...");
    //       return await dbInstance.doConnect(url);
    //       // Why the empty catch?
    //       // Well, errors thrown by db.open() will also be passed to .on('error'),
    //       // so we can handle them there, no need to log anything in the catch here.
    //       // But we still need this empty catch to avoid unhandled rejections.
    //   }, 20 * 1000);
    // } else {
    //   // Some other error occurred.  Log it.
    //   console.error(new Date(), String(err));
    //   process.exit(50000);
    // }
  }

  async doConnect(url) {
    const log = dbInstance.log.bind(dbInstance);

    log('Connect URL: ');
    log(url);

    const dbConnectProps = {
      reconnectTries : Number.MAX_VALUE,
      autoReconnect : true,
      useNewUrlParser: true,
      // wait 1 second before retrying
      reconnectInterval: 1000
    };

    // Database Name
    let client;
  
    try {
      // Use connect method to connect to the Server
      client = await MongoClient.connect(url, dbConnectProps);
  
      if(client) {
        const db = client.db(dbName);
        return dbInstance.wrapDb(db, url);  
      }

      return null;
      
    } catch (err) {
      console.log('DB Conect Error Occured');
      console.log(err.stack);
      await dbInstance.onConnectError(err, url);
    }
  }

  wrapDb(db, url) {

    db.on('close', () => {log('db close')});
    db.on('error', () => {
      dbInstance.onConnectError(err, url);
    });

    db.on('fullsetup', () => {log('db fullsetup')})
    db.on('parseError', () => {log('db parseError')})
    db.on('reconnect', () => {log('db reconnect')})
    db.on('timeout', () => {log('db timeout')})

    db.once('open', () => {
      log("Connection to db established.");
    });

    return db;
  }

  async connect(url) {
    try {
      return await dbInstance.doConnect(url);
    } catch( err ) {
      console.error(err);
      dbInstance.onConnectError(err);
    }
  }

  async ready() {
    const promises = DBS_URI.map(this.connect);
    this.client = await Promise.all(promises);
    //this.db = this.client.map(item => item.db('lab'));
    if(this.client) {
      this.db = this.client.map(item => item);
      return true;
    }
    
    return false;
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