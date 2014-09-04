define([
  'angular',
  'services',
  'directives',
  'controllers',
  '_',
  'uiRouter',
  'angularRoute',
  'angularResource',
  'angularAnimate'
  ],
  function(angular, services, directives, controllers, _, uiRouter) {
    'use strict';

    var myApp = angular.module('myApp', [
      'ngRoute',
      'ngResource',
      'ngAnimate',
      'myApp.services',
      'myApp.directives',
      'myApp.controllers',
      'ui.router'
    ]);

    myApp.run(function($rootScope, $templateCache, $http, $location, $window, $state, $stateParams, loggedIn){


      /* Setup */

      $rootScope.containerAdjuster = '';
      $rootScope.is_logged_in = false;

      $rootScope.$on('$viewContentLoaded', function() {
        // Prevent view/route caching issues.
        $templateCache.removeAll();
      });

      $rootScope.$on('$stateChangeStart', function(event) {
        var deferredLogin = loggedIn();

        deferredLogin.then(function(){
          // Successful authentication.
          $rootScope.is_logged_in = true;
        }, function() {
          // Failed to authenticaate.
          $rootScope.is_logged_in = false;
        });
      });

      $rootScope.$on("$stateChangeSuccess",  function(event, toState, toParams, fromState, fromParams) {
        // To be used for back button (won't work when page is reloaded).
        $rootScope.previousState_name = fromState.name;
        $rootScope.previousState_params = fromParams;

        if (toState.name == 'root.projects.show') {
          $rootScope.currentProject = toParams;
        }
        else {
          $rootScope.currentProject = false;
        }
      });


      /* Global Helper Functions */

      // Logout function is available in any page.
      $rootScope.logout = function(){
        $http.get('/api/logout.json');
        $window.sessionStorage.token = false;
        $rootScope.is_logged_in = false;
        $location.url('/projects');
      };

      $rootScope.back_or_home = function() {
        // Back button function called from back buttons: ng-click="back_or_home()"
        if ($rootScope.previousState_name) {
          $state.go($rootScope.previousState_name, $rootScope.previousState_params);
        }
        else {
          $state.go('root.default');
        }
      };


      // Log a love note to our users.
      console.log("%cInterested in my work? Contact me at bradley.j.griffith@gmail.com. The source code for this site will be on GitHub soonish.", 'font-size: 11px; color: #0000FF');
    });
    return myApp;
  }
);
