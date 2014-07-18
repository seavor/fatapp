

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
	      when('/restaurants', {
	        templateUrl: 'partials/restaurants.html',
	        controller: 'RestaurantsCtrl'
	      }).
	      // Reroute to Home Sceen
	      otherwise({
	        redirectTo: '/search'
	      });
	  }]);

	// General App Controls
	app.controller('AppCtrl', function($scope, $http, $location, ControllerStorage){

		// initialize service to bind its data (+ share across controllers)
		$scope.storage = ControllerStorage;

		$scope.displayModal = false;
		$scope.url = '';


		$scope.popupModal = function(popup){
			$scope.url = popup;
			$scope.displayModal = true;
		};

		$scope.closeModal = function() {
			$scope.displayModal = false;
		};







	});

	

    // Home Page (Search)
	////////////////////////////////////////////////////////////////////

	app.controller('SearchCtrl', function($scope, $http, $location, ControllerStorage){

		$scope.storage = ControllerStorage;

		$scope.displayRestButton = false;

		// init variables for address form
		$scope.addrForm = {};
		$scope.addrForm.addressLine = '';
		$scope.addrForm.city = '';
		$scope.addrForm.zipcode = '';
		$scope.addrForm.nickname = '';

		$scope.addressDisplay ='';


		// Save New Address
		$scope.saveAddress = function() {
			$scope.storage.addrLine = $scope.addrForm.addressLine;
			$scope.storage.city = $scope.addrForm.city;
			$scope.storage.zipcode = $scope.addrForm.zipcode;
			$scope.storage.nickname = $scope.addrForm.nickname;
			// TODO: store if user logged in
			$scope.closeModal();
			$scope.addressDisplay = $scope.storage.addrLine + ', ' + $scope.storage.city + ', ' + $scope.storage.zipcode;
			$scope.displayRestButton = true;
		};
		
		// Open Saved Address Popup (popup)
		$scope.pickAddress = function(){
			// $('#chooseAddress').fadeIn('250');
		};


		$scope.chooseAddress = function(){
			// If Selected From Saved Address
			if (true) {

			// Else If manual entry
			} else {

			};;
		};

		// Find restaurants
		$scope.findRestaurants = function(){
			var reqUrl = 'http://r-test.ordr.in/dl/ASAP/'
				+ $scope.storage.zipcode + '/'
				+ $scope.storage.city + '/'
				+ $scope.storage.addrLine + '?_auth=1,vwXYUSj_Bxl3UT-8xM7NAoHnEcVKM-OcrbPIvCzj5e4&callback=JSON_CALLBACK';
			reqUrl = encodeURI(reqUrl);
			console.log(reqUrl);

			$http.jsonp( reqUrl )
				.success( function( data, status, header, config ) {
					console.log('SUCCESS');
					console.log(data);
					// TODO: save data into storage, redirect to next page
				})
				.error( function( data, status, header, config ) {
					console.log(':(');
					console.log(data);
				});

			$location.path('/restaurants');
		};



	});


	// Restaurants List Page
	////////////////////////////////////////////////////////////////////

	app.controller('RestaurantsCtrl', function($scope, $http, $location, ControllerStorage){

		$scope.storage = ControllerStorage;


		$scope.rid = 123;
		$scope.name = 'Name';
		$scope.distance = '42 mi';
		$scope.mino = '$10.00';
		$scope.cuisines = 'American';

		$scope.serviceDemo = $scope.storage.addrLine;


		



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











		













