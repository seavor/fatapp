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


// Angular Setup
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// General App Controls
	////////////////////////////////////////////////////////////////////
	app.controller('AppCtrl', function($scope, $http, $location, ControllerStorage){

		// initialize service to bind its data (+ share across controllers)
		$scope.storage = ControllerStorage;

		// Initialize Modal Variables
		$scope.displayModal = false;
		$scope.url = '';

		$scope.popupModal = function(popup){
			$scope.url = popup;
			$scope.displayModal = true;
		};

		$scope.closeModal = function() {
			$scope.displayModal = false;
		};

		// Simulate User Loggin Status
		$scope.userLoggedIn = function(){
			return true;
		};

	});


    // Modal View Controllers
	////////////////////////////////////////////////////////////////////
	app.controller('SavedAddressesCtrl', function($scope, $http, $location, ControllerStorage){
		$scope.addressList = [
			// @TODO ajax call for address info from (aid)
		    {"aid":"001", "addrName":"Home", "addressLine":"392 Broadway", "city":"New York", "state":"NY", "zip":"10013"}, 
		    {"aid":"002", "addrName":"Work", "addressLine":"920 Broadway", "city":"New York", "state":"NY", "zip":"10010"}, 
		    {"aid":"003", "addrName":"School", "addressLine":"1480 Broadway", "city":"New York", "state":"NY", "zip":"10036"}
		]

		$scope.storage = ControllerStorage;
		$scope.storage.addressList = $scope.addressList;
	});

	app.controller('EnterAddressCtrl', function($scope, $http, $location, ControllerStorage){

		$scope.storage = ControllerStorage;

		

	});

	app.controller('RestFiltersCtrl', function($scope, $http, $location, ControllerStorage){

		$scope.storage = ControllerStorage;

		

	});

	
    // Home Page (Search)
	////////////////////////////////////////////////////////////////////

	app.controller('SearchCtrl', function($scope, $http, $location, ControllerStorage){

		$scope.storage = ControllerStorage;

		// init variables for address form
		$scope.addrForm = {};
		$scope.addrForm.addressLine = '';
		$scope.addrForm.city = '';
		$scope.addrForm.zipcode = '';
		$scope.addrForm.nickname = '';

		$scope.addressDisplay ='';

		$scope.storage.findRestButtonState = false;

		$scope.displayRestButton = function(){
			var state = $scope.storage.findRestButtonState;
			return state;
		};

		$scope.selectAddress = function(){

			if ($scope.userLoggedIn() == true ) {
				return 'savedAddresses';
			} else {
				return 'enterAddress';
			}
		};
		
		$scope.chooseAddress = function(aid){
			$scope.storage.addressList.forEach(function(addr) {
			    if (aid == addr.aid) {
			    	$scope.storage.addrLine = addr.addressLine;
					$scope.storage.city = addr.city;
					$scope.storage.zipcode = addr.zip;
					$scope.storage.nickname = addr.addrName;
					$scope.closeModal();
					$scope.addressDisplay = $scope.storage.addrLine + ', ' + $scope.storage.city + ', ' + $scope.storage.zipcode;
					$scope.storage.findRestButtonState = true;

				}
			});
			// @TODO
			// populate storage fields with address info
		};

		// Store New Address
		$scope.storeAddress = function() {
			$scope.storage.addrLine = $scope.addrForm.addressLine;
			$scope.storage.city = $scope.addrForm.city;
			$scope.storage.zipcode = $scope.addrForm.zipcode;
			$scope.storage.nickname = $scope.addrForm.nickname;
			// TODO: store if user logged in
			$scope.closeModal();
			$scope.addressDisplay = $scope.storage.addrLine + ', ' + $scope.storage.city + ', ' + $scope.storage.zipcode;
			$scope.storage.findRestButtonState = true;
		};


		// Save Address when Checkbox Selected
		$scope.saveAddress = function(){

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











		













