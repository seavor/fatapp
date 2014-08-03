app.controller('ItemCtrl', function($scope, $location){

	$scope.menu = JSON.parse($scope.storage.menu);

		$scope.chosenOptions = {};
		$scope.optionsDisp = {};
		$scope.orderRadio = [];
		$scope.optionErrMsg = '';
		$scope.item = {};

		// make the price stuff at the bottom of the page dynamically work
		$scope.extraPrice = '0.00';
		$scope.totalPrice = $scope.item.price;

		// if we are editing an item, set that item ID to be the active item ID
		if( $scope.storage.editItem ) { $scope.storage.activeItem = $scope.storage.editItem; }

	    $scope.orderButton = $scope.storage.editItem ? 'Edit Item' : 'Add to Order';

		//////////////////////////////////////////////////////////////////////////////////

		// Extract Current Item out of the Menu
		for( var category in $scope.menu.menu ) { 
			for( var item in $scope.menu.menu[category].children ) {
				if( $scope.menu.menu[category].children[item].id === $scope.storage.activeItem ) {
					$scope.item = $scope.menu.menu[category].children[item];
				}
			}
		}

		// if editing item, recreate the storage.currentItem (w/ all chosen options)
		if( $scope.storage.editItem ) {
			var cids = JSON.parse($scope.storage.editItemCids);

			var currentItem = {};

			var oids = [];

			// item -> option -> choice
			for( var choiceId = 0; choiceId < cids.length; choiceId++ ) { // For Each Choice Chosen (previously chosen)
				for(var optCat = 0; optCat < $scope.item.children.length; optCat++ ) { // For All Options of the Item
					for(var opt = 0; opt < $scope.item.children[optCat].children.length; opt++ ) { // For All Choices of the Item
						var option = $scope.item.children[optCat].children[opt]; // option is the Choice currently looped over

						if( cids[choiceId] === option.id ) { // If the Chosen ID matches the currently Looped choice ID
							oids.push($scope.item.children[optCat].id);  // push the option onto oids array (used for display only)
							// put that choice object into structure from where all options are extracted
							currentItem[ $scope.item.children[optCat].id + '/' + option.id ] = JSON.stringify(option);
						}
					}
				}
			}

			// Store Old Selection of Options into into storage
			$scope.storage.currentItem = JSON.stringify( currentItem );

			for(var oid = 0; oid < oids.length; oid ++) {
				$scope.displayNames(oids[oid]);
			}

		}

		//////////////////////////////////////////////////////////////////////////////////

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

