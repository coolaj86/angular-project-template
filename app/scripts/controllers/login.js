'use strict';

angular.module('yololiumApp')
  .controller('LoginCtrl', function ($http, $modalInstance, StSession, StApi) {
    var scope = this
      // TODO this is a code smell $http and apiPrefix should move to a service
      , apiPrefix = StApi.apiPrefix
      ;

    // Crazy window open/close hacks and mobile chrome on iOS workarounds

    scope.title = "Sign in or Create account";
    function closeWithSession(err, session) {
      console.log('[login.js] closeWithSession');
      $modalInstance.close(session);
    }

    StSession.makeLoginsInScope(scope, closeWithSession);

    //
    // Modal
    //
    scope.cancel = function () {
      $modalInstance.dismiss({
        cancelled: true
      , ignore: true
      , source: 'login-modal'
      , name: 'LoginCancelled'
      , message: 'escape button click'
      , toString: function () { return this.name + ': ' + this.message; }
      });
    };

    scope.showEmail = function () {
      scope.emailShown = true;
    };

    //
    // ID & Secret (User & Pass)
    //
    scope.authId = "";
    scope.authSecret = "";
    scope.loginWithBasicAuth = function () {
      var auth = { 'Authorization': 'Basic ' + btoa(scope.authId + ':' + scope.authSecret) }
        , form = null
        ;

      if ('create-account' === scope.authType) {
        // TODO allow account creation
        form = { create: true };
      }

      // TODO UI needs spinner
      $http.post(apiPrefix + '/session/basic', form, { headers: auth }).then(function (resp) {
        console.log('[Basic Auth] resp.data');
        console.log(resp.data);

        if (resp.data && resp.data.mostRecentLoginId) {
          scope.alertType = "";
          scope.alertMessage = "";
          scope.authToken = "";
          $modalInstance.close(resp.data);
        } else {
          scope.alertMessage = "Invalid Username & Passphrase";
          scope.alertType = 'alert-danger';
        }
      });
    };

    //
    // Access Token
    //
    scope.demoProfiles = StApi.testProfiles;
    scope.authToken = "";
    scope.loginWithToken = function () {
      var auth = { 'Authorization': 'Bearer ' + scope.authToken }
        ;

      scope.alertType = 'alert-info';
      scope.alertMessage = "Logging in...";

      // TODO allow use of token in place of session cookies
      // TODO XSRF-TOKEN in cookie and X-XSRF-TOKEN in header
      // $http.defaults.headers.common.Authorization = 'Bearer xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
      $http.post(apiPrefix + '/session/bearer', null, { headers: auth }).then(function (resp) {
        console.log('[Bearer Auth] resp.data');
        console.log(resp.data);

        if (resp.data && resp.data.mostRecentLoginId) {
          scope.alertType = "";
          scope.alertMessage = "";
          scope.authToken = "";
          $modalInstance.close(resp.data);
        } else {
          scope.alertMessage = "Invalid Access Token";
          scope.alertType = 'alert-danger';
        }
      });
    };
  });
