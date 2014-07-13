'use strict';

angular.module('yololiumApp')
  .controller('NavCtrl', function ($scope, $state, StSession, mySession, StPayInvoice) {
    var scope = this
      , allTabs
      ;

    allTabs = [
      { active: $state.includes('root')
      , title: 'Home'
      , href: $state.href('root')
      }
    , { active: $state.includes('store')
      , title: 'Store'
      , href: $state.href('store')
      }
    , { active: $state.includes('admin')
      , title: 'Admin'
      , href: $state.href('admin')
      , roles: ['admin']
      }
    , { active: $state.includes('user')
      , title: 'User'
      , href: $state.href('user')
      , roles: ['user']
      }
    , { active: $state.includes('about')
      , title: 'About'
      , href: $state.href('about')
      }
    ];

    function updateSession(session) {
      if (!session || !session.account || session.guest || 'guest' === session.account.role) {
        session = null;
      }

      scope.session = session;
      scope.account = session && session.account;
      scope.tabs = allTabs.filter(function (tab) {
        if (!tab.roles || !tab.roles.length) { return true; }
        if (!scope.session) { return false; }
        return -1 !== tab.roles.indexOf(scope.account.role);
      });
    }

    StSession.subscribe(updateSession, $scope);
    updateSession(mySession);

    scope.showLoginModal = function () {
      StSession.ensureSession().then(function (session) {
        console.log('NAV ENSURE SESSION', session);
        updateSession(session);
      }, function () {
        // nada
      });
    };

    scope.logout = function () {
      StSession.destroy().then(function () {
        updateSession(null);
      }, function () {
        // nada
      });
    };

    scope.bookGig = function () {
      StPayInvoice.show();
    };
  });
