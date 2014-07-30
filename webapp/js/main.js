// Angular Setup
////////////////////////////////////////////////////////////////////////

// Declare App Module
var app = angular.module('app', ['ngRoute', 'ngAnimate']);

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
      when('/receipt', {
        templateUrl: 'partials/receipt.html',
        controller: 'ReceiptCtrl'
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
	
	app.controller('AppCtrl', function($scope, $http, $location, $timeout, ControllerStorage){

		// Simulate User Loggin Status
		$scope.userLoggedIn = function(){
			return true;
		};

		// Select Saved/Enter Address per Login Status
		$scope.selectAddress = function(){
			if ($scope.userLoggedIn() == true ) { return 'savedAddresses'; }
			else { return 'enterAddress'; }
		};

		// Modal Activation Controls
		////////////////////////////////////////////////////////////////

		// Initialize Modal Variables
		$scope.displayModal = false;
		$scope.displayLoader = false;
		$scope.displayError = false;
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

		$scope.flashError = function(){
			$scope.displayError = true;
			$timeout(function(){
				$scope.displayError = false;
				$scope.storage.errorMsg = '';
		    }, 3000); 
		};

		// Update Display Error Message
		$scope.$watch('storage.errorMsg', function() {
			$scope.errorMsg = $scope.storage.errorMsg;
		}); // $scope.errorMsg = ''; // Default



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

		$scope.storageSpace = function(){
			// Console Log remainingStorageSpace/totalStorageSpace
			var limit = 1024 * 1024 * 5; // 5 MB
 			var remSpace = limit - unescape(encodeURIComponent(JSON.stringify($scope.storage))).length;
 			console.log(remSpace+'/'+limit);
		};

		$scope.findYearRange = function() {
            var currentYear = new Date().getFullYear(), years = ['YY'];
            var endYear = currentYear + 100;
            console.log(currentYear);

            while ( currentYear < endYear ) {
                    years.push(currentYear++);
            } 

            return years;
    	}

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

		// Return if Radio Button
		$scope.isType = function(min, max){
			if (min == 1 && max == 1) { return 'radio'; }
			else { return 'checkbox'; }
		};

	});

	app.controller('QuantityCtrl', function($scope, $location){
		// do we still need this?
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
		$scope.filterForm = { "all" : true };
		$scope.storage.filterDisplay = "All Menus";
		$scope.storage.filter = $scope.storeObject($scope.filterForm);

		// Reveal 'Find Restaurants' button upon Address Selection
		$scope.$watch('storage.deliveryAddressDisplay', function() {
			if ($scope.storage.deliveryAddressDisplay) { $scope.storage.findRestButtonState = true; }
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

		$scope.showLoader();

		$http.get( $scope.storage.restListQuery )
			.success( function( data, status, header, config ) {
				$scope.restaurantList = data;
				$scope.hideLoader();
			})
			.error( function( data, status, header, config ) {
				console.log(status);
				$scope.hideLoader();
				$location.path('/blank');
				// $scope.storage.errorMsg = 'test';
				// $scope.flashError();
			});

		$scope.showAddress = $scope.storage.addressLineDisplay;

		// Initialize Filter Display/Checkbox/Storage
		// if filter was never set, default to "all"
		$scope.filterForm = $scope.storage.filter ? JSON.parse($scope.storage.filter) : { "all" : true };
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

		// Get Menu data if not set or Restaurant Changed
		if (!$scope.storage.menu || $scope.storage.activeRest != $scope.storage.newRest) {
			$scope.showLoader();
			$http.get( 'http://jay.craftinc.co/Slim/rd/' + $scope.storage.newRest )
				.success( function( data, status, header, config ) {
					$scope.storage.menu = JSON.stringify(data);
					$scope.hideLoader();
					$scope.storageSpace();
				})
				.error( function( data, status, header, config ) {
					// lol
					console.log(status+'damn'+$scope.storage.newRest);
					$scope.hideLoader();
					$location.path('/blank');
				});
		}

		// Update activeRest to newRest
		$scope.storage.activeRest = $scope.storage.newRest;

		// @TODO always make fee call when reaching this page
		// var address = JSON.parse($scope.storage.deliveryAddress);
		// var feeUrl = 'http://jay.craftinc.co/Slim/fee/' 
		// 	+ $scope.storage.activeRest + '/'
		// 	+ $scope.storage.subtotalPrice + '/' // @TODO store / get subtotal
		// 	+ $scope.storage.tip + '/' // @TODO store tip (or make it 0 at this stage?)
		// 	+ 'ASAP/' // default for ASAP delivery for v1
		// 	+ address.zipcode + '/'
		// 	+ address.city + '/'
		// 	+ address.addressLine;
		// $http.get( feeUrl )
		// 	.success( function( data, status, header, config ) {
		// 		// save gotten data (to then display it)
		// 	})
		// 	.error( function( data, status, header, config ) {
		// 		console.log(status);
		// 	});

		// Update Menu when changed
		$scope.$watch('storage.menu', function() {
			$scope.menu = $scope.storage.menu ? JSON.parse($scope.storage.menu) : {};
			$scope.menu.mino = '15.00';
		});

		// Menu Accordion Logic
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

		$scope.itemOrderable = true;

		// @TODO disable add item to tray (css color-fade, ng-click disabled)
		if ( false ) { // item.is_delivering != 1 || restaurant.not_deliverying == 1 
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

			// iterate over selected options and add their prices to extraPrice
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
	    	// @TODO see if JSON.parse 2 lvls deep should be done
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


	    // hack necessary to make sure radio buttons work: send the last clicked
	    // ratio button key to the orderRadio array
		$scope.checkRadio = function(min, max, option, choice){
			if (min == max == 1) {
				$scope.orderRadio.push(option.id + '/' + choice.id);
			};
		};



	    $scope.storeOptions = function(min, max, optionId) {

	    	// if radio, put in the appropriate optionData from the last orderRadio elmnt
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

	    	// check to make sure all necessary options have been selected
	    	// well, i actually need to revisit the structure to get a grasp on this.

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
				item : $scope.item,
				price : $scope.totalPrice
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
			// @TODO greatly simplify since price is now being saved
			angular.forEach($scope.tray, function(obj, trayItemKey) {

				var itemPrice = parseFloat(obj.item.price);

				angular.forEach(obj.cid, function(cidVal, cidKey) {
					angular.forEach(obj.item.children, function(optCatVal, optCatKey) {
						angular.forEach(obj.item.children[optCatKey].children, function(optVal, optKey) {
							if( cidVal === optVal.id ) {
								itemPrice += parseFloat(optVal.price);
							}
						});
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
		};

	});

	app.controller('CheckoutCtrl', function($scope, $http, $location){

		$scope.customer = {};
		$scope.orderObject = {};
    	$scope.yearRange = $scope.findYearRange();

    	// @TODO validate form fields
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

		$scope.updateTip = function(){
			$scope.customer.tip = $scope.customer.tipUpdate;
			$scope.closeModal();
		};

		$scope.orderFood = function() {

			$scope.showLoader();

			var tray = '';
			// Format Tray Object to proper string
			angular.forEach(JSON.parse($scope.storage.tray), function(item, key) {
				tray += '+' + item.iid + '/' + item.amount;
				angular.forEach(item.cid, function(option, index) {
					tray += ',' + option;
				});
			});
			// Remove leading '+'
			tray = tray.substring(1);

			// Populate http.post object
			$scope.orderObject.rid = $scope.storage.orderRest;
			$scope.orderObject.em = $scope.customer.email;
			$scope.orderObject.tray = tray;
			$scope.orderObject.tip = $scope.customer.tip || 0;
			$scope.orderObject.first_name = 'Jeremy';
			$scope.orderObject.last_name = 'Letto';
			$scope.orderObject.delivery_date = 'ASAP';
			$scope.orderObject.phone = $scope.customer.phone;
			$scope.orderObject.addr = $scope.deliveryAddress.addressLine;
			$scope.orderObject.addr2 = ''; // not asked for
			$scope.orderObject.city = $scope.deliveryAddress.city;
			$scope.orderObject.state = $scope.deliveryAddress.state;
			$scope.orderObject.zip = $scope.deliveryAddress.zipcode;
			$scope.orderObject.card_name = $scope.customer.cardName;
			$scope.orderObject.card_number = $scope.customer.cardNumber;
			$scope.orderObject.card_expiry = $scope.customer.cardMonth + '/' + $scope.customer.cardYear;
			$scope.orderObject.cvv = $scope.customer.cvv;
			$scope.orderObject.card_bill_addr = $scope.customer.billAddr;
			$scope.orderObject.card_bill_addr2 = $scope.customer.billAddr2 || '';
			$scope.orderObject.card_bill_city = $scope.customer.billCity;
			$scope.orderObject.card_bill_state = $scope.customer.billState;
			$scope.orderObject.card_bill_zip = $scope.customer.billZip;
			$scope.orderObject.card_bill_phone = $scope.customer.phone; // not asked for

			// Save Credit Card if checkbox selected
			if ($scope.orderObject.saveCard == true) {
				console.log('saveCard!');
			};

			var reqURL = 'http://jay.craftinc.co/Slim/order/'+$scope.storage.orderRest	;

			$http.post( reqURL, $scope.orderObject )
				.success( function( data, status, header, config ) {
					$scope.hideLoader();
					if (data.msg == 'Success') {
						$scope.storage.receipt = JSON.stringify(data.custserv);
						$location.path('/receipt');
					} else {
						// Show Error Msg
						$scope.hideLoader();
						console.log(data);
					};
					
				})
			.error( function( data, status, header, config ) {
				// Show Error Msg
				$scope.hideLoader();
				console.log('JCORE Backend failed:', data);
			});

		};

	});

	app.controller('ReceiptCtrl', function($scope, $http, $location){

		$scope.hideLoader();

		$scope.restDetails = JSON.parse($scope.storage.menu);

		// Define Model Variables
		$scope.est = '12:00pm'; // will be a geo-function
		$scope.restName = $scope.restDetails.name;
		$scope.distance = '0.3'; // also a geo-function

		$scope.itemName = 'itemName';
		$scope.itemPrice = '8.99';
		$scope.itemAmount = '2';

		$scope.subtotal = '16.98';
		$scope.tip = '2.00';
		$scope.total = '18.98';


	});

// @TODO Validation

// all "required" options have been selected (item page)
// address field validation (search + checkout / enterAddressCtrl modal)
// show checkout button when order minimum reached (menu page)
		

// When item is added from new restaurant = prompt to empty tray
// App Reset = prompt to empty







