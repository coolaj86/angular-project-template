'use strict';

var Promise = require('bluebird')
  , utils = require('./bookshelf-utils')
  ;
  
function init(knex, meta, tableMap) {
  var Orm = require('bookshelf').initialize(knex)
    , definitions = require('./model-definitions').models
    , Db = require('./model-definitions').Db
    , emu = meta.xattrs.type // json | text
    ;

  function createModel(tablename, obj) {
    var ucamel = tablename
      , snake = utils.str.underscored(tablename)
      ;

    if (!obj.tableName) {
      obj.tableName = snake;
    }

    if ('undefined' === typeof obj.hasTimestamps) {
      // TODO which should this be?
      obj.hasTimestamps = ['createdAt', 'updatedAt'];
      //obj.hasTimestamps = ['created_at', 'updated_at'];
    }

    if (!tableMap[obj.tableName]) {
      console.warn("[createModel] '" + obj.tableName + "' is declared as a model, but has no associated table");
      return;
    }

    //console.log('[createModel]', obj.tableName, ucamel);
    //console.log('[createModel.format]');
    obj.format = utils.format(emu, 'xattrs', tableMap[obj.tableName], []/*jsonCols*/);
    //console.log('[createModel.parse]');
    obj.parse = utils.parse(emu, 'xattrs', tableMap[obj.tableName], []/*jsonCols*/);
    Db[ucamel] = Orm.Model.extend(obj);

    return Db[ucamel];
  }

  function createModels(map) {
    /*
    console.log('[createModels]');
    console.log(map);
    console.log('');
    */
    Object.keys(map).forEach(function (key) {
      /*
      console.log('[createModel]', key);
      console.log(map[key]);
      console.log('');
      */
      createModel(key, map[key]);
    });
  }

  createModels(definitions);
  return Db;
}

module.exports.create = function myCreate(knex) {
  var tablesMap = {}
    , info
    ;

  function createTables() {
    //console.log('[create tables]');
    return require('../migrations').create(knex).then(function () {
      return myCreate(knex);
    });
  }

  try {
    info = knex('_st_meta_').columnInfo();
  } catch(e) {
    console.error("Couldn't get columnInfo");
    console.error(e);
    return createTables();
  }

  return info.then(function (meta) {
    //console.log('[meta info]');
    //console.log(meta);
    if (0 === Object.keys(meta).length) {
      console.error('[no keys]', meta);
      return createTables();
    }

    // TODO provide an array
    var tables = ['accounts', 'accounts_logins', 'logins']
      , infos = []
      ;

    tables.forEach(function (table) {
      var p
        ;

      p = knex(table).columnInfo().then(function (cols) {
        //console.log('[columnInfo]', table);
        //console.log(cols);
        tablesMap[table] = cols;
      }, function (err) {
        console.error('[no table]', table);
        console.error(err);
      });

      infos.push(p);
    });

    return Promise.all(infos).then(function () {
      return init(knex, meta, tablesMap);
    });
  }, function (err) {
    console.error('[bookshelf-models] [ERROR]');
    console.error(err);
  });
};