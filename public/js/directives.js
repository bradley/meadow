define(['angular'], function(angular) {
	'use strict';


  /* Directives */

	angular.module('myApp.directives', [])
		.directive('projectForm', ['$timeout', function($timeout) {
			return {
				restrict: 'E',
				scope: {
					'project': '=',
					'submitForm': '&submitForm'
				},
				templateUrl: 'partials/projects/_form.html',
				link: function(scope, element) {
					(function(scope, element) {

						var ProjectForm = {
			        init: function() {
			        	var self = this;
			          this.editor_wrapper = $('#project-management');
			          this.editor_form = this.editor_wrapper.find('form');
			          this.rendered_content_container = this.editor_wrapper.find('#rendered-content #project-content');
			          this.editable_content_container;
			          this.editor;
			          this.on_change_timeout = false,
			          this.on_change_timeout_period = 10; // How long should our event wait?
			          this.editable_content_container_height;
			          this.image_sizes = {};

			          this.setAllWatchers();
			        },
			        setAllWatchers: function() {
		        		var self = this;
		        		// NOTE: All watchers are automatically destroyed along with the scope.
							  scope.$watch('project', function(new_data, old_data) {
							  	if (new_data) {
								  	self.setupEditor();
				         		self.renderMarkdown();
				         		self.setupListeners();
							  	}
							  });

							  // Note: This is a hack.
							  //   We were having an issue where the cursor position is wrong on load because of our css line height.
							  //   CSS was getting applied (apparently, anyway) after CodeMirror was applied and CodeMirror wasn't getting
							  //   the right CSS until it refreshed (from resizing usually).
							  //     https://github.com/marijnh/CodeMirror/issues/150
							  //     https://github.com/angular-ui/angular-ui-OLDREPO/blob/master/modules/directives/codemirror/codemirror.js#L68
							  $timeout(function() {$('.CodeMirror').css('line-height', '24px'); self.editor.refresh(); $(window).trigger('resize');}, 700);
		        	},
			        setupListeners: function() {
			          var self = this;
			          this.editor.on('change', function() { self.timeoutRender(); });
			          this.editable_content_container.bind('scroll', function() { self.equallyScrollRenderedContent(); });
			          $('#project-edit-form').on('submit', function(event) { self.submit(event); });
			        },
			        setupEditor: function() {
			          // Tell codemirror to consider or content text area its editor.
			          this.editor = CodeMirror.fromTextArea(this.editor_form.find('#project_raw_content').get(0), {
			            mode: 'gfm_meadow_context',
			            tabMode: 'indent',
			            tabindex: '2',
			            lineWrapping: true,
			            defaultTextHeight: '24'
			          });

			          this.editable_content_container = $('.CodeMirror-scroll');
			          this.editable_content_container_height = this.editable_content_container.height();
			        },
			        timeoutRender: function() {
			          var self = this;
			          // Delay rendering of markdown until user is done typing.
			          // Adjust period as needed.
			          clearTimeout(this.on_change_timeout);
			          this.on_change_timeout = setTimeout(function(){
			            self.renderMarkdown();
			          }, this.on_change_timeout_period);
			        },
			        renderMarkdown: function() {
			          var markdown = this.editor.getValue(),
			              converter = new Showdown.converter({ extensions: ['meadow'] }),
			              rendered = $(converter.makeHtml(markdown));

			          this.setImageHeightsInRenderedContent(rendered);
			          this.rendered_content_container.html(rendered);

			          // Prepare code objects for prettyprint
			          this.rendered_content_container.find('div.highlight pre').addClass('prettyprint').parent('div.highlight').addClass('prettyprint-wrap');
			          prettyPrint();

			          if (this.editable_content_container_height != this.editable_content_container.height()) {
			            this.equallyScrollRenderedContent();
			          }
			        },
			        setImageHeightsInRenderedContent: function(content) {
			          var self = this;

			          // Find all images in our HTML and set their heights to the previously calculated
			          // height for a given image src. This prevents the page from 'jumping' as images load.
			          content.find('img').each(function(){
			            var this_tag = this,
			                src = $(this).attr('src'),
			                image = new Image();
			            image.name = this;
			            image.onload = function() {
			              self.image_sizes[src] = $(this).height;
			            };
			            image.src = src;

			            $(this_tag).height(self.image_sizes[src] ? self.image_sizes[src] : 'auto');
			          });
			        },
			        equallyScrollRenderedContent: function() {
			          // When the editable content container is scrolled, scroll the rendered content area an equal percent.
			          var ecc = this.editable_content_container, // Shorthand accessor.
			              rcc = this.rendered_content_container, // Shorthand accessor.
			              eccScrollFraction = (ecc.scrollTop() / (ecc[0].scrollHeight - ecc[0].clientHeight)),
			              accScroll = ((rcc[0].scrollHeight - rcc[0].clientHeight) * eccScrollFraction);

			          this.rendered_content_container.scrollTop(accScroll);
			        },
			        submit: function(e) {
			          e.preventDefault();
			          // Note: Coderay should handle this for us but isn't (probably something to do with js)
                //  so we have to set raw_content manually. This is also why we cant use ng-submit on the form.
                scope.project.raw_content = $('#project_raw_content').val();

			          scope.submitForm();
			        }
				    }

				    ProjectForm.init();
					})(scope, element);
				}
			}
		}])
		.directive('parentHeightAdjuster', ['$rootScope', '$timeout', '$window', function($rootScope, $timeout, $window) {
			return {
				link: function(scope, elm, attrs) {
					// NOTE:
					//   Absolute position is required for our transition animations but this means that the main content of our projects
					//   cannot adjust its parent's height, meaning our content gets hiddent. Therefore we need a means by which we can
					//   adjust the container for project views to meet its absolutely positioned children's heights.
					var parent = $(elm).parent('#project-wrapper'),
							resize_timer;

					var handleResize = function() {
						parent.css('min-height', $(elm).prop('scrollHeight'));
					};

					var handleWindowResize = function() {
						clearTimeout(resize_timer);
						resize_timer = setTimeout(function() {
							handleResize();
						}, 50);
					}

					// Extensive Note:
					//   I really hate this (a short setTimeout in order to wait for the DOM to be ready),
					//   but after extensive research this seems like the only workable option.
					//   If you'd like to try other methods, here are some I've investigated that might be
					//   revisted:
					//     Using $timeout with no delay (http://www.backalleycoder.com/2012/04/25/i-want-a-damnodeinserted/)
					//		 Using the (basically totally depricated) DOMNodeInserted event, which works but weirdly and unreliably.
					//     Listening to all browser specific animationstart events on our node and calling a function after the fact.
					setTimeout(function () {
						handleResize();
					}, 100); // If there are issues around load speed, this timeout could vary well be the thing to look at.

					angular.element($window).bind('resize', handleWindowResize());

					scope.$on("$destroy", function() {
					   $(window).unbind('resize', handleWindowResize);
					});
				}
			}
		}])
		.directive('footnoteAdjuster', ['$rootScope', '$timeout', '$window', function($rootScope, $timeout, $window) {
			return {
				link: function(scope, elm, attrs) {

					var resize_timer;

					var setFootnotes = function() {
						var footnote_prev_offset = 0,
								footnote_margin = 10,
								head_offset = $('#project-header').offset().top;

						$(elm).find('sup.footnote-pointer').each(function(){
							// Position footnotes to be vertically aligned with their pointers in the project's body text.
							var referenced_footnote_id = $(this).data('references'),
									aside_footnotes = $('aside#footnotes'),
									referenced_footnote = aside_footnotes.find(referenced_footnote_id),
									offset;

							if ($(this).parents('blockquote').length > 0) {
								offset = $($(this).parents('blockquote')[0]).offset().top - head_offset + 1;
							}
							else {
								offset = $(this).offset().top - head_offset - 2
							}

							referenced_footnote.css('margin-top', Math.max(offset - footnote_prev_offset, 0));
							footnote_prev_offset = referenced_footnote.offset().top - aside_footnotes.offset().top + referenced_footnote.height();
						});
					}

					var handleWindowResize = function() {
						clearTimeout(resize_timer);
						resize_timer = setTimeout(function() {
							setFootnotes();
						}, 50);
					}

					setTimeout(function () {
						var images = $(elm).find('img');

						if (images.length > 0) {
							images.one('load', function() {
							  setFootnotes();
							}).each(function() {
							  if(this.complete) $(this).load();
							});
						}
						else {
							setFootnotes();
						}
					}, 140);
					angular.element($window).bind('resize', handleWindowResize());

					scope.$on("$destroy", function() {
					   $(window).unbind('resize', handleWindowResize);
					});
				}
			}
		}])
		.directive('animClass', ['$rootScope', '$route', '$state', '$stateParams', function($rootScope, $route, $state, $stateParams) {
		  return {
		    link: function(scope, elm, attrs) {
		    	// This function applies a route specific class to the main view area so we can have different animations between views.
		    	var enter_class = $state.$current ? $state.$current.animate : null;

					if (typeof(enter_class) != 'undefined') {
						elm.addClass(enter_class);

						scope.$on('$destroy', function() {
			        elm.removeClass(enter_class);
			        elm.addClass($state.$current.animate);
			      });
			    }
		    }
		  }
		}]);
});
