

	// Helper Functions
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
	var app = angular.module('app', ['ngRoute', 'ui.bootstrap']);

	// Declare App Services
	app.factory('ControllerStorage', function(){
		return {};
	});

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

	// General App Controls
	app.controller('AppCtrl', function($scope, ControllerStorage){


		$scope.displayModal = false;
		$scope.url = '';


		$scope.popupModal = function(popup){
			$scope.url = popup;
			$scope.displayModal = true;
		}






	});

	

	    // Home Page (Search)
		////////////////////////////////////////////////////////////////////

		app.controller('SearchCtrl', function($scope){
			
			// Open Saved Address Popup (popup)
			$scope.pickAddress = function(){
				// $('#chooseAddress').fadeIn('250');
			};

			// Open New Address Popup (popup)
			$scope.enterAddress = function(){
				// $('#addressInputFields').fadeIn('250');
			};

			$scope.chooseAddress = function(){
				// If Selected From Saved Address
				if (true) {

				// Else If manual entry
				} else {

				};;
			};



		});




		// app.directive('savedAddresses', function(){
		// 	return {
		// 		restrict: 'E',
		// 		templateUrl: 'modals/savedAddresses.html'



		// 	}
		// });





		// // Abstracted Popup Behavior Controls
		// app.controller('popupCtrl', function($scope){

		// 	console.log(this);

		// });











		













