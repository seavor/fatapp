

	// Helper Functions
	////////////////////////////////////////////////////////////////////////

		


	// Popup and Hidden Menu Display Controls
	////////////////////////////////////////////////////////////////////////




	// MenuBar
	////////////////////////////////////////////////////////////////////////



	// Home Screen
	////////////////////////////////////////////////////////////////////////

		


	// Restaurant Search Screen
	////////////////////////////////////////////////////////////////////////

		

	// Restraunt Menu Screen
	////////////////////////////////////////////////////////////////////////

		

	// Menu Item Screen
	////////////////////////////////////////////////////////////////////////

		

	// Review Order Screen
	////////////////////////////////////////////////////////////////////////

		

	// Checkout Screen
	////////////////////////////////////////////////////////////////////////



	// Create Account Prompt Screen	
	////////////////////////////////////////////////////////////////////////


	// Button Actions
	////////////////////////////////////////////////////////////////////////



    // jQuery Helpers (to be replaced as much as possible)
	////////////////////////////////////////////////////////////////////////

		// Hide Action Items during Popup Events, Scroll to Top
		// $('.popupButton').on('click', function(){
		// 	 $('html, body').animate({
		//         scrollTop: $("#appContent").offset().top
		//     }, 400);
		// 	$('button.actionButton').hide('400');
		// 	$('.actionInfo').hide('400');
		// });


    // Angular Controllers
	////////////////////////////////////////////////////////////////////////

	// Declare App Module
	var app = angular.module('app', ['ngRoute']);

	// Page Routes
	app.config(['$routeProvider',
	  function($routeProvider) {
	    $routeProvider.
	      // Home Sceen
	      when('/search', {
	        templateUrl: 'partials/search.html',
	        controller: 'SearchCtrl'
	      }).
	      // Reroute to Home Sceen
	      otherwise({
	        redirectTo: '/search'
	      });
	  }]);

	    // Home Page (Search)
		////////////////////////////////////////////////////////////////////
		app.controller('SearchCtrl', function($scope){
			
			// Open Saved Address Popup (popup)
			$scope.pickAddress = function(){
				$('#chooseAddress').fadeIn('250');
			};

			// Open New Address Popup (popup)
			$scope.enterAddress = function(){
				$('#addressInputFields').fadeIn('250');
			};

			$scope.chooseAddress = function(){
				
				// If Selected From Saved Address
				if (true) {

				// Else If manual entry
				} else {


				};;


			};









		});

		// Abstracted Popup Behavior Controls
		app.controller('popupCtrl', function($scope){



		});











		// Test
		app.controller('appCtrl', function($scope){



			$scope.hiMe = function(){
				alert('Hi there!');
			}

			$scope.pageTitle = "test";

			$scope.clickMessage = "click me";

		});













