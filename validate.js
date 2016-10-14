'use strict';

const boom = require('koa-boom')();


module.exports = () => {
  return function*(next) {
    if (!this.request.body.mongo) {
      boom.badRequest(this, 'missing mongo connection string');
    }
    if (!this.request.body.collection) {
      boom.badRequest(this, 'missing collection');
    }
    yield next;
  };
};




