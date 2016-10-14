'use strict';

const boom = require('koa-boom')();
const APIKEY = process.env.APIKEY || false;

module.exports = () => {
  return function*(next) {
    if (APIKEY && (this.request.body.apikey !== APIKEY)) {
      boom.unauthorized(this, 'missing apikey');
    }
    yield next;
  };
};
