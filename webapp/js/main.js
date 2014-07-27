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
app.config(['$routeProvider',// '$locationProvider',
  function($routeProvider /*, $locationProvider*/) {
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

      //$locationProvider.html5Mode(true);
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
		$scope.displayLoader = false;
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

		$scope.showLoader = function(){
			$scope.displayLoader = true;
		};

		$scope.hideLoader = function(){
			$scope.displayLoader = false;
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

		// @TODO Save Address when Checkbox Selected
		$scope.saveAddress = function(){

		};

	});

	app.controller('EnterAddressCtrl', function($scope, $http){

		// need this initialization, new address isn't picked up otherwise!
		$scope.addrForm = {};

		// Store New Address
		$scope.storeAddress = function() {
			$scope.storage.deliveryAddress = $scope.storeObject($scope.addrForm);
			// TODO: AJAX save store if user logged in & Checked Save
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
			if (bool) {
				$scope.storage.orderRest = $scope.storage.activeRest;
				$scope.closeModal();
				$scope.storage.removeItem('menu');
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

		$scope.storage.clear();

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
		$scope.restListQuery = function(){
			var address = JSON.parse($scope.storage.deliveryAddress);

			var reqUrl = 'http://jay.craftinc.co/Slim/rl/' + address.zipcode + '/' + address.city + '/' + address.addressLine;
			$scope.storage.restListQuery = encodeURI(reqUrl);

			$location.path('/restaurants');
		};

	});

	app.controller('RestaurantsCtrl', function($scope, $http, $location){

		console.log($scope.storage.restListQuery);

		// @TODO: screen loader

		$scope.showLoader();

		$http.get( $scope.storage.restListQuery )
			.success( function( data, status, header, config ) {
				$scope.restaurantList = data;
				$scope.hideLoader();
			})
			.error( function( data, status, header, config ) {
				console.log(status);
				$scope.hideLoader();
				// @TODO : show error message (if any)
			});
		


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
			$scope.storage.newRest = rid;
			$location.path('/menu');
		}
		
	});

	app.controller('MenuCtrl', function($scope, $http, $location){

		$scope.ratingx = 1;
		$scope.ratingy = 1;
		$scope.ratingz = 0;

		// Get Menu data if not set or Restaurant Changed
		if (!$scope.storage.menu || $scope.storage.activeRest != $scope.storage.newRest) {
			$scope.showLoader();
			$http.get( 'http://jay.craftinc.co/Slim/rd/' + $scope.storage.newRest )
				.success( function( data, status, header, config ) {
					$scope.storage.menu = JSON.stringify(data);
					$scope.hideLoader();
				})
				.error( function( data, status, header, config ) {
					console.log(status);
					$scope.hideLoader();
					// @TODO : show error message (if any)
				});
		}

		// Set menu to storage menu on Page Refresh
		if ( $scope.storage.menu ) { $scope.menu = JSON.parse($scope.storage.menu); }
		else { $location.path('/search'); } // Redirect to Home if no Menu exists

		// Update Menu when changed
		$scope.$watch('storage.menu', function() {
			if ( $scope.storage.menu ) { $scope.menu = JSON.parse($scope.storage.menu); $scope.menu.mino = '15.00';}
			else { $location.path('/search'); } // Redirect to Home if no Menu exists
		});

		// Update activeRest to newRest
		$scope.storage.activeRest = $scope.storage.newRest;

		// Menu Accordian Logic
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
		console.log(JSON.stringify('[19035012: [19035014], 19035022: [19035023]]'));

		$scope.itemOrderable = true;

		// @TODO disable add item to tray (css color-fade, ng-click disabled)
		if (true == false) { // item.is_delivering != 1 || restaurant.not_deliverying == 1 
			$scope.itemOrderable = false;
		};

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

		$scope.menu = JSON.parse($scope.storage.menu);


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

	    	// orderRest exists only if there's a tray
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
				$scope.price += parseFloat(itemPrice);
			});

			$scope.price = $scope.price.toFixed(2);
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











