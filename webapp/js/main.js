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
		// $scope.url = '';

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
		    {"aid":"001", "addressName":"Home", "addressLine":"392 Broadway", "city":"New York", "state":"NY", "zipcode":"10013"}, 
		    {"aid":"002", "addressName":"Work", "addressLine":"920 Broadway", "city":"New York", "state":"NY", "zipcode":"10010"}, 
		    {"aid":"003", "addressName":"School", "addressLine":"1480 Broadway", "city":"New York", "state":"NY", "zipcode":"10036"}
		]

		$scope.storage = ControllerStorage;
		$scope.storage.addressList = $scope.addressList;
	});

	app.controller('EnterAddressCtrl', function($scope, $http, $location, ControllerStorage){

		$scope.storage = ControllerStorage;

		

	});

	app.controller('RestFilterCtrl', function($rootScope, $scope, ControllerStorage){

		$scope.storage = ControllerStorage;

		$scope.filterForm = $scope.storage.filterForm;


		$scope.filterControl = function(filter){

			if ( this.filterForm.all ) {
				if( filter !== 'all') {
					this.filterForm.all = false;
				}
			}

			if ( (this.filterForm.brunch && this.filterForm.lunch && this.filterForm.dinner) || (filter == 'all') ) {
				this.filterForm.brunch = false;
				this.filterForm.lunch = false;
				this.filterForm.dinner = false;
				this.filterForm.all = true;
			}

		};

		$scope.filterSelection = function(){
			if ($scope.filterForm.all) {
				$scope.storage.filterForm.brunch = false;
				$scope.storage.filterForm.lunch = false;
				$scope.storage.filterForm.dinner = false;
			};

			var filterDisp = 'Filter: ';
			for(var filter in $scope.filterForm ) {
				if( $scope.filterForm[ filter ] ) {
					filterDisp += filter.charAt(0).toUpperCase() + filter.slice(1);
					// Append 'Menus' if filter is All
					if (filter == 'all') { filterDisp += ' Menus  '; }
					else { filterDisp += ', '; }
				}	
			}

			// Remove Trailing Comma
			filterDisp = filterDisp.slice(0, -2);
			$scope.storage.filterDisplay = filterDisp;

			$scope.closeModal();

		};

	});

	
    // Home Page (Search)
	////////////////////////////////////////////////////////////////////

	app.controller('SearchCtrl', function($scope, $http, $location, ControllerStorage){

		$scope.storage = ControllerStorage;

			// // init variables for address form
			// $scope.addrForm = {};
			// $scope.addrForm.addressLine = '';
			// $scope.addrForm.city = '';
			// $scope.addrForm.zipcode = '';
			// $scope.addrForm.nickname = '';
			// $scope.addressDisplay = '';

			// Initialize Filter Checkbox
			$scope.filterForm = { "all" : true };

			// Initialize Filter & Address Storage Space
			$scope.storage.filterForm = $scope.filterForm;
			// $scope.storage.addressObj = {};
			
			// Initialize Filter Display
			$scope.storage.filterDisplay = 'Filter: All Menus';

			// Keep Filtered Display Updated
			$scope.$watch('storage.filterDisplay', function() {
				$scope.filterDisplay = $scope.storage.filterDisplay;
			});

			// Reveal 'Find Restaurants' button upon Address Selection
			$scope.storage.findRestButtonState = false;

		$scope.displayRestButton = function(){
			// Change this to check against storage of search address
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
			    	$scope.storage.addressObj = addr;
					$scope.addressDisplay = $scope.storage.addressObj.addressLine + ', ' + $scope.storage.addressObj.city + ', ' + $scope.storage.addressObj.zipcode;
					$scope.storage.findRestButtonState = true;
					$scope.closeModal();
				}
			});
			// @TODO
			// populate storage fields with address info
		};

		// Store New Address
		$scope.storeAddress = function() {
			$scope.storage.addressObj = $scope.addrForm;
			// TODO: store if user logged in
			$scope.addressDisplay = $scope.storage.addressObj.addressLine + ', ' + $scope.storage.addressObj.city + ', ' + $scope.storage.addressObj.zipcode;
			$scope.storage.findRestButtonState = true;
			$scope.closeModal();
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

		$scope.filterDisplay = $scope.storage.filterDisplay;

		// Keep Filtered Field Updated
		$scope.$watch('storage.filterDisplay', function() {
			$scope.filterDisplay = $scope.storage.filterDisplay;
		});

		$scope.ratingx = 1;
		$scope.ratingy = 1;
		$scope.ratingz = 0;


		



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











		













