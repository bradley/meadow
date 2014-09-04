define(['angular', 'app'], function(angular, app) {
	'use strict';

  /* Interceptors */

	return app.config(['$httpProvider', '$locationProvider', '$injector', function($httpProvider, $locationProvider, $injector) {
    $httpProvider.interceptors.push(function($q, $location, $window) {
      // Check status of any intercepted HTTP response and redirect to login if 401 or 403.
      var deferred = $q.defer();
      return {
        request: function (config) {
          config.headers = config.headers || {};
          if ($window.sessionStorage.token) {
            config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
          }
          return config;
        },
        responseError: function (response) {
          if (response.status === 401 || response.status === 403) {
            console.error('Unauthorized access attempt!');
            $window.sessionStorage.token = false;

            deferred.reject(response);
            $location.url('/login');
          }
          else if (response.status == 404) {
            console.error('404 Response. Redirecting.');
            $location.url('/not_found');
          }

          return deferred.promise;
        }
      }
    });
	}]);
});