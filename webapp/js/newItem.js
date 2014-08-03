app.controller('ItemCtrl', function($scope, $location){

	$scope.menu = JSON.parse($scope.storage.menu);

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
		'name' : $scope.itemObj.name,
		'descrip' : $scope.itemObj.descrip,
		'price' : $scope.itemObj.price,
		'extra_price' : 0,
		'amount' : 0,
		'is_orderable' : $scope.itemObj.is_orderable,
		'edit_idx' : null,
		'extras' : {}
	};

	// Initialize Items Object w/ Extras & their Choices
	if (!$scope.storage.editItemObj) {
		var extras = $scope.itemObj.children;
		for(var option = 0; option < extras.length; option++ ) { // For All Options of the Item
			var optionId = extras[option].id;
			$scope.item.extras[ optionId ] = {};
			for(var choice = 0; choice < extras[option].children.length; choice++ ) { // For All Choices of the Item
				var choiceId = extras[option].children[choice].id;
				// Fill Item Object w/ values from Menu Obj
				$scope.item.extras[optionId][choiceId] = {
					'name' : extras[option].children[choice].name,
					'price' : extras[option].children[choice].price,
					'descrip' : extras[option].children[choice].descrip,
					'selected' : false,
					'jayChoice' : extras[option].children[choice].jay_choice
				};
		}	}
	// Set Edit Item Objects Tray Index if Exists
	} else { $scope.item.edit_idx = $scope.storage.editItemIndex; }

	//////////////////////////////////////////////////////////////////////////////////////

		// Calculate new Total Price when selected options are stored
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

	    	$scope.optionsDisp[oid] = $scope.optionsDisp[oid].substring(0, $scope.optionsDisp[oid].length - 2);
		};

	//////////////////////////////////////////////////////////////////////////////////////

		// Set Quantity Limit ( @TODO try to move to quantity controller)
	    $scope.amountRange = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	    $scope.amount = 1;

	    $scope.optionPopup = function(option){

	    	// set the type of select depending on the child_selects
			if( option.min_child_select == option.max_child_select == 1 ) { $scope.isType = 'radio'; } 
			else { $scope.isType = 'checkbox'; }


			$scope.chosenOptions = $scope.storage.currentItem ? JSON.parse($scope.storage.currentItem) : {};
	    	$scope.storage.activeOption = JSON.stringify(option);

	    	$scope.popupModal($scope.isType);
	    };








	    // hack necessary to make sure radio buttons work: send the last clicked
	    // ratio button key to the orderRadio array
		$scope.saveRadio = function(option, choice){
			$scope.orderRadio.push(option.id + '/' + choice.id);
		};



	    $scope.storeOptions = function(min, max, optionId) {

	    	// if radio, put in the appropriate chosenOptions from the last orderRadio elmnt
	    	if(min == max == 1) {
	    		var lastSelectedKey = $scope.orderRadio[ $scope.orderRadio.length -1 ];
	    		var newchosenOptions = {};
	    		newchosenOptions[ lastSelectedKey ] = JSON.stringify($scope.chosenOptions[ lastSelectedKey ]);
	    		$scope.chosenOptions = newchosenOptions;
	    	}

	    	// get # of chosen options
	    	var selectedNum = 0;
	    	for( var opt in $scope.chosenOptions ) {
				if ($scope.chosenOptions.hasOwnProperty(opt)) {
					if( $scope.chosenOptions[opt] && opt.search(optionId) !== -1 ) {
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

	    		for(var opt in $scope.chosenOptions) {
	    			if( $scope.chosenOptions.hasOwnProperty(opt)) {
	    				combined[ opt ] = $scope.chosenOptions[opt];
	    			}
	    		}

	    		$scope.storage.currentItem = JSON.stringify(combined);

	    		// display names
	    		$scope.displayNames(optOnly);

		    	// clear stuff
		    	$scope.chosenOptions = {};
		    	$scope.orderRadio = [];
	    		$scope.optionErrMsg = '';
	    		$scope.closeModal();
	    	}

	    };

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

	});

	app.controller('ReviewCtrl', function($scope, $location){

		// Reset on Page Load
		$scope.storage.removeItem('editItem');
		$scope.storage.removeItem('tip');

		$scope.tray = $scope.storage.tray ? JSON.parse($scope.storage.tray) : $scope.clearStorage();
		$scope.optionsDisp = [];

		$scope.getTotal = function() {
			var price = 0; // Calc SubTotal
			angular.forEach($scope.tray, function(obj, trayItemKey) {
				price += (parseFloat(obj.price) * obj.amount);
			});

			// Set SubTotal
			$scope.subTotal = price.toFixed(2);

			// Set Tip & Price Total
			var tip = $scope.storage.tip ? $scope.storage.tip : parseFloat(0).toFixed(2);
			$scope.storage.priceTotal = parseFloat(parseFloat($scope.subTotal) + parseFloat(tip)).toFixed(2);

			// Determine if Minimum Order is met
			if (parseFloat($scope.subTotal) >= parseFloat($scope.storage.mino)) { $scope.minimum = true; }
			else {$scope.minimum = false;};
		};

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

		$scope.updateDisplay();
		$scope.getTotal();

		// Recalc Values if Item Removed from Tray
		$scope.$watch('storage.tray', function() {
			$scope.tray = $scope.storage.tray ? JSON.parse($scope.storage.tray) : $scope.clearStorage(); // if empty, delete storage tray

			$scope.updateDisplay();
			$scope.getTotal();
		});

		// Watch for New Tip
		$scope.$watch('storage.tip', function() {
			$scope.getTotal();
		});

		$scope.editOption = function(item, iidx){
			$scope.storage.editItem = item.iid;
			$scope.storage.editItemCids = JSON.stringify(item.cid);
			$scope.storage.editItemIndex = iidx;
			$scope.closeModal();
			$location.path('/item');
		};

		$scope.proceedToCheckout = function(){
			$location.path('/checkout');
		};

	});