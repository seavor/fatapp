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
      when('/search', { templateUrl: 'partials/search.html', controller: 'SearchCtrl' }).
      when('/restaurants', { templateUrl: 'partials/restaurants.html', controller: 'RestaurantsCtrl' }).
      when('/menu', { templateUrl: 'partials/menu.html', controller: 'MenuCtrl' }).
      when('/item', { templateUrl: 'partials/item.html', controller: 'ItemCtrl' }).
      when('/review', { templateUrl: 'partials/review.html', controller: 'ReviewCtrl' }).
      when('/checkout', { templateUrl: 'partials/checkout.html', controller: 'CheckoutCtrl' }).
      when('/receipt', { templateUrl: 'partials/receipt.html', controller: 'ReceiptCtrl' }).
      otherwise({ redirectTo: '/search' });

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

		$scope.homeScreen = function(){
			$location.path('/search');
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
 			console.log('Storage: '+remSpace+'/'+limit);
		};

		$scope.findYearRange = function() {
            var currentYear = new Date().getFullYear(), years = [];
            var endYear = currentYear + 20;

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
			// @TODO ajax call for address info (aid) (run this onload in background)
		    {"aid":"001", "addressName":"Chinatown", "addressLine":"392 Broadway", "city":"New York", "state":"NY", "zipcode":"10013"}, 
		    {"aid":"002", "addressName":"Jeffries", "addressLine":"520 Madison Ave", "city":"New York", "state":"NY", "zipcode":"10022"}, 
		    {"aid":"003", "addressName":"Midtown", "addressLine":"1480 Broadway", "city":"New York", "state":"NY", "zipcode":"10036"}
		];
		
		$scope.chooseAddress = function(aid){
			$scope.addressList.forEach(function(addr) {
			    if (aid == addr.aid) {
			    	$scope.storage.deliveryAddress = JSON.stringify(addr);
					$scope.storage.deliveryAddressDisplay = addr.addressLine + ', ' + addr.city + ', ' + addr.zipcode;
					$scope.closeModal();
				}
			});
		};

	});

	app.controller('EnterAddressCtrl', function($scope, $http){

		// need this initialization, new address isn't picked up otherwise!
		$scope.addrForm = {};
		$scope.cantSave = true;

		// Store New Address
		$scope.storeAddress = function() {
			$scope.storage.deliveryAddress = JSON.stringify($scope.addrForm);
			$scope.storage.deliveryAddressDisplay = $scope.addrForm.addressLine + ', ' + $scope.addrForm.city + ', ' + $scope.addrForm.zipcode;
			$scope.closeModal();
			// TODO: AJAX save store if user logged in & Checked Save
			if ($scope.storeAddress.saveAddress) { console.log('saved'); }
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

    	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		// Initialize Popup Variables
		$scope.option = JSON.parse($scope.storage.activeOption); console.dir($scope.option);
		$scope.chosenOptions = {}; $scope.chosenRadio = '';

		// Get List of Selected IDs, Default for Checkboxes
		angular.forEach($scope.option.choices, function(choice, id) {
			if ($scope.option.choices[id].selected == true) {
				$scope.chosenOptions[id] = true;
			}
		});

		// If Option Modal is a Radio List
		if ($scope.option.min == $scope.option.max == 1) {
			// Assign Selected Choice to ngModel Variable
			if ($scope.chosenOptions.length != 0) {
				angular.forEach($scope.chosenOptions, function(option, id) {
					$scope.chosenRadio = id;
				});	
			}
		} 
		
    	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		$scope.storeOptions = function() {

			// If a Radio is Being Stored
			if ($scope.option.min == $scope.option.max == 1) {
				// Reset Radio Options to False
				angular.forEach($scope.option.choices, function(choice, id) {
					$scope.option.choices[id].selected = false;
				});
				// Set New Radio Option to True
				$scope.option.choices[$scope.chosenRadio].selected = true;
			// If a Checkbox List is Being Stored
			} else {
				angular.forEach($scope.chosenOptions, function(choice, id) {
					// If choice is not set to false (checked then unchecked)
					if (choice) { $scope.option.choices[id].selected = true; }
					else { $scope.option.choices[id].selected = false; };
				});
			}

			// Merge Updated Option Object back into Item Object
			$scope.item.extras[$scope.option.id] = $scope.option;
			$scope.updatePrice();
			$scope.closeModal();

		};

	});

	app.controller('EditItemCtrl', function($scope, $location){

		var tray = JSON.parse($scope.storage.tray);

		// Find the Targeted Item in the Tray and Set Variables for EditOption()
		tray.forEach(function(v, i){
			if (i == $scope.storage.popupParam) {
				$scope.name = v.name;
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
			
			if (tray.length == 0) {
				$scope.storage.removeItem('tray');
				$location.path('/menu');
			}
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

	app.controller('TipCtrl', function($scope, $location){

		$scope.updateTip = function(){
			// Update if Tip Given
			if ($scope.tipUpdate && $scope.tipUpdate >= 0) { $scope.storage.tip = parseFloat($scope.tipUpdate).toFixed(2); }
			// Otherwise remove Tip
			else { $scope.storage.removeItem('tip'); };
			 
			$scope.closeModal();
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
		$scope.storage.filter = JSON.stringify($scope.filterForm);

		// Reveal 'Find Restaurants' button upon Address Selection
		$scope.$watch('storage.deliveryAddress', function() {
			if ($scope.storage.deliveryAddress) { $scope.storage.findRestButtonState = true; }
			else { $scope.storage.findRestButtonState = false; }
		});

		$scope.displayRestButton = function(){
			// Change this to check against storage of search address
			var state = $scope.storage.findRestButtonState;
			return state;
		};

		// Find restaurants @TODO
		$scope.restListQuery = function(){

			$scope.showLoader();

			var address = JSON.parse($scope.storage.deliveryAddress);

			var reqUrl = 'http://jay.craftinc.co/Slim/rl/' + address.zipcode + '/' + address.city + '/' + address.addressLine;
			$scope.storage.reqUrl = reqUrl;

			$http.get( reqUrl )
				.success( function( data, status, header, config ) {
					if (data.error) {
						console.log(data.error);
						$scope.hideLoader();
						return;
					};
					$scope.storage.restaurantList = JSON.stringify(data);
					$scope.storage.newSearch = true;
					$location.path('/restaurants');
				})
				.error( function( data, status, header, config ) {
					console.log('Invalid Address: ', data);
					$scope.hideLoader();
					// $scope.storage.errorMsg = 'Invalid Address';
					// $scope.flashError();
				});

		};

	});

	app.controller('RestaurantsCtrl', function($scope, $http, $location){

		// Check if not a newSearch, refresh restaurantList if so
		if ($scope.storage.newSearch != 'true') {
			$scope.showLoader();
			var promise = $http.get( $scope.storage.reqUrl )
				.success( function( data, status, header, config ) {
					$scope.restaurantList = data;
					$scope.hideLoader();
				})
				.error( function( data, status, header, config ) {
					console.log('Invalid Address: ', data);
					$scope.hideLoader();
					// $scope.storage.errorMsg = 'Invalid Address';
					// $scope.flashError();
				});
		// Otherwise, show page
		} else { $scope.hideLoader(); };

		// Turn off newSearch param after check
		$scope.storage.newSearch = false;

		$scope.restaurantList = JSON.parse($scope.storage.restaurantList);
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


		$scope.viewMenu = function(rid, mino){
			$scope.newRest = rid;

			// Get Menu data if not set or Restaurant Changed
			if ($scope.storage.activeRest != $scope.newRest) {
				$scope.showLoader();
				$http.get( 'http://jay.craftinc.co/Slim/rd/' + $scope.newRest )
					.success( function( data, status, header, config ) {
						$scope.storage.menu = JSON.stringify(data);
						$scope.storage.activeRest = $scope.newRest;
						$scope.storage.mino = mino;
						$scope.storageSpace();
						$location.path('/menu');
					})
					.error( function( data, status, header, config ) {
						console.log(status+'damn'+$scope.storage.newRest);
						$scope.hideLoader();
					});
			// Otherwise, redirect to Menu page
			} else { $location.path('/menu'); }

		}
		
	});

	app.controller('MenuCtrl', function($scope, $http, $location){

		$scope.hideLoader();

		$scope.menu = JSON.parse($scope.storage.menu);
		$scope.menu.mino = $scope.storage.mino;

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

	app.controller('ItemCtrl', function($scope, $location){

    	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Initialize Page View
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		$scope.menu = JSON.parse($scope.storage.menu);// Set Quantity Limit ( @TODO try to move to quantity controller)
	    $scope.amountRange = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

		// if we are editing an item, set that item ID to be the active item ID
		if( $scope.storage.editItem ) { $scope.storage.activeItem = $scope.storage.editItem; }
		$scope.orderButton = $scope.storage.editItemIndex ? 'Edit Item' : 'Add to Order';

		// Extract Active Item out of the Menu
		for( var category in $scope.menu.menu ) { 
			for( var item in $scope.menu.menu[category].children ) {
				if( $scope.menu.menu[category].children[item].id === $scope.storage.activeItem ) {
					$scope.itemObj = $scope.menu.menu[category].children[item];
		}	}	}

		// Init Item Obj unless editItemObj Exists
		$scope.item = $scope.storage.editItemObj ? JSON.parse($scope.storage.editItemObj) : {
			'id' : $scope.itemObj.id,
			'name' : $scope.itemObj.name,
			'descrip' : $scope.itemObj.descrip,
			'price' : $scope.itemObj.price,
			'extra_price' : '0.00',
			'amount' : 1,
			'is_orderable' : $scope.itemObj.is_orderable,
			'edit_idx' : null,
			'extras' : {}
		};



		// Initialize Items Object w/ Extras & their Choices
		if (!$scope.storage.editItemObj) {
			var extras = $scope.itemObj.children ? $scope.itemObj.children : [];
			// For All Options of the Item
			for(var option = 0; option < extras.length; option++ ) {
				var optionId = extras[option].id;
				// Set Each Extra's Min/Max Value
				$scope.item.extras[ optionId ] = {
					'id' : extras[option].id,
					'name' : extras[option].name,
					'min' : extras[option].min_child_select,
					'max' : extras[option].max_child_select,
					'choices' : {}
				};

				// For All Choices of the Item
				if (extras[option].children) {
					for(var choice = 0; choice < extras[option].children.length; choice++ ) {
						var choiceId = extras[option].children[choice].id;
						// Fill Item Object w/ values from Menu Obj
						$scope.item.extras[optionId].choices[choiceId] = {
							'id' : extras[option].children[choice].id,
							'name' : extras[option].children[choice].name,
							'price' : extras[option].children[choice].price,
							'descrip' : extras[option].children[choice].descrip,
							'selected' : extras[option].children[choice].jay_choice,
							'jayChoice' : extras[option].children[choice].jay_choice
						};
					} // Remove Choices Obj from array if empty
				} else { delete $scope.item.extras[optionId].choices; }
			} // unset extras from the Item Object if none
			if (!extras) { delete $scope.item['extras']; }
		// Set Edit Item Objects Tray Index if Exists
		} else { $scope.item.edit_idx = $scope.storage.editItemIndex; }

		// Update Total Price on change to Item Object's extra_price
		$scope.$watch('item.extra_price', function() {
			console.log('watched');
			$scope.totalPrice = (parseFloat($scope.item.price) + parseFloat($scope.item.extra_price)).toFixed(2);
		});

    	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		// Function to Update Item Object's extra_price
		$scope.updatePrice = function(){
			var price = 0;
			angular.forEach($scope.item.extras, function(option, id) {
				angular.forEach(option.choices, function(choice, id) {
					if (choice.selected == true) {
						price += parseFloat(choice.price);
					};
				});
			});
			$scope.item.extra_price = price.toFixed(2);
		};

		$scope.updatePrice();

    	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Display Option Popup
    	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	    $scope.optionPopup = function(option){

	    	// set the type of select depending on the child_selects
			if( $scope.item.extras[option].min == 1 && $scope.item.extras[option].max == 1 ) { $scope.isType = 'radio'; } 
			else { $scope.isType = 'checkbox'; }

			// Initialize and Store activeOption Object
	    	$scope.storage.activeOption = JSON.stringify($scope.item.extras[option]);

	    	$scope.popupModal($scope.isType);

	    };

	    $scope.checkRequirements = function(){

	    	// check to make sure all necessary options have been selected
	    	var notEnough = false;
	    	angular.forEach($scope.item.extras, function(choices, id) {
	    		var selectedCounter = 0;
		    	angular.forEach(choices.choices, function(choice, id) {
					if (choice.selected == true) { selectedCounter++; }
				});

				if (selectedCounter < choices.min) {
					notEnough = true;
					console.log('need at least ' + choices.min + ' choices for ' + choices.name);
				} 
			});	
	    	// If any items have been found to need selections, return
			if( notEnough ) { $scope.closeModal(); return; }
			else { $scope.popupModal('quantity'); }

	    };

	    $scope.addItem = function() {


	    	// orderRest exists only if there's a tray
	    	if ($scope.storage.orderRest && $scope.storage.activeRest != $scope.storage.orderRest) {
	    		$scope.closeModal();
				$scope.popupModal('emptyTray');
				return;
			}

			// Set Active Restaurant and Init Tray
	    	$scope.storage.orderRest = $scope.storage.activeRest;
	    	var tray = $scope.storage.tray ? JSON.parse($scope.storage.tray) : [];

	    	if( $scope.storage.editItem ) { tray[$scope.item.edit_idx] = $scope.item; }
	    	else { tray.push($scope.item); }
	    	
	    	$scope.storage.tray = JSON.stringify(tray);
	    	$scope.closeModal();

	    	$location.path( $scope.storage.editItem ? '/review' : '/menu' );

	    };

	});

	app.controller('ReviewCtrl', function($scope, $location){

		$scope.storage.removeItem('editItem');
		$scope.storage.removeItem('editItemObj');
		$scope.storage.removeItem('editItemIndex');
		$scope.tray = $scope.storage.tray ? JSON.parse($scope.storage.tray) : $scope.clearStorage();

		$scope.editOption = function(item, iidx){
			$scope.storage.editItem = item.id;
			$scope.storage.editItemObj = JSON.stringify(item);
			$scope.storage.editItemIndex = iidx;
			$scope.closeModal();
			$location.path('/item');
		};

		$scope.getTotal = function() {
			var price = 0; // Calc SubTotal
			angular.forEach($scope.tray, function(item, trayIdx) {
				price += (parseFloat(item.price) * item.amount);
			});

			// Set SubTotal
			$scope.subTotal = price.toFixed(2);

			// Set Tip & Price Total
			var tip = $scope.storage.tip ? $scope.storage.tip : parseFloat(0).toFixed(2);
			$scope.priceTotal = parseFloat(parseFloat($scope.subTotal) + parseFloat(tip)).toFixed(2);

			// Determine if Minimum Order is met
			if (parseFloat($scope.subTotal) >= parseFloat($scope.storage.mino)) { $scope.minimum = true; }
			else {$scope.minimum = false;};
		};

		$scope.proceedToCheckout = function(){
			$scope.storage.priceTotal = $scope.priceTotal;
			$location.path('/checkout');
		};

		$scope.getTotal();
		
		// Update Tray & Display when Item Removed
		$scope.$watch('storage.tray', function(){
			if ($scope.storage.tray) {
				$scope.tray = JSON.parse($scope.storage.tray);
				$scope.getTotal();
			}
		});

		// Watch for New Tip
		$scope.$watch('storage.tip', function() {
			$scope.getTotal();
		});

	});

	app.controller('CheckoutCtrl', function($scope, $http, $location){

		// Set Defaults
		$scope.customer = {}; // Form Field ngModel
		$scope.orderObject = {}; // Object Passed into Post request
    	$scope.grandTotal = $scope.storage.priceTotal; // Init grandTotal to order's priceTotal
    	$scope.yearRange = $scope.findYearRange();
    	$scope.fee = '0.00';

		$scope.checkAddress = function(url){
			$scope.showLoader();
			$scope.addressError = '';
			$http.get( url )
				.success( function( data, status, header, config ) {
					// If Error is returned
					if (data['_err'] == 0) {
						$scope.checkoutButton = 'Out of Range';
						$scope.addressError = 'Address Out of Range';
						$scope.grandTotal = 'n/a';
						$scope.storage.fee = $scope.fee = 'n/a';
						$scope.storage.grandTotal = 'n/a';
						$scope.hideLoader();
					} else {
    					$scope.checkoutButton = 'Send Me Food!';
						// Set Fee field for View
						$scope.fee = parseFloat(data.fee).toFixed(2);
						// Add Taxes to Fees if they exists
						if (!isNaN(data.tax)) { $scope.fee = (parseFloat($scope.fee) + parseFloat(data.tax)).toFixed(2); }
						// Calc Grand Total
						$scope.grandTotal = parseFloat(parseFloat($scope.storage.priceTotal) + parseFloat($scope.fee)).toFixed(2);
						$scope.storage.fee = $scope.fee;
						$scope.storage.grandTotal = $scope.grandTotal;
						$scope.hideLoader();
					}
				})
				.error( function( data, status, header, config ) {
					console.log(data);
					$scope.hideLoader();
				});
		};

		// Make Fee call on pageLoad for stored deliveryAddress
		var address = JSON.parse($scope.storage.deliveryAddress);
		var feeUrl = 'http://jay.craftinc.co/Slim/fee/' 
			+ $scope.storage.activeRest + '/'
			+ $scope.price + '/'
			+  $scope.storage.tip + '/'
			+ 'ASAP/'
			+ address.zipcode + '/'
			+ address.city + '/'
			+ address.addressLine;
		$scope.checkAddress(feeUrl);

		// Keep deliveryAddress Object Updated & make new Fee call
		$scope.$watch('storage.deliveryAddress', function() {
			if ($scope.storage.deliveryAddress) {
				$scope.deliveryAddress = JSON.parse($scope.storage.deliveryAddress);
				$scope.addressDisplay = $scope.storage.deliveryAddressDisplay;
				$scope.addressName = $scope.deliveryAddress.addressName;
				// Make New Fee Call for Address Change
				feeUrl = 'http://jay.craftinc.co/Slim/fee/' 
					+ $scope.storage.activeRest + '/'
					+ $scope.price + '/'
					+  $scope.storage.tip + '/'
					+ 'ASAP/'
					+ $scope.deliveryAddress.zipcode + '/'
					+ $scope.deliveryAddress.city + '/'
					+ $scope.deliveryAddress.addressLine;

				$scope.checkAddress(feeUrl);
			} else { // If no deliveryAddress has been selected
				$scope.addressName = 'Please Select';
				$scope.addressDisplay = ':(';
			};
		});

		$scope.orderFood = function() {

			$scope.showLoader();

			var tray = '';
			// Format Tray Object to proper string
			angular.forEach(JSON.parse($scope.storage.tray), function(item, key) {
				tray += '+' + item.id + '/' + item.amount;
				angular.forEach(item.extras, function(option, index) {
					angular.forEach(option.choices, function(choice, idx) {
						if (choice.selected) {
							tray += ',' + choice.id;
						}
					});
				});
			});
			// Remove leading '+'
			tray = tray.substring(1);

			// Populate http.post object
			$scope.orderObject.rid = $scope.storage.orderRest;
			$scope.orderObject.em = $scope.customer.email;
			$scope.orderObject.tray = tray;
			$scope.orderObject.tip = $scope.storage.tip || 0;
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
			$scope.orderObject.card_cvc = $scope.customer.cvc;
			$scope.orderObject.card_bill_addr = $scope.customer.billAddr;
			$scope.orderObject.card_bill_addr2 = $scope.customer.billAddr2 || '';
			$scope.orderObject.card_bill_city = $scope.customer.billCity;
			$scope.orderObject.card_bill_state = $scope.customer.billState;
			$scope.orderObject.card_bill_zip = $scope.customer.billZip;
			$scope.orderObject.card_bill_phone = $scope.customer.phone; // not asked for

			console.log($scope.orderObject);

			// Save Credit Card if checkbox selected
			if ($scope.customer.saveCard == true) {
				console.log('saveCard!');
			};

			var reqURL = 'http://jay.craftinc.co/Slim/order/'+$scope.storage.orderRest	;

			$http.post( reqURL, $scope.orderObject )
				.success( function( data, status, header, config ) {
					$scope.hideLoader();
					if (data.msg == 'Success') {
						console.log(data);
						$scope.storage.receipt = JSON.stringify(data.custserv);
						$location.path('/receipt');
					} else {
						// Show Error Msg
						$scope.hideLoader(); // Instead, hideLoader() thru another feeCall() ???
						console.log('Ordr.in\'s Fault: '+data);
					};
					
				})
			.error( function( data, status, header, config ) {
				// Show Error Msg
				$scope.hideLoader();
				console.log('JCORE Backend failed:', data);
			});

		};

	});

	app.controller('ReceiptCtrl', function($scope, $location){

		$scope.hideLoader();

		$scope.menu = JSON.parse($scope.storage.menu);
		$scope.tray = JSON.parse($scope.storage.tray);
		console.log($scope.tray);
		// var receipt = JSON.parse($scope.storage.receipt);

		// Define Model Variables
		$scope.est = '12:00pm'; // currentTime + receipt.time
		$scope.distance = '0.3'; // geo-function

		$scope.subtotal = $scope.storage.priceTotal;
		$scope.fee = $scope.storage.fee;
		$scope.total = $scope.storage.grandTotal;


	});

// @TODO Validation

// all "required" options have been selected (item page)
// address field validation (search + checkout / enterAddressCtrl modal)
// show checkout button when order minimum reached (menu page)
		

// When item is added from new restaurant = prompt to empty tray
// App Reset = prompt to empty







