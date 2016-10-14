'use strict';


const koa = require('koa')();
const app = require('koa-router')();
const middlewares = require('koa-middlewares');
// const react = require('koa-react-view');
const path = require('path');

const validate = require('./validate');
const auth = require('./auth');
const fetch = require('./fetch');
const serialize = require('./serialize');
const home = require('./controllers/home');
const port = process.env.PORT || 3000;

app.get('/', home);

app.post(
  '/export', auth(), validate(), fetch(), serialize(), function*(next) {
    this.status = 200;
    yield next;
  });


koa.use(middlewares.rt());

app.use(middlewares.staticCache(path.join(__dirname, 'public'), {
  buffer: process.env.DEBUG ? false : true,
  maxAge: process.env.DEBUG ? 0 : 60 * 60 * 24 * 7
}));

app.use(middlewares.bodyParser());

koa.use(app.routes());

koa.listen(port);


console.log('service started on ', port);
