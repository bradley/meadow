define(['angular', 'services'], function(angular) {
	'use strict';


	/* Controllers */

	return angular.module('myApp.controllers', [])
		.controller('sessionsNewController', ['$scope', '$rootScope', '$http', '$window', '$location', function($scope, $rootScope, $http, $window, $location) {


			/* Setup */

      $rootScope.containerAdjuster = 'admin-view';
			$scope.user = {};


			/* Scope Functions */

		  $scope.login = function() {
		    $http.post('./api/login.json', {
		    	user: {
		    		username: $scope.user.username || '',
		      	password: $scope.user.password || '',
		    	}
		    })
		    .success(function(data, status) {
		      if (status === 422) {
            $window.sessionStorage.token = false;
            $location.url('/login');
            return;
          }
          else {
          	$window.sessionStorage.token = data.access_token;
		      	$location.url('/projects');
		      	return;
          }
		    })
		    .error(function() {
		      // TODO: Something bad happened. Handle it.
		    });
		  };

		}]) // End of sessionsNewController
		.controller('projectsIndexController', ['$scope', '$rootScope', 'projects', function($scope, $rootScope, projects) {


			/* Setup */

      $rootScope.containerAdjuster = '';
			$scope.projects = projects;

		}]) // End of projectsIndexController
		.controller('projectsShowController', ['$scope', '$sce', '$rootScope', '$timeout', '$anchorScroll', 'project', function($scope, $sce, $rootScope, $timeout, $anchorScroll, project) {

			/* Setup */

		  var content_ready_timer,
					markdown_converter = new Showdown.converter({ extensions: ['meadow'] });
      $rootScope.containerAdjuster = '';
		  $scope.project = project;
		  $scope.trusted_content;
		  $scope.trusted_footnotes = [];

			convertMarkdownForContent();
			convertMarkdownForFootnotes();


			/* Scope Functions */

			$scope.$on("$destroy", function() {
        if (content_ready_timer) {
        	$timeout.cancel(content_ready_timer);
        }
	    });


			/* Helper Functions */

	    function convertMarkdownForContent() {
	      var rendered = markdown_converter.makeHtml($scope.project.content),
	          html_traversal_wrap = $('<div></div>');

        html_traversal_wrap.append(rendered).find('div.highlight pre').addClass('prettyprint').parent('div.highlight').addClass('prettyprint-wrap');
    		$scope.trusted_content = $sce.trustAsHtml(html_traversal_wrap.html());

    		// Note: Yeah I hate this timeout. We have a problem with the trusted_content reliant DOM elements
    		//   not updating before prettyPrint gets called even when done synchronously
    		//   (scope.$watch doesn't appear to do it either).
    		content_ready_timer = $timeout(function() {
	  			prettyPrint();
	  		}, 10);
	    }

	    function convertMarkdownForFootnotes() {
	    	$.each($scope.project.footnotes, function(i, value) {
	    		var rendered = markdown_converter.makeHtml($scope.project.footnotes[i].content)
				  $scope.trusted_footnotes.push($sce.trustAsHtml(rendered));
				});
	    }


	    /* Scope Functions */

	    $scope.scrollTo = function(id) {

	    	console.log('testing!!!');
	    	console.log(id);
		     $location.hash(id);
		     $anchorScroll();
		  }

		}]) // End of projectsShowController
    .controller('adminProjectsNewController', ['$scope', '$rootScope', '$http', '$window', '$timeout', '$location', function($scope, $rootScope, $http, $window, $timeout, $location) {


    	/* Setup */

      $rootScope.containerAdjuster = 'admin-view';
    	$scope.project = {};


      /* Scope Functions */

      $scope.submitForm = function() {
        $http({method: 'POST', url: './api/admin/projects.json', data: { project: $scope.project } })
          .success(function(data) {
            if (status === 422) {
	            console.log(data.errors);
	            console.log(status);
	            return;
	          }
	          else {
	          	// TODO: Show success message.
	          	$location.path('/projects/' + (data.project.url || $scope.project.url));
			      	return;
	          }
          })
          .error(function(data, status, headers, config) {
            // TODO: Handle this better. Show errors, etc.
            console.error('There was an error when attempting to update this project.');
          });
      }

    }]) // End of adminProjectsNewController
		.controller('adminProjectsEditController', ['$scope', '$rootScope', '$stateParams', '$http', '$window', '$location', 'project', function($scope, $rootScope, $stateParams, $http, $window, $location, project) {


			/* Setup */

      $rootScope.containerAdjuster = 'admin-view';
    	$scope.project = project;


      /* Scope Functions */

      $scope.submitForm = function() {
        $http({method: 'PUT', url: './api/admin/projects/' + $stateParams.id + '.json', data: { project: $scope.project } })
          .success(function(data, status) {
          	if (status === 422) {
	            console.log(data.errors);
	            console.log(status);
	            return;
	          }
	          else {
	          	// TODO: Show success message.
	          	$location.path('/projects/' + (data.project.url || $scope.project.url));
			      	return;
	          }
          })
          .error(function(data, status, headers, config) {
            // TODO: Handle this better. Show errors, etc.
            console.error('There was an error when attempting to update this project.');
          });
      }

		}]) // End of adminProjectsEditController
		.controller('unfoundController', ['$scope', '$rootScope', function($scope, $rootScope) {


      /* Setup */

      $rootScope.containerAdjuster = 'admin-view';
		}]); // End of unfoundController
});
