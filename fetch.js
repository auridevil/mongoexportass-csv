'use strict';


const MongoClient = require('mongodb').MongoClient;
const boom = require('koa-boom')();

module.exports = () => {
  return function*(next) {
    let args = this.request.body;
    let db = yield MongoClient.connect(args.mongo);
    let coll = db.collection(args.collection);
    let query = args.query || {};
    let option = args.projection || {};
    let dataset = yield coll.find(query,option).toArray();
    this.dataset = dataset;
    yield next;
    db.close();
  }
}

var old = function() {
  return function*(next) {
    var args = this.request.body;
    var dbConnection;
    ASQ((done) => { // connect
      MongoClient.connect(args.mongo, done.errfcb);
    }).then((done, db) => { // query
      dbConnection = db;
      let coll = db.collection(args.collection);
      let query = args.query || {};
      coll.find(query, done.errfcb);
    }).then((done, dataset) => { // convert to csv
      serializer(
        dataset || [],
        done.errfcb,
        {
          checkSchemaDifferences: false,
          delimiter: {
            fields: args.delimiter.fields || ',',
            array: args.delimiter.array || ';',
            line: args.delimiter.line || '\n'
          }
        }
      );
    }).then((done, csv) => {
      console.log(csv);
      this.body = csv;
      // yield next();
      done();
      if (dbConnection) dbConnection.close();
    }).or((err) => {
      if (dbConnection) dbConnection.close();
      new Boom(err);
    })
  }
}