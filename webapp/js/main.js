// Angular Setup
////////////////////////////////////////////////////////////////////////

// Declare App Module
var app = angular.module('app', ['ngRoute']);

// Declare sessionStorage
app.factory('ControllerStorage', function(){
	var db = window.sessionStorage;
	return db;
});

app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=1; i<(total+1); i++)
      input.push(i);
    return input+1;
  };
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
      when('/menu', {
        templateUrl: 'partials/menu.html',
        controller: 'MenuCtrl'
      }).
      when('/item', {
        templateUrl: 'partials/item.html',
        controller: 'ItemCtrl'
      }).
      when('/review', {
        templateUrl: 'partials/review.html',
        controller: 'ReviewCtrl'
      }).
      when('/checkout', {
        templateUrl: 'partials/checkout.html',
        controller: 'CheckoutCtrl'
      }).
      // Reroute to Home Sceen
      otherwise({
        redirectTo: '/search'
      });
  }
]);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// General App Controls
	////////////////////////////////////////////////////////////////////
	
	app.controller('AppCtrl', function($scope, $http, $location, ControllerStorage){

		// Simulate User Loggin Status
		$scope.userLoggedIn = function(){
			return true;
		};

		// Select Saved/Enter Address per Login Status
		$scope.selectAddress = function(){
			console.log(this);
			if ($scope.userLoggedIn() == true ) { return 'savedAddresses'; }
			else { return 'enterAddress'; }
		};

		// Modal Activation Controls
		////////////////////////////////////////////////////////////////

		// Initialize Modal Variables
		$scope.displayModal = false;
		$scope.url = 'null';

		$scope.popupModal = function(popup, param){
			$scope.storage.popupParam = param;
			$scope.url = popup;
			$scope.displayModal = true;
		};

		$scope.switchModal = function(popup, param){
			$scope.closeModal();
			$scope.storage.popupParam = param;
			$scope.popupModal(popup);
		};

		$scope.closeModal = function() {
			$scope.url = 'null';
			$scope.displayModal = false;
		};

		// Storage & Display Controls
		////////////////////////////////////////////////////////////////

		// initialize service to bind its data (+ share across controllers)
		$scope.storage = ControllerStorage;

		$scope.storeObject = function(obj) {
			return JSON.stringify(obj);
		};

		$scope.formattedFilter = function(){
			var fil = '';
			return JSON.parse($scope.storage.filter, function(k, v){
				if ( v ) { fil += (k.charAt(0).toUpperCase() + k.slice(1)) + ', '; }
				return fil.substring(0, fil.length - 4) + ' Menus';
			});
		};

		$scope.clearStorage = function(){
			window.sessionStorage.clear();
			$location.path('/blank');
		};

		// Tray Management Controls
		////////////////////////////////////////////////////////////////

		// $scope.checkForTray = function(dest){
		// 	// If Tray Exists, and about to order from new Restaurant
		// 	if ($scope.storage.tray && $scope.storage.activeRest != $scope.storage.orderRest) {
		// 		// prompt for confirmation of rest change
		// 	} else {
		// 		// Add item to new tray
		// 		$scope.dest
		// 	};
		// };

	});

    // Modal Controllers
	////////////////////////////////////////////////////////////////////
	app.controller('SavedAddressesCtrl', function($scope, $http, $location){

		$scope.addressList = [
			// @TODO ajax call for address info (aid)
		    {"aid":"001", "addressName":"Home", "addressLine":"392 Broadway", "city":"New York", "state":"NY", "zipcode":"10013"}, 
		    {"aid":"002", "addressName":"Work", "addressLine":"920 Broadway", "city":"New York", "state":"NY", "zipcode":"10010"}, 
		    {"aid":"003", "addressName":"School", "addressLine":"1480 Broadway", "city":"New York", "state":"NY", "zipcode":"10036"}
		];
		
		$scope.chooseAddress = function(aid){
			$scope.addressList.forEach(function(addr) {
			    if (aid == addr.aid) {
			    	$scope.storage.deliveryAddress = $scope.storeObject(addr);
					$scope.storage.deliveryAddressDisplay = addr.addressLine + ', ' + addr.city + ', ' + addr.zipcode;
					$scope.closeModal();
				}
			});
		};

		// Save Address when Checkbox Selected
		$scope.saveAddress = function(){

		};

	});

	app.controller('EnterAddressCtrl', function($scope, $http){

		// need this initialization, new address isn't picked up otherwise!
		$scope.addrForm = {};

		// Store New Address
		$scope.storeAddress = function() {
			$scope.storage.deliveryAddress = $scope.storeObject($scope.addrForm);
			// TODO: store if user logged in
			$scope.storage.deliveryAddressDisplay = $scope.addrForm.addressLine + ', ' + $scope.addrForm.city + ', ' + $scope.addrForm.zipcode;
			$scope.closeModal();
		};

	});

	app.controller('RestFilterCtrl', function($scope){

		$scope.filterControl = function(filter){

			// Unselect All when another option is selected
			if ( this.filterForm.all ) {
				if( filter !== 'all') {
					this.filterForm.all = false;
				}
			}

			// Select All if all filter options are selected
			if ( (this.filterForm.brunch && this.filterForm.lunch && this.filterForm.dinner) || (filter == 'all') ) {
				this.filterForm.brunch = false;
				this.filterForm.lunch = false;
				this.filterForm.dinner = false;
				this.filterForm.all = true;
			}

			// If all Filter options are unselected, reselect All option
			var i = 0;
			angular.forEach(this.filterForm, function(v, k) {
				if (v == true && k != 'all') { i = 1 }
			});
			if (i == 0) { $scope.filterForm.all = true; }

		};

		$scope.filterSelection = function(){
			$scope.storage.filter = JSON.stringify($scope.filterForm);
			$scope.closeModal();
			if ($scope.filterForm.all) { $scope.storage.filterDisplay = "All Menus"; }
			else { $scope.storage.filterDisplay = $scope.formattedFilter(); }
		};

		// Keep Filtered Display Updated
		$scope.$watch('storage.filter', function() {
			var fil = '';
			$scope.storage.filterDisplay = $scope.formattedFilter();
		});

	});

	app.controller('OptionsCtrl', function($scope){



		$scope.$watch('storage.activeOption', function() {
			$scope.option = JSON.parse($scope.storage.activeOption);
		});


		var size = function(obj) {
			var size = 0, key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) size += obj[key].quantity;
			}
			// $scope.optionActivated = true;
			return size;
		};

		// Return if Radio Button
		$scope.isType = function(min, max){
			if (min == 1 && max == 1) { return 'radio'; }
			else { return 'checkbox'; }
		};

	});

	app.controller('QuantityCtrl', function($scope, $location){

	});

	app.controller('EditItemCtrl', function($scope, $location){

		var tray = JSON.parse($scope.storage.tray);

		// Find the Targeted Item in the Tray and Set Variables for EditOption()
		tray.forEach(function(v, i){
			if (i == $scope.storage.popupParam) {
				$scope.name = v.item.name;
				$scope.iidx = i;
				$scope.item = v;

			}
		});

		// Splice Removed Item from array by Index
		$scope.removeOption = function(iidx){
			tray.forEach(function(v, i){
				if (i == iidx) {
					tray.splice(i, 1);
					$scope.storage.tray = JSON.stringify(tray);
					$scope.closeModal();
				}
			});
		};

	});

	app.controller('EmptyTrayCtrl', function($scope, $location){

		// If Confirmed, set $scope.storage.orderRest = $scope.storage.activeRest
		$scope.emptyTrayPrompt = function(bool){
			console.log(bool);
			if (bool) {
				$scope.storage.orderRest = $scope.storage.activeRest;
				$scope.closeModal();
				$scope.storage.removeItem('tray');
				$scope.addItem();
			} else {
				$scope.closeModal();
			}
		};

	});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
    // Page Controllers
	////////////////////////////////////////////////////////////////////

	app.controller('SearchCtrl', function($scope, $http, $location){


		// Initialize Filter Display/Checkbox/Storage
		$scope.filterForm = { "all" : true};
		$scope.storage.filterDisplay = "All Menus";
		$scope.storage.filter = $scope.storeObject($scope.filterForm);

		// Reveal 'Find Restaurants' button upon Address Selection
		$scope.$watch('storage.deliveryAddressDisplay', function() {
			if ($scope.storage.deliveryAddressDisplay != undefined) { $scope.storage.findRestButtonState = true; }
			else { $scope.storage.findRestButtonState = false; }
		});

		$scope.displayRestButton = function(){
			// Change this to check against storage of search address
			var state = $scope.storage.findRestButtonState;
			return state;
		};

		// Find restaurants @TODO
		$scope.findRestaurants = function(){
			var address = JSON.parse($scope.storage.deliveryAddress);
			var reqUrl = 'http://r-test.ordr.in/dl/ASAP/'
				+ address.zipcode + '/'
				+ address.city + '/'
				+ address.addressLine + '?_auth=1,vwXYUSj_Bxl3UT-8xM7NAoHnEcVKM-OcrbPIvCzj5e4&callback=JSON_CALLBACK';
			reqUrl = encodeURI(reqUrl);

			$http.jsonp( reqUrl )
				.success( function( data, status, header, config ) {
					console.log('SUCCESS');
					console.log(data);
				})
				.error( function( data, status, header, config ) {
					console.log(':(');
					console.log(data);
				});

			$location.path('/restaurants');
		};

	});

	app.controller('RestaurantsCtrl', function($scope, $http, $location){

		$scope.restaurantList = [
		    {
		        "id": 23865,
		        "na": "Salaam Bombay",
		        "cs_phone": "212-226-9400",
		        "rds_info": {
		            "id": 186,
		            "name": "delivery.com",
		            "logo": ""
		        },
		        "services": {
		            "deliver": {
		                "time": 30,
		                "mino": 15,
		                "can": 0
		            }
		        },
		        "allow_tip": 1,
		        "allow_asap": 1,
		        "cu": [
		            "Indian",
		            "Vegetarian"
		        ],
		        "addr": "319 Greenwich St, New York, NY",
		        "full_addr": {
		            "addr": "319 Greenwich St",
		            "addr2": "",
		            "city": "New York",
		            "state": "NY",
		            "postal_code": "10013-3301"
		        },
		        "city": "New York",
		        "latitude": 40.717113,
		        "longitude": -74.010574,
		        "del": 30,
		        "mino": 15,
		        "is_delivering": 1,
		        "rating": 1,
		        "filters" : [
		        	"dinner",
		        	"brunch"
		        ]
		    },
		    {
		        "id": 23938,
		        "na": "Tribeca Pizzeria",
		        "cs_phone": "212-732-5959",
		        "rds_info": {
		            "id": 186,
		            "name": "delivery.com",
		            "logo": ""
		        },
		        "services": {
		            "deliver": {
		                "time": 30,
		                "mino": 7,
		                "can": 0
		            }
		        },
		        "allow_tip": 1,
		        "allow_asap": 1,
		        "cu": [
		            "Italian",
		            "Pizza",
		            "Wings"
		        ],
		        "addr": "378 Greenwich St, New York, NY",
		        "full_addr": {
		            "addr": "378 Greenwich St",
		            "addr2": "",
		            "city": "New York",
		            "state": "NY",
		            "postal_code": "10013-2328"
		        },
		        "city": "New York",
		        "latitude": 40.720028,
		        "longitude": -74.010292,
		        "del": 30,
		        "mino": 7,
		        "is_delivering": 0,
		        "rating": 3,
		        "filters" : [
		        	"lunch"
		        ]
		    },
		    {
		        "id": 23946,
		        "na": "Katz's Delicatessen Restaurant",
		        "cs_phone": "212-254-2246",
		        "rds_info": {
		            "id": 186,
		            "name": "delivery.com",
		            "logo": ""
		        },
		        "services": {
		            "deliver": {
		                "time": 30,
		                "mino": 75,
		                "can": 0
		            }
		        },
		        "allow_tip": 1,
		        "allow_asap": 1,
		        "cu": [
		            "Sandwiches"
		        ],
		        "addr": "205 E Houston St, New York, NY",
		        "full_addr": {
		            "addr": "205 E Houston St",
		            "addr2": "",
		            "city": "New York",
		            "state": "NY",
		            "postal_code": "10002-1017"
		        },
		        "city": "New York",
		        "latitude": 40.72234,
		        "longitude": -73.987343,
		        "del": 30,
		        "mino": 75,
		        "is_delivering": 0,
		        "rating": 2,
		        "filters" : [
		        	"brunch ",
		        	"lunch",
		        	"dinner"
		        ]
		    }
		]; // End restaurantList

		$scope.showAddress = $scope.storage.addressLineDisplay;

		// Initialize Filter Display/Checkbox/Storage
		$scope.filterForm = JSON.parse($scope.storage.filter);
		$scope.storage.filterDisplay = $scope.formattedFilter();

		// Compare and Filter Restraunts
		$scope.restFilter = function( rest ) {
			if( $scope.filterForm.all ) { return true; }

			for( var restType in rest.filters ) {
				if( $scope.filterForm[ rest.filters[ restType ] ] ) {
					return true;
				}
			}
			return false;
		};


		$scope.viewMenu = function(rid){
			$scope.storage.activeRest = rid;
			$location.path('/menu');
		}
		
	});

	app.controller('MenuCtrl', function($scope, $http, $location){

		$scope.restaurant = {
		        "id": 23865,
		        "na": "Salaam Bombay",
		        "cs_phone": "212-226-9400",
		        "rds_info": {
		            "id": 186,
		            "name": "delivery.com",
		            "logo": ""
		        },
		        "services": {
		            "deliver": {
		                "time": 30,
		                "mino": 15,
		                "can": 0
		            }
		        },
		        "allow_tip": 1,
		        "allow_asap": 1,
		        "cu": [
		            "Indian",
		            "Vegetarian"
		        ],
		        "addr": "319 Greenwich St, New York, NY",
		        "full_addr": {
		            "addr": "319 Greenwich St",
		            "addr2": "",
		            "city": "New York",
		            "state": "NY",
		            "postal_code": "10013-3301"
		        },
		        "city": "New York",
		        "latitude": 40.717113,
		        "longitude": -74.010574,
		        "del": 30,
		        "mino": 15,
		        "is_delivering": 0,
		        "rating": 1,
		        "filters" : [
		        	"brunch",
		        	"dinner"
		        ]
		    };

		$scope.ratingx = 1;
		$scope.ratingy = 1;
		$scope.ratingz = 0;

		$scope.menu = {
		    "addr": "378 Greenwich St",
		    "allow_asap": "yes",
		    "city": "New York",
		    "cs_contact_phone": "212-732-5959",
		    "cuisine": [
		        "Italian",
		        "Pizza",
		        "Wings"
		    ],
		    "latitude": "40.720028",
		    "longitude": "-74.010292",
		    "meal_name": {
		        "0": "always available"
		    },
		    "menu": [
		        {
		            "tip": "When you exercise hard for 90 minutes or more, especially if you're doing something at high intensity that takes a lot of endurance, you need a diet that can help you perform at your peak and recover quickly afterward.",
		            "name": "Salads",
		            "id": 1,
		            "children": [
		                {
		                    "additional_fee": "0.00",
		                    "availability": [
		                        0
		                    ],
		                    "children": [
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025922",
		                                    "is_orderable": "1",
		                                    "name": " No Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025923",
		                                    "is_orderable": "1",
		                                    "name": "Homemade Vinaigrette and Balsamic Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025924",
		                                    "is_orderable": "1",
		                                    "name": "Ranch Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025925",
		                                    "is_orderable": "1",
		                                    "name": "Caesar Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025926",
		                                    "is_orderable": "1",
		                                    "name": "Bleu Cheese Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025927",
		                                    "is_orderable": "1",
		                                    "name": "Creamy Italian Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025928",
		                                    "is_orderable": "1",
		                                    "name": "French Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025929",
		                                    "is_orderable": "1",
		                                    "name": "Honey Mustard Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025930",
		                                    "is_orderable": "1",
		                                    "name": "Russian Dressing",
		                                    "price": "0.00"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "19025921",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "1",
		                            "max_free_child_select": "0",
		                            "min_child_select": "1",
		                            "name": "Choice of Salad Dressing",
		                            "price": "0.00"
		                        },
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025932",
		                                    "is_orderable": "1",
		                                    "name": "Black Olives",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025933",
		                                    "is_orderable": "1",
		                                    "name": "Cranberries",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025934",
		                                    "is_orderable": "1",
		                                    "name": "Croutons",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025935",
		                                    "is_orderable": "1",
		                                    "name": "Green Olives",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025936",
		                                    "is_orderable": "1",
		                                    "name": "Hot Cherry Peppers",
		                                    "price": "1.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025937",
		                                    "is_orderable": "1",
		                                    "name": "Shaved Parmesan ",
		                                    "price": "1.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025938",
		                                    "is_orderable": "1",
		                                    "name": "Shredded Mozzarella",
		                                    "price": "1.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025939",
		                                    "is_orderable": "1",
		                                    "name": "Walnuts",
		                                    "price": "1.25"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "19025931",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "8",
		                            "max_free_child_select": "0",
		                            "min_child_select": "0",
		                            "name": "Salad Extras",
		                            "price": "0.00"
		                        }
		                    ],
		                    "descrip": "",
		                    "id": "19025920",
		                    "is_orderable": "1",
		                    "name": "Tomato & Cucumber Salad",
		                    "price": "12.50",
		                    "rating": 1
		                },
		                {
		                    "additional_fee": "0.00",
		                    "availability": [
		                        0
		                    ],
		                    "children": [
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025942",
		                                    "is_orderable": "1",
		                                    "name": " No Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025943",
		                                    "is_orderable": "1",
		                                    "name": "Homemade Vinaigrette and Balsamic Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025944",
		                                    "is_orderable": "1",
		                                    "name": "Ranch Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025945",
		                                    "is_orderable": "1",
		                                    "name": "Caesar Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025946",
		                                    "is_orderable": "1",
		                                    "name": "Bleu Cheese Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025947",
		                                    "is_orderable": "1",
		                                    "name": "Creamy Italian Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025948",
		                                    "is_orderable": "1",
		                                    "name": "French Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025949",
		                                    "is_orderable": "1",
		                                    "name": "Honey Mustard Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025950",
		                                    "is_orderable": "1",
		                                    "name": "Russian Dressing",
		                                    "price": "0.00"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "19025941",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "1",
		                            "max_free_child_select": "0",
		                            "min_child_select": "1",
		                            "name": "Choice of Salad Dressing",
		                            "price": "0.00"
		                        },
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025952",
		                                    "is_orderable": "1",
		                                    "name": "Black Olives",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025953",
		                                    "is_orderable": "1",
		                                    "name": "Cranberries",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025954",
		                                    "is_orderable": "1",
		                                    "name": "Croutons",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025955",
		                                    "is_orderable": "1",
		                                    "name": "Green Olives",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025956",
		                                    "is_orderable": "1",
		                                    "name": "Hot Cherry Peppers",
		                                    "price": "1.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025957",
		                                    "is_orderable": "1",
		                                    "name": "Shaved Parmesan ",
		                                    "price": "1.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025958",
		                                    "is_orderable": "1",
		                                    "name": "Shredded Mozzarella",
		                                    "price": "1.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025959",
		                                    "is_orderable": "1",
		                                    "name": "Walnuts",
		                                    "price": "1.25"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "19025951",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "8",
		                            "max_free_child_select": "0",
		                            "min_child_select": "0",
		                            "name": "Salad Extras",
		                            "price": "0.00"
		                        }
		                    ],
		                    "descrip": "",
		                    "id": "19025940",
		                    "is_orderable": "1",
		                    "name": "Tuna Salad Platter",
		                    "price": "13.75",
		                    "rating": 2
		                },
		                {
		                    "additional_fee": "0.00",
		                    "availability": [
		                        0
		                    ],
		                    "children": [
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025982",
		                                    "is_orderable": "1",
		                                    "name": " No Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025983",
		                                    "is_orderable": "1",
		                                    "name": "Homemade Vinaigrette and Balsamic Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025984",
		                                    "is_orderable": "1",
		                                    "name": "Ranch Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025985",
		                                    "is_orderable": "1",
		                                    "name": "Caesar Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025986",
		                                    "is_orderable": "1",
		                                    "name": "Bleu Cheese Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025987",
		                                    "is_orderable": "1",
		                                    "name": "Creamy Italian Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025988",
		                                    "is_orderable": "1",
		                                    "name": "French Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025989",
		                                    "is_orderable": "1",
		                                    "name": "Honey Mustard Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025990",
		                                    "is_orderable": "1",
		                                    "name": "Russian Dressing",
		                                    "price": "0.00"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "19025981",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "1",
		                            "max_free_child_select": "0",
		                            "min_child_select": "1",
		                            "name": "Choice of Salad Dressing",
		                            "price": "0.00"
		                        },
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025992",
		                                    "is_orderable": "1",
		                                    "name": "Black Olives",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025993",
		                                    "is_orderable": "1",
		                                    "name": "Cranberries",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025994",
		                                    "is_orderable": "1",
		                                    "name": "Croutons",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025995",
		                                    "is_orderable": "1",
		                                    "name": "Green Olives",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025996",
		                                    "is_orderable": "1",
		                                    "name": "Hot Cherry Peppers",
		                                    "price": "1.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025997",
		                                    "is_orderable": "1",
		                                    "name": "Shaved Parmesan ",
		                                    "price": "1.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025998",
		                                    "is_orderable": "1",
		                                    "name": "Shredded Mozzarella",
		                                    "price": "1.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025999",
		                                    "is_orderable": "1",
		                                    "name": "Walnuts",
		                                    "price": "1.25"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "19025991",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "8",
		                            "max_free_child_select": "0",
		                            "min_child_select": "0",
		                            "name": "Salad Extras",
		                            "price": "0.00"
		                        }
		                    ],
		                    "descrip": "",
		                    "id": "19025980",
		                    "is_orderable": "1",
		                    "name": "Greek Salad - Small",
		                    "price": "8.00",
		                    "rating": 3
		                },
		                {
		                    "additional_fee": "0.00",
		                    "availability": [
		                        0
		                    ],
		                    "children": [
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911508",
		                                    "is_orderable": "1",
		                                    "name": "Anchovies",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911509",
		                                    "is_orderable": "1",
		                                    "name": "Black Olives",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911510",
		                                    "is_orderable": "1",
		                                    "name": "Broccoli",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911511",
		                                    "is_orderable": "1",
		                                    "name": "Eggplant",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911512",
		                                    "is_orderable": "1",
		                                    "name": "Extra Cheese",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911513",
		                                    "is_orderable": "1",
		                                    "name": "Goat Cheese",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911514",
		                                    "is_orderable": "1",
		                                    "name": "Green Olives",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911515",
		                                    "is_orderable": "1",
		                                    "name": "Ham",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911516",
		                                    "is_orderable": "1",
		                                    "name": "Jalapenos",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911517",
		                                    "is_orderable": "1",
		                                    "name": "Meat Balls",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911518",
		                                    "is_orderable": "1",
		                                    "name": "Mushrooms",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911519",
		                                    "is_orderable": "1",
		                                    "name": "Onions",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911520",
		                                    "is_orderable": "1",
		                                    "name": "Pepperoni",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911521",
		                                    "is_orderable": "1",
		                                    "name": "Peppers",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911522",
		                                    "is_orderable": "1",
		                                    "name": "Pineapple",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911523",
		                                    "is_orderable": "1",
		                                    "name": "Prosciutto",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911524",
		                                    "is_orderable": "1",
		                                    "name": "Ricotta Cheese",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911525",
		                                    "is_orderable": "1",
		                                    "name": "Sausage",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911526",
		                                    "is_orderable": "1",
		                                    "name": "Zucchini",
		                                    "price": "5.00"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "19026343",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "19",
		                            "max_free_child_select": "0",
		                            "min_child_select": "0",
		                            "name": "Choice of Extra Toppings",
		                            "price": "0.00"
		                        },
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911528",
		                                    "is_orderable": "1",
		                                    "name": "Garlic Bread",
		                                    "price": "3.50"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911529",
		                                    "is_orderable": "1",
		                                    "name": "French Fries",
		                                    "price": "5.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911530",
		                                    "is_orderable": "1",
		                                    "name": "Garlic Knots",
		                                    "price": "2.50"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911531",
		                                    "is_orderable": "1",
		                                    "name": "Big Rice Ball",
		                                    "price": "7.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911532",
		                                    "is_orderable": "1",
		                                    "name": "Sicilian Rice Ball",
		                                    "price": "7.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911533",
		                                    "is_orderable": "1",
		                                    "name": "Meatballs",
		                                    "price": "7.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911534",
		                                    "is_orderable": "1",
		                                    "name": "Lentil Soup Small",
		                                    "price": "6.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911535",
		                                    "is_orderable": "1",
		                                    "name": "Tiramisu",
		                                    "price": "5.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911536",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Coca Cola",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911537",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Diet Coca Cola",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911538",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Diet Pepsi",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911539",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Diet Sprite",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911540",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Ginger Ale",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911541",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Pepsi",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911542",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Sprite",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911543",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Water",
		                                    "price": "2.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911544",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Diet Lemon Ice Tea",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911545",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Diet Peach",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911546",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - snapple Diet Rasberry",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911547",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Kiwi Strawberry",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911548",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Lemon Ice Tea",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911549",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Mango Madness",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911550",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Orange",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911551",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Peach",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911552",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Pink Lemonade",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911553",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Rasberry",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911554",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Charge",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911555",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Energy",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911556",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Essential",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911557",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Focus",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911558",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Formula 50",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911559",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Power C",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911560",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - X X X",
		                                    "price": "3.00"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "32911527",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "12",
		                            "max_free_child_select": "0",
		                            "min_child_select": "0",
		                            "name": "Meal Additions",
		                            "price": "0.00"
		                        }
		                    ],
		                    "descrip": "",
		                    "id": "19026342",
		                    "is_orderable": "1",
		                    "name": "Neapolitan Pizza Pie",
		                    "price": "18.75",
		                    "rating": 3
		                }
		            ]
		        },
		        {
		            "tip": "When you exercise hard for 90 minutes or more, especially if you're doing something at high intensity that takes a lot of endurance, you need a diet that can help you perform at your peak and recover quickly afterward.",
		            "name": "Entrees",
		            "id": 2,
		            "children": [
		                {
		                    "additional_fee": "0.00",
		                    "availability": [
		                        0
		                    ],
		                    "children": [
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911614",
		                                    "is_orderable": "1",
		                                    "name": "Anchovies",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911615",
		                                    "is_orderable": "1",
		                                    "name": "Black Olives",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911616",
		                                    "is_orderable": "1",
		                                    "name": "Broccoli",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911617",
		                                    "is_orderable": "1",
		                                    "name": "Eggplant",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911618",
		                                    "is_orderable": "1",
		                                    "name": "Extra Cheese",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911619",
		                                    "is_orderable": "1",
		                                    "name": "Goat Cheese",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911620",
		                                    "is_orderable": "1",
		                                    "name": "Green Olives",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911621",
		                                    "is_orderable": "1",
		                                    "name": "Ham",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911622",
		                                    "is_orderable": "1",
		                                    "name": "Jalapenos",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911623",
		                                    "is_orderable": "1",
		                                    "name": "Meat Balls",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911624",
		                                    "is_orderable": "1",
		                                    "name": "Mushrooms",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911625",
		                                    "is_orderable": "1",
		                                    "name": "Onions",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911626",
		                                    "is_orderable": "1",
		                                    "name": "Pepperoni",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911627",
		                                    "is_orderable": "1",
		                                    "name": "Peppers",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911628",
		                                    "is_orderable": "1",
		                                    "name": "Pineapple",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911629",
		                                    "is_orderable": "1",
		                                    "name": "Prosciutto",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911630",
		                                    "is_orderable": "1",
		                                    "name": "Ricotta Cheese",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911631",
		                                    "is_orderable": "1",
		                                    "name": "Sausage",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911632",
		                                    "is_orderable": "1",
		                                    "name": "Zucchini",
		                                    "price": "5.00"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "19026383",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "19",
		                            "max_free_child_select": "0",
		                            "min_child_select": "0",
		                            "name": "Choice of Extra Toppings",
		                            "price": "0.00"
		                        },
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911634",
		                                    "is_orderable": "1",
		                                    "name": "Garlic Bread",
		                                    "price": "3.50"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911635",
		                                    "is_orderable": "1",
		                                    "name": "French Fries",
		                                    "price": "5.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911636",
		                                    "is_orderable": "1",
		                                    "name": "Garlic Knots",
		                                    "price": "2.50"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911637",
		                                    "is_orderable": "1",
		                                    "name": "Big Rice Ball",
		                                    "price": "7.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911638",
		                                    "is_orderable": "1",
		                                    "name": "Sicilian Rice Ball",
		                                    "price": "7.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911639",
		                                    "is_orderable": "1",
		                                    "name": "Meatballs",
		                                    "price": "7.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911640",
		                                    "is_orderable": "1",
		                                    "name": "Lentil Soup Small",
		                                    "price": "6.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911641",
		                                    "is_orderable": "1",
		                                    "name": "Tiramisu",
		                                    "price": "5.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911642",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Coca Cola",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911643",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Diet Coca Cola",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911644",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Diet Pepsi",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911645",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Diet Sprite",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911646",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Ginger Ale",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911647",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Pepsi",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911648",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Sprite",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911649",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Water",
		                                    "price": "2.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911650",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Diet Lemon Ice Tea",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911651",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Diet Peach",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911652",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - snapple Diet Rasberry",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911653",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Kiwi Strawberry",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911654",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Lemon Ice Tea",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911655",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Mango Madness",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911656",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Orange",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911657",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Peach",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911658",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Pink Lemonade",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911659",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Rasberry",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911660",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Charge",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911661",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Energy",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911662",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Essential",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911663",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Focus",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911664",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Formula 50",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911665",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Power C",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911666",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - X X X",
		                                    "price": "3.00"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "32911633",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "12",
		                            "max_free_child_select": "0",
		                            "min_child_select": "0",
		                            "name": "Meal Additions",
		                            "price": "0.00"
		                        }
		                    ],
		                    "descrip": "",
		                    "id": "19026382",
		                    "is_orderable": "1",
		                    "name": "Sicilian Pizza (12 Slices)",
		                    "price": "25.75",
		                    "rating": 2
		                },
		                {
		                    "additional_fee": "0.00",
		                    "availability": [
		                        0
		                    ],
		                    "children": [
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911720",
		                                    "is_orderable": "1",
		                                    "name": "Anchovies",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911721",
		                                    "is_orderable": "1",
		                                    "name": "Black Olives",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911722",
		                                    "is_orderable": "1",
		                                    "name": "Broccoli",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911723",
		                                    "is_orderable": "1",
		                                    "name": "Eggplant",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911724",
		                                    "is_orderable": "1",
		                                    "name": "Extra Cheese",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911725",
		                                    "is_orderable": "1",
		                                    "name": "Goat Cheese",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911726",
		                                    "is_orderable": "1",
		                                    "name": "Green Olives",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911727",
		                                    "is_orderable": "1",
		                                    "name": "Ham",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911728",
		                                    "is_orderable": "1",
		                                    "name": "Jalapenos",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911729",
		                                    "is_orderable": "1",
		                                    "name": "Meat Balls",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911730",
		                                    "is_orderable": "1",
		                                    "name": "Mushrooms",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911731",
		                                    "is_orderable": "1",
		                                    "name": "Onions",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911732",
		                                    "is_orderable": "1",
		                                    "name": "Pepperoni",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911733",
		                                    "is_orderable": "1",
		                                    "name": "Peppers",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911734",
		                                    "is_orderable": "1",
		                                    "name": "Pineapple",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911735",
		                                    "is_orderable": "1",
		                                    "name": "Prosciutto",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911736",
		                                    "is_orderable": "1",
		                                    "name": "Ricotta Cheese",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911737",
		                                    "is_orderable": "1",
		                                    "name": "Sausage",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911738",
		                                    "is_orderable": "1",
		                                    "name": "Zucchini",
		                                    "price": "5.00"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "19026423",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "19",
		                            "max_free_child_select": "0",
		                            "min_child_select": "0",
		                            "name": "Choice of Extra Toppings",
		                            "price": "0.00"
		                        },
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911740",
		                                    "is_orderable": "1",
		                                    "name": "Garlic Bread",
		                                    "price": "3.50"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911741",
		                                    "is_orderable": "1",
		                                    "name": "French Fries",
		                                    "price": "5.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911742",
		                                    "is_orderable": "1",
		                                    "name": "Garlic Knots",
		                                    "price": "2.50"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911743",
		                                    "is_orderable": "1",
		                                    "name": "Big Rice Ball",
		                                    "price": "7.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911744",
		                                    "is_orderable": "1",
		                                    "name": "Sicilian Rice Ball",
		                                    "price": "7.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911745",
		                                    "is_orderable": "1",
		                                    "name": "Meatballs",
		                                    "price": "7.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911746",
		                                    "is_orderable": "1",
		                                    "name": "Lentil Soup Small",
		                                    "price": "6.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911747",
		                                    "is_orderable": "1",
		                                    "name": "Tiramisu",
		                                    "price": "5.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911748",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Coca Cola",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911749",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Diet Coca Cola",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911750",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Diet Pepsi",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911751",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Diet Sprite",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911752",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Ginger Ale",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911753",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Pepsi",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911754",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Sprite",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911755",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Water",
		                                    "price": "2.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911756",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Diet Lemon Ice Tea",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911757",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Diet Peach",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911758",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - snapple Diet Rasberry",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911759",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Kiwi Strawberry",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911760",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Lemon Ice Tea",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911761",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Mango Madness",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911762",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Orange",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911763",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Peach",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911764",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Pink Lemonade",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911765",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Rasberry",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911766",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Charge",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911767",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Energy",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911768",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Essential",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911769",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Focus",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911770",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Formula 50",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911771",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Power C",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911772",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - X X X",
		                                    "price": "3.00"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "32911739",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "12",
		                            "max_free_child_select": "0",
		                            "min_child_select": "0",
		                            "name": "Meal Additions",
		                            "price": "0.00"
		                        }
		                    ],
		                    "descrip": "",
		                    "id": "19026422",
		                    "is_orderable": "1",
		                    "name": "Whole Wheat Pizza",
		                    "price": "19.75",
		                    "rating": 3
		                }
		            ]
		        },
		        {
		            "tip": "On the day of a big event, eat your last meal 3 to 4 hours before exercising, to give your stomach time to empty.",
		            "name": "Sides",
		            "id": 3,
		            "children": [
		                {
		                    "additional_fee": "0.00",
		                    "availability": [
		                        0
		                    ],
		                    "descrip": "",
		                    "id": "19025847",
		                    "is_orderable": "1",
		                    "name": "Sicilian Rice Ball",
		                    "price": "8.75",
		                    "rating": 1
		                },
		                {
		                    "additional_fee": "0.00",
		                    "availability": [
		                        0
		                    ],
		                    "descrip": "",
		                    "id": "19025848",
		                    "is_orderable": "1",
		                    "name": "Mozzarella Stix",
		                    "price": "10.00",
		                    "rating": 2
		                },
		                {
		                    "additional_fee": "0.00",
		                    "availability": [
		                        0
		                    ],
		                    "descrip": "",
		                    "id": "19025849",
		                    "is_orderable": "1",
		                    "name": "Zucchini Stix",
		                    "price": "11.00",
		                    "rating": 3
		                }
		            ]
		        }
		    ],
		    "name": "Tribeca Pizzeria",
		    "postal_code": "10013-2328",
		    "rds_info": {
		        "logo": "",
		        "name": "delivery.com"
		    },
		    "restaurant_id": "23938",
		    "services": {
		        "delivery": "1",
		        "pickup": "1"
		    },
		    "state": "NY",
		    "hasChanged": false,
		    "isActive": true,
		    "tip": "When you exercise hard for 90 minutes or more, especially if you're doing something at high intensity that takes a lot of endurance, you need a diet that can help you perform at your peak and recover quickly afterward.",
		    "rating": 3
		};

		$scope.mainTip = true;

		$scope.accordionSelect = function(cid){
			// If Expanded Accordion is selected again, close all accordions
			if ($scope.accordionShow == cid) { $scope.accordionShow = -1; }
			// Else Expand Selected Accordion
			else { $scope.accordionShow = cid; }

			// If Accordion is open, close Main Tip
			if ($scope.accordionShow > 0) { $scope.mainTip = false; }
			// Otherwise, Show main tip
			else { $scope.mainTip = true; }
		};

		$scope.viewItem = function(iid){
			$scope.storage.activeItem = iid;
			$location.path('/item');
		};

	    $scope.reviewOrder = function(){
	    	$location.path('/review');
	    };

	});

	app.controller('ItemCtrl', function($scope, $http, $location){

		// @TODO

		// disable add item to tray

		// method to display names of options chosen
		$scope.displayNames = function(oid) {

			var currentItem = JSON.parse($scope.storage.currentItem);

			$scope.optionsDisp[oid] = '';

    		for( var opt in currentItem ) {
    			if (currentItem.hasOwnProperty(opt)) {
		    		if( currentItem[opt] && opt.search(oid) !== -1 ) {
		    			$scope.optionsDisp[oid] += JSON.parse(currentItem[opt]).name + ', ';
		    		}
		    	}
	    	}

	    	$scope.optionsDisp[oid].substring(0, $scope.optionsDisp[oid].length - 2);
		}

		$scope.menu = {
		    "addr": "378 Greenwich St",
		    "allow_asap": "yes",
		    "city": "New York",
		    "cs_contact_phone": "212-732-5959",
		    "cuisine": [
		        "Italian",
		        "Pizza",
		        "Wings"
		    ],
		    "latitude": "40.720028",
		    "longitude": "-74.010292",
		    "meal_name": {
		        "0": "always available"
		    },
		    "menu": [
		        {
		            "tip": "When you exercise hard for 90 minutes or more, especially if you're doing something at high intensity that takes a lot of endurance, you need a diet that can help you perform at your peak and recover quickly afterward.",
		            "name": "Salads",
		            "id": 1,
		            "children": [
		                {
		                    "additional_fee": "0.00",
		                    "availability": [
		                        0
		                    ],
		                    "children": [
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025922",
		                                    "is_orderable": "1",
		                                    "name": " No Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025923",
		                                    "is_orderable": "1",
		                                    "name": "Homemade Vinaigrette and Balsamic Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025924",
		                                    "is_orderable": "1",
		                                    "name": "Ranch Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025925",
		                                    "is_orderable": "1",
		                                    "name": "Caesar Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025926",
		                                    "is_orderable": "1",
		                                    "name": "Bleu Cheese Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025927",
		                                    "is_orderable": "1",
		                                    "name": "Creamy Italian Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025928",
		                                    "is_orderable": "1",
		                                    "name": "French Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025929",
		                                    "is_orderable": "1",
		                                    "name": "Honey Mustard Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025930",
		                                    "is_orderable": "1",
		                                    "name": "Russian Dressing",
		                                    "price": "0.00"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "19025921",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "1",
		                            "max_free_child_select": "0",
		                            "min_child_select": "1",
		                            "name": "Choice of Salad Dressing",
		                            "price": "0.00"
		                        },
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025932",
		                                    "is_orderable": "1",
		                                    "name": "Black Olives",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025933",
		                                    "is_orderable": "1",
		                                    "name": "Cranberries",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025934",
		                                    "is_orderable": "1",
		                                    "name": "Croutons",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025935",
		                                    "is_orderable": "1",
		                                    "name": "Green Olives",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025936",
		                                    "is_orderable": "1",
		                                    "name": "Hot Cherry Peppers",
		                                    "price": "1.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025937",
		                                    "is_orderable": "1",
		                                    "name": "Shaved Parmesan ",
		                                    "price": "1.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025938",
		                                    "is_orderable": "1",
		                                    "name": "Shredded Mozzarella",
		                                    "price": "1.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025939",
		                                    "is_orderable": "1",
		                                    "name": "Walnuts",
		                                    "price": "1.25"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "19025931",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "8",
		                            "max_free_child_select": "0",
		                            "min_child_select": "0",
		                            "name": "Salad Extras",
		                            "price": "0.00"
		                        }
		                    ],
		                    "descrip": "",
		                    "id": "19025920",
		                    "is_orderable": "1",
		                    "name": "Tomato & Cucumber Salad",
		                    "price": "12.50",
		                    "rating": 1
		                },
		                {
		                    "additional_fee": "0.00",
		                    "availability": [
		                        0
		                    ],
		                    "children": [
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025942",
		                                    "is_orderable": "1",
		                                    "name": " No Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025943",
		                                    "is_orderable": "1",
		                                    "name": "Homemade Vinaigrette and Balsamic Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025944",
		                                    "is_orderable": "1",
		                                    "name": "Ranch Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025945",
		                                    "is_orderable": "1",
		                                    "name": "Caesar Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025946",
		                                    "is_orderable": "1",
		                                    "name": "Bleu Cheese Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025947",
		                                    "is_orderable": "1",
		                                    "name": "Creamy Italian Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025948",
		                                    "is_orderable": "1",
		                                    "name": "French Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025949",
		                                    "is_orderable": "1",
		                                    "name": "Honey Mustard Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025950",
		                                    "is_orderable": "1",
		                                    "name": "Russian Dressing",
		                                    "price": "0.00"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "19025941",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "1",
		                            "max_free_child_select": "0",
		                            "min_child_select": "1",
		                            "name": "Choice of Salad Dressing",
		                            "price": "0.00"
		                        },
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025952",
		                                    "is_orderable": "1",
		                                    "name": "Black Olives",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025953",
		                                    "is_orderable": "1",
		                                    "name": "Cranberries",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025954",
		                                    "is_orderable": "1",
		                                    "name": "Croutons",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025955",
		                                    "is_orderable": "1",
		                                    "name": "Green Olives",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025956",
		                                    "is_orderable": "1",
		                                    "name": "Hot Cherry Peppers",
		                                    "price": "1.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025957",
		                                    "is_orderable": "1",
		                                    "name": "Shaved Parmesan ",
		                                    "price": "1.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025958",
		                                    "is_orderable": "1",
		                                    "name": "Shredded Mozzarella",
		                                    "price": "1.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025959",
		                                    "is_orderable": "1",
		                                    "name": "Walnuts",
		                                    "price": "1.25"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "19025951",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "8",
		                            "max_free_child_select": "0",
		                            "min_child_select": "0",
		                            "name": "Salad Extras",
		                            "price": "0.00"
		                        }
		                    ],
		                    "descrip": "",
		                    "id": "19025940",
		                    "is_orderable": "1",
		                    "name": "Tuna Salad Platter",
		                    "price": "13.75",
		                    "rating": 2
		                },
		                {
		                    "additional_fee": "0.00",
		                    "availability": [
		                        0
		                    ],
		                    "children": [
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025982",
		                                    "is_orderable": "1",
		                                    "name": " No Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025983",
		                                    "is_orderable": "1",
		                                    "name": "Homemade Vinaigrette and Balsamic Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025984",
		                                    "is_orderable": "1",
		                                    "name": "Ranch Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025985",
		                                    "is_orderable": "1",
		                                    "name": "Caesar Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025986",
		                                    "is_orderable": "1",
		                                    "name": "Bleu Cheese Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025987",
		                                    "is_orderable": "1",
		                                    "name": "Creamy Italian Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025988",
		                                    "is_orderable": "1",
		                                    "name": "French Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025989",
		                                    "is_orderable": "1",
		                                    "name": "Honey Mustard Dressing",
		                                    "price": "0.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025990",
		                                    "is_orderable": "1",
		                                    "name": "Russian Dressing",
		                                    "price": "0.00"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "19025981",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "1",
		                            "max_free_child_select": "0",
		                            "min_child_select": "1",
		                            "name": "Choice of Salad Dressing",
		                            "price": "0.00"
		                        },
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025992",
		                                    "is_orderable": "1",
		                                    "name": "Black Olives",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025993",
		                                    "is_orderable": "1",
		                                    "name": "Cranberries",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025994",
		                                    "is_orderable": "1",
		                                    "name": "Croutons",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025995",
		                                    "is_orderable": "1",
		                                    "name": "Green Olives",
		                                    "price": "1.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025996",
		                                    "is_orderable": "1",
		                                    "name": "Hot Cherry Peppers",
		                                    "price": "1.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025997",
		                                    "is_orderable": "1",
		                                    "name": "Shaved Parmesan ",
		                                    "price": "1.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025998",
		                                    "is_orderable": "1",
		                                    "name": "Shredded Mozzarella",
		                                    "price": "1.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "19025999",
		                                    "is_orderable": "1",
		                                    "name": "Walnuts",
		                                    "price": "1.25"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "19025991",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "8",
		                            "max_free_child_select": "0",
		                            "min_child_select": "0",
		                            "name": "Salad Extras",
		                            "price": "0.00"
		                        }
		                    ],
		                    "descrip": "",
		                    "id": "19025980",
		                    "is_orderable": "1",
		                    "name": "Greek Salad - Small",
		                    "price": "8.00",
		                    "rating": 3
		                },
		                {
		                    "additional_fee": "0.00",
		                    "availability": [
		                        0
		                    ],
		                    "children": [
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911508",
		                                    "is_orderable": "1",
		                                    "name": "Anchovies",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911509",
		                                    "is_orderable": "1",
		                                    "name": "Black Olives",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911510",
		                                    "is_orderable": "1",
		                                    "name": "Broccoli",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911511",
		                                    "is_orderable": "1",
		                                    "name": "Eggplant",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911512",
		                                    "is_orderable": "1",
		                                    "name": "Extra Cheese",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911513",
		                                    "is_orderable": "1",
		                                    "name": "Goat Cheese",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911514",
		                                    "is_orderable": "1",
		                                    "name": "Green Olives",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911515",
		                                    "is_orderable": "1",
		                                    "name": "Ham",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911516",
		                                    "is_orderable": "1",
		                                    "name": "Jalapenos",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911517",
		                                    "is_orderable": "1",
		                                    "name": "Meat Balls",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911518",
		                                    "is_orderable": "1",
		                                    "name": "Mushrooms",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911519",
		                                    "is_orderable": "1",
		                                    "name": "Onions",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911520",
		                                    "is_orderable": "1",
		                                    "name": "Pepperoni",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911521",
		                                    "is_orderable": "1",
		                                    "name": "Peppers",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911522",
		                                    "is_orderable": "1",
		                                    "name": "Pineapple",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911523",
		                                    "is_orderable": "1",
		                                    "name": "Prosciutto",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911524",
		                                    "is_orderable": "1",
		                                    "name": "Ricotta Cheese",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911525",
		                                    "is_orderable": "1",
		                                    "name": "Sausage",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911526",
		                                    "is_orderable": "1",
		                                    "name": "Zucchini",
		                                    "price": "5.00"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "19026343",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "19",
		                            "max_free_child_select": "0",
		                            "min_child_select": "0",
		                            "name": "Choice of Extra Toppings",
		                            "price": "0.00"
		                        },
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911528",
		                                    "is_orderable": "1",
		                                    "name": "Garlic Bread",
		                                    "price": "3.50"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911529",
		                                    "is_orderable": "1",
		                                    "name": "French Fries",
		                                    "price": "5.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911530",
		                                    "is_orderable": "1",
		                                    "name": "Garlic Knots",
		                                    "price": "2.50"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911531",
		                                    "is_orderable": "1",
		                                    "name": "Big Rice Ball",
		                                    "price": "7.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911532",
		                                    "is_orderable": "1",
		                                    "name": "Sicilian Rice Ball",
		                                    "price": "7.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911533",
		                                    "is_orderable": "1",
		                                    "name": "Meatballs",
		                                    "price": "7.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911534",
		                                    "is_orderable": "1",
		                                    "name": "Lentil Soup Small",
		                                    "price": "6.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911535",
		                                    "is_orderable": "1",
		                                    "name": "Tiramisu",
		                                    "price": "5.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911536",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Coca Cola",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911537",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Diet Coca Cola",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911538",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Diet Pepsi",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911539",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Diet Sprite",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911540",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Ginger Ale",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911541",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Pepsi",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911542",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Sprite",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911543",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Water",
		                                    "price": "2.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911544",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Diet Lemon Ice Tea",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911545",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Diet Peach",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911546",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - snapple Diet Rasberry",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911547",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Kiwi Strawberry",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911548",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Lemon Ice Tea",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911549",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Mango Madness",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911550",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Orange",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911551",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Peach",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911552",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Pink Lemonade",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911553",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Rasberry",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911554",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Charge",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911555",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Energy",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911556",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Essential",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911557",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Focus",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911558",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Formula 50",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911559",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Power C",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911560",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - X X X",
		                                    "price": "3.00"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "32911527",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "12",
		                            "max_free_child_select": "0",
		                            "min_child_select": "0",
		                            "name": "Meal Additions",
		                            "price": "0.00"
		                        }
		                    ],
		                    "descrip": "",
		                    "id": "19026342",
		                    "is_orderable": "1",
		                    "name": "Neapolitan Pizza Pie",
		                    "price": "18.75",
		                    "rating": 3
		                }
		            ]
		        },
		        {
		            "tip": "When you exercise hard for 90 minutes or more, especially if you're doing something at high intensity that takes a lot of endurance, you need a diet that can help you perform at your peak and recover quickly afterward.",
		            "name": "Entrees",
		            "id": 2,
		            "children": [
		                {
		                    "additional_fee": "0.00",
		                    "availability": [
		                        0
		                    ],
		                    "children": [
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911614",
		                                    "is_orderable": "1",
		                                    "name": "Anchovies",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911615",
		                                    "is_orderable": "1",
		                                    "name": "Black Olives",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911616",
		                                    "is_orderable": "1",
		                                    "name": "Broccoli",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911617",
		                                    "is_orderable": "1",
		                                    "name": "Eggplant",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911618",
		                                    "is_orderable": "1",
		                                    "name": "Extra Cheese",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911619",
		                                    "is_orderable": "1",
		                                    "name": "Goat Cheese",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911620",
		                                    "is_orderable": "1",
		                                    "name": "Green Olives",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911621",
		                                    "is_orderable": "1",
		                                    "name": "Ham",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911622",
		                                    "is_orderable": "1",
		                                    "name": "Jalapenos",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911623",
		                                    "is_orderable": "1",
		                                    "name": "Meat Balls",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911624",
		                                    "is_orderable": "1",
		                                    "name": "Mushrooms",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911625",
		                                    "is_orderable": "1",
		                                    "name": "Onions",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911626",
		                                    "is_orderable": "1",
		                                    "name": "Pepperoni",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911627",
		                                    "is_orderable": "1",
		                                    "name": "Peppers",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911628",
		                                    "is_orderable": "1",
		                                    "name": "Pineapple",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911629",
		                                    "is_orderable": "1",
		                                    "name": "Prosciutto",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911630",
		                                    "is_orderable": "1",
		                                    "name": "Ricotta Cheese",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911631",
		                                    "is_orderable": "1",
		                                    "name": "Sausage",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911632",
		                                    "is_orderable": "1",
		                                    "name": "Zucchini",
		                                    "price": "5.00"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "19026383",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "19",
		                            "max_free_child_select": "0",
		                            "min_child_select": "0",
		                            "name": "Choice of Extra Toppings",
		                            "price": "0.00"
		                        },
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911634",
		                                    "is_orderable": "1",
		                                    "name": "Garlic Bread",
		                                    "price": "3.50"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911635",
		                                    "is_orderable": "1",
		                                    "name": "French Fries",
		                                    "price": "5.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911636",
		                                    "is_orderable": "1",
		                                    "name": "Garlic Knots",
		                                    "price": "2.50"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911637",
		                                    "is_orderable": "1",
		                                    "name": "Big Rice Ball",
		                                    "price": "7.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911638",
		                                    "is_orderable": "1",
		                                    "name": "Sicilian Rice Ball",
		                                    "price": "7.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911639",
		                                    "is_orderable": "1",
		                                    "name": "Meatballs",
		                                    "price": "7.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911640",
		                                    "is_orderable": "1",
		                                    "name": "Lentil Soup Small",
		                                    "price": "6.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911641",
		                                    "is_orderable": "1",
		                                    "name": "Tiramisu",
		                                    "price": "5.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911642",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Coca Cola",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911643",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Diet Coca Cola",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911644",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Diet Pepsi",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911645",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Diet Sprite",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911646",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Ginger Ale",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911647",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Pepsi",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911648",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Sprite",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911649",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Water",
		                                    "price": "2.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911650",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Diet Lemon Ice Tea",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911651",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Diet Peach",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911652",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - snapple Diet Rasberry",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911653",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Kiwi Strawberry",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911654",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Lemon Ice Tea",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911655",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Mango Madness",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911656",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Orange",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911657",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Peach",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911658",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Pink Lemonade",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911659",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Rasberry",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911660",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Charge",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911661",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Energy",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911662",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Essential",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911663",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Focus",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911664",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Formula 50",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911665",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Power C",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911666",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - X X X",
		                                    "price": "3.00"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "32911633",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "12",
		                            "max_free_child_select": "0",
		                            "min_child_select": "0",
		                            "name": "Meal Additions",
		                            "price": "0.00"
		                        }
		                    ],
		                    "descrip": "",
		                    "id": "19026382",
		                    "is_orderable": "1",
		                    "name": "Sicilian Pizza (12 Slices)",
		                    "price": "25.75",
		                    "rating": 2
		                },
		                {
		                    "additional_fee": "0.00",
		                    "availability": [
		                        0
		                    ],
		                    "children": [
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911720",
		                                    "is_orderable": "1",
		                                    "name": "Anchovies",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911721",
		                                    "is_orderable": "1",
		                                    "name": "Black Olives",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911722",
		                                    "is_orderable": "1",
		                                    "name": "Broccoli",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911723",
		                                    "is_orderable": "1",
		                                    "name": "Eggplant",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911724",
		                                    "is_orderable": "1",
		                                    "name": "Extra Cheese",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911725",
		                                    "is_orderable": "1",
		                                    "name": "Goat Cheese",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911726",
		                                    "is_orderable": "1",
		                                    "name": "Green Olives",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911727",
		                                    "is_orderable": "1",
		                                    "name": "Ham",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911728",
		                                    "is_orderable": "1",
		                                    "name": "Jalapenos",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911729",
		                                    "is_orderable": "1",
		                                    "name": "Meat Balls",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911730",
		                                    "is_orderable": "1",
		                                    "name": "Mushrooms",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911731",
		                                    "is_orderable": "1",
		                                    "name": "Onions",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911732",
		                                    "is_orderable": "1",
		                                    "name": "Pepperoni",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911733",
		                                    "is_orderable": "1",
		                                    "name": "Peppers",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911734",
		                                    "is_orderable": "1",
		                                    "name": "Pineapple",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911735",
		                                    "is_orderable": "1",
		                                    "name": "Prosciutto",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911736",
		                                    "is_orderable": "1",
		                                    "name": "Ricotta Cheese",
		                                    "price": "5.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911737",
		                                    "is_orderable": "1",
		                                    "name": "Sausage",
		                                    "price": "3.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911738",
		                                    "is_orderable": "1",
		                                    "name": "Zucchini",
		                                    "price": "5.00"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "19026423",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "19",
		                            "max_free_child_select": "0",
		                            "min_child_select": "0",
		                            "name": "Choice of Extra Toppings",
		                            "price": "0.00"
		                        },
		                        {
		                            "additional_fee": "0.00",
		                            "children": [
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911740",
		                                    "is_orderable": "1",
		                                    "name": "Garlic Bread",
		                                    "price": "3.50"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911741",
		                                    "is_orderable": "1",
		                                    "name": "French Fries",
		                                    "price": "5.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911742",
		                                    "is_orderable": "1",
		                                    "name": "Garlic Knots",
		                                    "price": "2.50"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911743",
		                                    "is_orderable": "1",
		                                    "name": "Big Rice Ball",
		                                    "price": "7.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911744",
		                                    "is_orderable": "1",
		                                    "name": "Sicilian Rice Ball",
		                                    "price": "7.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911745",
		                                    "is_orderable": "1",
		                                    "name": "Meatballs",
		                                    "price": "7.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911746",
		                                    "is_orderable": "1",
		                                    "name": "Lentil Soup Small",
		                                    "price": "6.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911747",
		                                    "is_orderable": "1",
		                                    "name": "Tiramisu",
		                                    "price": "5.75"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911748",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Coca Cola",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911749",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Diet Coca Cola",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911750",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Diet Pepsi",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911751",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Diet Sprite",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911752",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Ginger Ale",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911753",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Pepsi",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "20 oz.",
		                                    "id": "32911754",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Soda - Sprite",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911755",
		                                    "is_orderable": "1",
		                                    "name": "Bottled Water",
		                                    "price": "2.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911756",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Diet Lemon Ice Tea",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911757",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Diet Peach",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911758",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - snapple Diet Rasberry",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911759",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Kiwi Strawberry",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911760",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Lemon Ice Tea",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911761",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Mango Madness",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911762",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Orange",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911763",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Peach",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911764",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Pink Lemonade",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911765",
		                                    "is_orderable": "1",
		                                    "name": "Snapple - Snapple Rasberry",
		                                    "price": "2.25"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911766",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Charge",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911767",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Energy",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911768",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Essential",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911769",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Focus",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911770",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Formula 50",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911771",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - Power C",
		                                    "price": "3.00"
		                                },
		                                {
		                                    "additional_fee": "0.00",
		                                    "availability": [
		                                        0
		                                    ],
		                                    "descrip": "",
		                                    "id": "32911772",
		                                    "is_orderable": "1",
		                                    "name": "Vitamin Water - X X X",
		                                    "price": "3.00"
		                                }
		                            ],
		                            "descrip": "",
		                            "free_child_select": "0",
		                            "id": "32911739",
		                            "is_orderable": "0",
		                            "item_select_weight": "1",
		                            "max_child_select": "12",
		                            "max_free_child_select": "0",
		                            "min_child_select": "0",
		                            "name": "Meal Additions",
		                            "price": "0.00"
		                        }
		                    ],
		                    "descrip": "",
		                    "id": "19026422",
		                    "is_orderable": "1",
		                    "name": "Whole Wheat Pizza",
		                    "price": "19.75",
		                    "rating": 3
		                }
		            ]
		        },
		        {
		            "tip": "On the day of a big event, eat your last meal 3 to 4 hours before exercising, to give your stomach time to empty.",
		            "name": "Sides",
		            "id": 3,
		            "children": [
		                {
		                    "additional_fee": "0.00",
		                    "availability": [
		                        0
		                    ],
		                    "descrip": "",
		                    "id": "19025847",
		                    "is_orderable": "1",
		                    "name": "Sicilian Rice Ball",
		                    "price": "8.75",
		                    "rating": 1
		                },
		                {
		                    "additional_fee": "0.00",
		                    "availability": [
		                        0
		                    ],
		                    "descrip": "",
		                    "id": "19025848",
		                    "is_orderable": "1",
		                    "name": "Mozzarella Stix",
		                    "price": "10.00",
		                    "rating": 2
		                },
		                {
		                    "additional_fee": "0.00",
		                    "availability": [
		                        0
		                    ],
		                    "descrip": "",
		                    "id": "19025849",
		                    "is_orderable": "1",
		                    "name": "Zucchini Stix",
		                    "price": "11.00",
		                    "rating": 3
		                }
		            ]
		        }
		    ],
		    "name": "Tribeca Pizzeria",
		    "postal_code": "10013-2328",
		    "rds_info": {
		        "logo": "",
		        "name": "delivery.com"
		    },
		    "restaurant_id": "23938",
		    "services": {
		        "delivery": "1",
		        "pickup": "1"
		    },
		    "state": "NY",
		    "hasChanged": false,
		    "isActive": true,
		    "tip": "When you exercise hard for 90 minutes or more, especially if you're doing something at high intensity that takes a lot of endurance, you need a diet that can help you perform at your peak and recover quickly afterward.",
		    "rating": 3
		};

		$scope.optionData = {};
		$scope.optionsDisp = {};
		$scope.orderRadio = [];
		$scope.optionErrMsg = '';




		// if we are editing an item, set that item ID to be the active item ID
		if( $scope.storage.editItem ) {
			$scope.storage.activeItem = $scope.storage.editItem;
		}

		// get the item data from the stored item ID & menu data
		for( var category in $scope.menu.menu ) {
			for( var item in $scope.menu.menu[category].children ) {
				if( $scope.menu.menu[category].children[item].id === $scope.storage.activeItem ) {
					$scope.item = $scope.menu.menu[category].children[item];
				}
			}
		}

		$scope.extraPrice = '0.00';
		$scope.totalPrice = $scope.item.price;
		$scope.$watch('storage.currentItem', function() {

			$scope.extraPrice = 0;
			var currentItem = $scope.storage.currentItem ? JSON.parse($scope.storage.currentItem) : {};

			for(var opt in currentItem) {
				if( currentItem.hasOwnProperty(opt) ) {
					if(currentItem[ opt ]) {
						$scope.extraPrice += parseFloat(JSON.parse(currentItem[opt]).price);
					}
				}
			}

			$scope.totalPrice = (parseFloat($scope.item.price) + $scope.extraPrice).toFixed(2);
			$scope.extraPrice = $scope.extraPrice.toFixed(2);

		});

		// if editing item, recreate the storage.currentItem (w/ all chosen options)
		if( $scope.storage.editItem ) {
			var cids = JSON.parse($scope.storage.editItemCids);

			var currentItem = {};

			var oids = [];

			for( var choiceId = 0; choiceId < cids.length; choiceId++ ) {
				for(var optCat = 0; optCat < $scope.item.children.length; optCat++ ) {
					for(var opt = 0; opt < $scope.item.children[optCat].children.length; opt++ ) {
						var option = $scope.item.children[optCat].children[opt];

						if( cids[choiceId] === option.id ) {
							oids.push($scope.item.children[optCat].id);
							currentItem[ $scope.item.children[optCat].id + '/' + option.id ] = JSON.stringify(option);
						}
					}
				}
			}

			$scope.storage.currentItem = JSON.stringify( currentItem );

			for(var oid = 0; oid < oids.length; oid ++) {
				$scope.displayNames(oids[oid]);
			}

		}

	    $scope.optionPopup = function(option){
	    	// if radio, JSON.parse 2 levels deep (is this rly necessary?)
			if( option.min_child_select == option.max_child_select == 1 ) {

				var currentItem = $scope.storage.currentItem ? JSON.parse($scope.storage.currentItem) : {};

				for( var opt in currentItem ) {
				 	if( currentItem.hasOwnProperty(opt) ) {
						if( currentItem[opt] ) {
				 			$scope.optionData[opt] = JSON.parse(currentItem[opt]);
				}	}	}

				$scope.optionData = currentItem;

			} else { // if checkbox, just parse.
				$scope.optionData = $scope.storage.currentItem ? JSON.parse($scope.storage.currentItem) : {};
			}

	    	$scope.storage.activeOption = JSON.stringify(option);
	    	$scope.popupModal('options');
	    };



		$scope.checkRadio = function(min, max, option, choice){
			if (min == max == 1) {
				$scope.orderRadio.push(option.id + '/' + choice.id);
			};
		};



	    $scope.storeOptions = function(min, max, optionId) {


	    	// if radio, put in the appropriate optionData
	    	if(min == max == 1) {
	    		var lastSelectedKey = $scope.orderRadio[ $scope.orderRadio.length -1 ];
	    		var newOptionData = {};
	    		newOptionData[ lastSelectedKey ] = JSON.stringify($scope.optionData[ lastSelectedKey ]);
	    		$scope.optionData = newOptionData;
	    	}

	    	// get # of chosen options
	    	var selectedNum = 0;
	    	for( var opt in $scope.optionData ) {
				if ($scope.optionData.hasOwnProperty(opt)) {
					if( $scope.optionData[opt] ) {
						selectedNum += 1;
					}
	    		}
	    	}

	    	// min/max number checking
	    	if( selectedNum < min ) { $scope.optionErrMsg = 'Need at least ' + min + ' options selected'; }
	    	else if ( selectedNum > max ) { $scope.optionErrMsg = 'Need at most ' + max + ' options selected'; }
	    	else { // put in the names of the selected options
	    		var optOnly = opt.split('/')[0];

	    		var combined = $scope.storage.currentItem ? JSON.parse($scope.storage.currentItem) : {};

	    		// remove old options if radio
	    		if(min == max == 1) {
	    			for( var opt in combined ) {
	    				if( combined.hasOwnProperty(opt) ) {
	    					if( opt.search(optOnly) !== -1 ) {
	    						combined[ opt ] = false;
	    					}
	    				}
	    			}
	    		}

	    		for(var opt in $scope.optionData) {
	    			if( $scope.optionData.hasOwnProperty(opt)) {
	    				combined[ opt ] = $scope.optionData[opt];
	    			}
	    		}

	    		$scope.storage.currentItem = JSON.stringify(combined);

	    		// display names
	    		$scope.displayNames(optOnly);

		    	// clear stuff
		    	$scope.optionData = {};
		    	$scope.orderRadio = [];
	    		$scope.optionErrMsg = '';
	    		$scope.closeModal();
	    	}

	    };

	    $scope.amountRange = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	    $scope.amount = 1;

	  //   $scope.checkForTray = function(view, dest){
	  //   	// If Tray Exists, and about to order from new Restaurant
			// if ($scope.storage.tray && $scope.storage.activeRest != $scope.storage.orderRest) {
			// 	$scope.popupModal('emptyTray');
			// } else {
			// 	// Add item to new tray
			// 	if (view == 'modal' {
			// 		$scope.popupModal(dest);
			// 	};
			// };
	  //   };

	    $scope.addItem = function() {
	    	console.log('addItem');

	    	if ($scope.storage.orderRest && $scope.storage.activeRest != $scope.storage.orderRest) {
	    		$scope.closeModal();
				$scope.popupModal('emptyTray');
				return;
			}

	    	$scope.storage.orderRest = $scope.storage.activeRest;

	    	var currItem = $scope.storage.currentItem ? JSON.parse($scope.storage.currentItem) : {};
	    	var cids = [];

	    	for(var op in currItem) {
	    		if (currItem.hasOwnProperty(op)) {
					if( currItem[op] ) {
						cids.push(JSON.parse(currItem[op]).id);
			}	}	}

	    	var newItem = {
				iid : $scope.storage.activeItem,
				amount: this.amount,
				cid: cids,
				item : $scope.item
	    	};


	    	var tray = $scope.storage.tray ? JSON.parse($scope.storage.tray) : [];

	    	if( $scope.storage.editItem ) { tray[ $scope.storage.editItemIndex ] = newItem; }
	    	else { tray.push(newItem); }
	    	

	    	$scope.storage.tray = JSON.stringify(tray);
	    	$scope.storage.currentItem = '';

	    	$scope.closeModal();

	    	$location.path( $scope.storage.editItem ? '/review' : '/menu' );


	    };

	    $scope.orderButton = $scope.storage.editItem ? 'Edit Item' : 'Add to Order';

	});

	app.controller('ReviewCtrl', function($scope, $http, $location){

		$scope.getSubtotal = function() {
			$scope.price = 0;
			angular.forEach($scope.tray, function(obj, trayItemKey) {

				var itemPrice = parseFloat(obj.item.price);

				angular.forEach(obj.cid, function(cidVal, cidKey) {
					angular.forEach(obj.item.children, function(optCatVal, optCatKey) {
						angular.forEach(obj.item.children[optCatKey].children, function(optVal, optKey) {
							if( cidVal === optVal.id ) {
								itemPrice += parseFloat(optVal.price);
							}
						})
					});
				});

				itemPrice *= parseFloat(obj.amount);
				$scope.price += itemPrice;
				$scope.price = $scope.price.toFixed(2);
			});
		}

		$scope.tray = $scope.storage.tray ? JSON.parse($scope.storage.tray) : $scope.clearStorage();

		$scope.$watch('storage.tray', function() {
			$scope.tray = $scope.storage.tray ? JSON.parse($scope.storage.tray) : $scope.clearStorage();

			$scope.getSubtotal();
			$scope.updateDisplay();
			// @TODO : make Fee call
			$scope.taxes = '3.50';

			$scope.priceTotal = (parseFloat($scope.price) + parseFloat($scope.taxes) ).toFixed(2);

		});


		$scope.optionsDisp = [];

		// if we're on the review page, we don't need the marker for an item being edited any longer
		$scope.storage.removeItem('editItem');


		// Filter Out and Add Selected Options to optionDisplay object
		$scope.updateDisplay = function(){
			for(var iidx = 0; iidx < $scope.tray.length; iidx++ ) {
				var item = $scope.tray[iidx];
				$scope.optionsDisp[ iidx ] = '';
				for(var cid = 0; cid < item.cid.length; cid++ ) {
					for(var optCat = 0; optCat < item.item.children.length; optCat++ ) {
						for(var opt = 0; opt < item.item.children[optCat].children.length; opt++ ) {
							var option = item.item.children[optCat].children[opt]
							if( option.id === item.cid[cid] ) {
								$scope.optionsDisp[ iidx ] += option.name + ', ';
			}	}	}	}	} 
		};


		$scope.editOption = function(item, iidx){

			$scope.storage.editItem = item.iid;
			$scope.storage.editItemCids = JSON.stringify(item.cid);
			$scope.storage.editItemIndex = iidx;
			$scope.closeModal();
			$location.path('/item');
		};

		$scope.fee = true;

		$scope.proceedToCheckout = function(){
			$location.path('/checkout');
		}

	});

	app.controller('CheckoutCtrl', function($scope, $http, $location){

		$scope.allFieldsFilled = true;

		// Keep Filtered Display Updated
		$scope.$watch('storage.deliveryAddress', function() {
			if ($scope.storage.deliveryAddress) {
				$scope.deliveryAddress = JSON.parse($scope.storage.deliveryAddress);
				$scope.addressDisplay = $scope.storage.deliveryAddressDisplay;
				$scope.addressName = $scope.deliveryAddress.addressName;
			} else {
				$scope.addressName = 'Please Select';
				$scope.addressDisplay = ':(';
			};
		});

	});

// @TODO Validation

// min/max buttons (options)
// all "required" options have been selected (item page)
// address field validation (search + checkout / enterAddressCtrl modal)
// show checkout button when order minimum reached (menu page)
		

// When item is added from new restaurant = prompt to empty tray
// App Reset = prompt to empty











