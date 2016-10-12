'use strict';


const koa = require('koa')();
const app = require('koa-router')();
const body_parser = require('koa-body')();
const validate = require('./validate');
const auth = require('./auth');
const fetch = require('./fetch');
const serialize = require('./serialize')
const port = process.env.PORT || 3000;


app.post(
  '/export', body_parser, auth(), validate(), fetch(), serialize(), function*(next) {
    this.status = 200;
  });

app.get(
    '/export',function*(next){

    }
)


koa.use(app.routes());
koa.listen(port);
console.log('service started on ', port);