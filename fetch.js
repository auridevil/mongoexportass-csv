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
  };
};
