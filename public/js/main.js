requirejs.config({
  waitSeconds: 200,
  paths: {
    angular           : '//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min',
    angularRoute      : '//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular-route.min',
    angularAnimate    : '//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular-animate.min',
    angularResource   : '//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular-resource.min',
    uiRouter          : '/vendor/js/angular-ui-router',
    _                 : '/vendor/js/underscore-min'
  },
  shim: {
    'angular'           : {'exports': 'angular'},
    'angularRoute'      : ['angular'],
    'angularAnimate'    : ['angular'],
    'angularResource'   : ['angular'],
    'uiRouter'          : ['angular']
  },
  priority: [
    'angular'
  ]
});

// http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = 'NG_DEFER_BOOTSTRAP!';

define([
  'angular',
  'angularRoute',
  'angularAnimate',
  'angularResource',
  'uiRouter',
  'app',
  'routes',
  'interceptors',
], function(angular, angularRoute, angularAnimate, angularResource, uiRouter, app, routes, interceptors) {
  'use strict';
  var $html = angular.element(document.getElementsByTagName('html')[0]);

  angular.element().ready(function() {
    angular.resumeBootstrap([app['name']]);
  });
});
