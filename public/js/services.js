define(['angular'], function(angular) {
	'use strict';


  /* Services */

	angular.module('myApp.services', [])
    .factory('projectsResource', ['$resource', function($resource) {
      return $resource('/api/projects/:projectId', { projectId: '@id' } )
    }])
		.factory('loggedIn', ['$q', '$timeout', '$http', '$location', '$rootScope', '$window', function($q, $timeout, $http, $location, $rootScope, $window) {
			return function(){
        // Initialize a new promise
        var deferred = $q.defer();

        // Make an AJAX call to check if the user is logged in
        $http.defaults.headers.common['Authorization'] = "Bearer " +  $window.sessionStorage.token;
        $http({ method: 'POST', url: '/api/authenticate_token.json' }).success(function(data, status) {
          if (data.logged_in == true) {
            // Successful authentication.
            $timeout(deferred.resolve, 0);
          }
          else {
            // Failed to authenticate.
            $timeout(deferred.reject, 0);
          }
        }).error(function() {
          // TODO: Handle any additional error.
        });

        return deferred.promise;
      }
	  }])
		.factory('ensureLoggedIn', ['$q', '$timeout', '$http', '$location', '$rootScope', '$window', 'loggedIn', function($q, $timeout, $http, $location, $rootScope, $window, loggedIn) {
			return function(){
				var deferred = $q.defer(),
						deferredLogin = loggedIn();
        deferredLogin.then(function(){
        	// Successful authentication.
        	$timeout(deferred.resolve, 0);
        }, function() {
        	// Failed to authenticate.
          $timeout(function(){ deferred.reject(); }, 0);
          $window.sessionStorage.token = false;
          $location.url('/login');
        });

        return deferred.promise;
      }
	  }])
    .factory('ensureLoggedOut', ['$q', '$timeout', '$http', '$location', '$rootScope', '$window', 'loggedIn', function($q, $timeout, $http, $location, $rootScope, $window, loggedIn) {
      return function(){
        var deferred = $q.defer(),
            deferredLogin = loggedIn();
        deferredLogin.then(function(){
          // Successful authentication. Redirect.
          $timeout(function(){ deferred.reject(); }, 0);
          $location.url('/projects');
        }, function() {
          // Failed to authenticate.
          $timeout(deferred.resolve, 0);
        });

        return deferred.promise;
      }
    }]);
});
