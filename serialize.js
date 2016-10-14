'use strict';

const csv = require('koa-simple-json2csv');
const koastream = require('koa-stream');
const ObjectID = require('mongodb').ObjectID;
const _ = require('underscore');


module.exports = () => {
  return function*(next) {

    let fields = _.keys(this.request.body.projection) || getFields(this.dataset);

    let obj = yield csv({
      data: this.dataset,
      fields
    });

    koastream.buffer(this, Buffer.from(obj), 'application/excel', {allowDownload: true});
    this.status = 200;
  };
};


function getFields(dataset) {

  let extendedKeys = (itm)=> {
    let fields = [];
    let keys = _.keys(itm);
    for (let k of keys) {
      if (_.isObject(itm[k]) && (itm[k] instanceof ObjectID) === false) {
        let innerFields = extendedKeys(itm[k]);
        innerFields = _.map(innerFields, (field)=> {
          return k + '.' + field;
        });
        fields = _.union(fields, innerFields);
      } else {
        fields.push(k);
      }

    }
    return fields;
  };

  var fields = [];
  _.each(dataset, (itm)=> {
    fields = _.union(fields, extendedKeys(itm));
  });

  return fields;
}

