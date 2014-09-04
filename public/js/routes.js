define(['angular', 'app'], function(angular, app) {
	'use strict';

	return app.config(['$stateProvider', '$injector', '$urlRouterProvider', '$routeProvider', function($stateProvider, $injector, $urlRouterProvider, $routeProvider) {

    $urlRouterProvider.when('', '/projects');

    $stateProvider
      .state('root', {
        url: '/',
        templateUrl: '/partials/layouts/application_layout.html',
        abstract: true
      })
      .state('root.default', {
        url: '',
        controller: function($location) {
          // Redirect to projects for now. In the future we could display a 'home' page at this route.
          $location.url('/projects');
        }
      })
      .state('root.not_found', {
        url: 'not_found',
        templateUrl: '/partials/unfound.html',
        controller: 'unfoundController'
      })
      .state('root.projects', {
        url: 'projects',
        templateUrl: '/partials/projects/index.html',
        controller: 'projectsIndexController',
        abstract: true,
        resolve: {
          projects: function(projectsResource, $stateParams) {
            return projectsResource.query().$promise;
          }
        }
      })
      .state('root.projects.default', {
        url: '',
        templateUrl: '/partials/projects/default.html'
      })
      .state('root.projects.show', {
        url: '/:id',
        templateUrl: '/partials/projects/show.html',
        controller: 'projectsShowController',
        animate: 'public-project-transition',
        resolve: {
          project: function(projectsResource, $stateParams) {
            var projectId = $stateParams.id;
            return projectsResource.get({projectId: projectId}).$promise;
          }
        }
      })
      .state('root.information', {
        url: 'information',
        templateUrl: '/partials/information/show.html'
      })
      .state('root.session', {
        url: 'login',
        templateUrl: 'partials/sessions/new.html',
        controller: 'sessionsNewController',
        resolve: {
          loggedout: function(ensureLoggedOut) {
            return ensureLoggedOut();
          }
        }
      })
      .state('admin', {
        url: '/admin',
        templateUrl: 'partials/layouts/admin_layout.html',
        abstract: true
      })
      .state('admin.new_project', {
        url: '/projects/new',
        templateUrl: 'partials/projects/new.html',
        controller: 'adminProjectsNewController',
        animate: 'expose-private-parts',
        resolve: {
          loggedin: function(ensureLoggedIn) {
            return ensureLoggedIn();
          }
        }
      })
      .state('admin.edit_project', {
        url: '/projects/:id',
        templateUrl: 'partials/projects/edit.html',
        controller: 'adminProjectsEditController',
        animate: 'expose-private-parts',
        resolve: {
          loggedin: function(ensureLoggedIn) {
            return ensureLoggedIn();
          },
          project: function(projectsResource, $stateParams){
            var projectId = $stateParams.id;
            return projectsResource.get({projectId: projectId}).$promise;
          }
        }
      });

      $urlRouterProvider
        .otherwise("/not_found");

	}]);
});
