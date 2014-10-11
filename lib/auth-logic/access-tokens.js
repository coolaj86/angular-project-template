'use strict';

module.exports.create = function (DB, BearerLogins) {
  var authutils = require('./utils-auth')
    //, utils = require('./provide-oauth2/oauthy-dbs/utils')
    , PromiseA = require('bluebird').Promise
    ;

  function AccessTokens() {
  }
  AccessTokens.create = function (values) {
    var token = authutils.genSalt(192)
      , id = authutils.hashsum('sha256', token)
      ;

    values.id = id;
    // TODO hand back the original token, but don't save it
    values.token = token;

    // tokens will generally only have one account, but
    // a resource-owner-password token will have all of them

    // values.primaryAccountId

    // TODO better error handling
    if (!values.accounts || !values.accounts.length) {
      return PromiseA.reject(new Error("No account specified"));
    }

    return DB.Accesstokens.forge().save(values, { method: 'insert' }).then(function ($token) {
      return BearerLogins.create({ uid: $token.get('id') }).then(function ($login) {
        return BearerLogins.linkAccounts($login, values.accounts).then(function () {
          if (values.primaryAccountId) {
            return BearerLogins.setPrimaryAccount($login, values.primaryAccountId).then(function () {
              return $token;
            });
          }

          return $token;
        });
      });
    });
  };
  AccessTokens.login = function (token) {
    var id = authutils.hashsum('sha256', token)
      ;

    // TODO check expiresAt
    return DB.Accesstokens.forge({ id: id }).fetch().then(function ($token) {
      return BearerLogins.login({ uid: $token.get('id') }).then(function ($login) {
        $token.$login = $login;

        return $token;
      });
    });
  };

  return AccessTokens;
};