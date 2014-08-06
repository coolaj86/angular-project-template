'use strict';

angular.module('yololiumApp')
  .controller('NavCtrl', ['$rootScope', '$scope', '$state', 'StSession', 'mySession', 'StPayInvoice', 'StApi', function ($rootScope, $scope, $state, StSession, mySession, StPayInvoice, StApi) {
    var scope = this
      , allTabs
      ;

    scope.logo = StApi.business.logo;
    scope.title = StApi.business.title;

    $rootScope.$on('$stateChangeSuccess', function () {
      updateSession(mySession);
    });

    function updateSession(session) {
      allTabs = [
        { active: $state.is('root')
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
        , roles: ['admin', 'root']
        }
      , { active: $state.includes('push')
        , title: 'Push'
        , href: $state.href('push')
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

      if (!session || !session.account || session.guest || 'guest' === session.account.role) {
        console.log('nav session');
        console.log(session);
        session = null;
      }

      var role = session && session.account.role
        ;

      if ('root' === role) {
        role = 'admin';
      }

      scope.session = session;
      console.log('ROLE', role, scope.session);
      scope.account = session && session.account;
      scope.tabs = allTabs.filter(function (tab) {
        if (!tab.roles || !tab.roles.length) { return true; }
        if (!scope.session) { return false; }
        return -1 !== tab.roles.indexOf(role);
      });
      allTabs.forEach(function (tab) {
        if (tab.active) {
          scope.activeTab = tab.title;
        }
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

    scope.payInvoice = function () {
      StPayInvoice.show();
    };
  }]);
