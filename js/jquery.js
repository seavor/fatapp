$("document").ready(function() {

	// Helper Functions
	////////////////////////////////////////////////////////////////////////

		// Pull GET Requests
		function getRequest() {
		    var vars = [], hash;
		    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		    for(var i = 0; i < hashes.length; i++)
		    {
		        hash = hashes[i].split('=');
		        vars.push(hash[0]);
		        vars[hash[0]] = hash[1];
		    }
		    return vars;
		    // Set GET variables to javaScript variable
		}   var getRequest = getRequest();

		function displayError(errorMsg) {
		  $('#errorMsg').text(errorMsg).fadeIn(1000, function () {
		    $(this).delay(1000).fadeOut(1000);
		  });
		}
    
		// Configure Data-Attribute Triggered Popup Display
		$('[data-popupbutton]').on('click', function(){
			$('.menuPopup[data-popup='+$(this).data('popupbutton')+']').show('400');
		});

		// Configure Data-Attribute Triggered Slide Display
		$('[data-menubutton]').on('click', function(){
			$('.menuPopup[data-popup='+$(this).data('menubutton')+']').slideToggle('400');
		});

		// Configure Popup Display w/ User Status Dependency
		$('[data-userPopup]').on('click', function(){
			if (userLoggedIn == true) {
				// Show User View
			} else {
				// Show Guest View
			};
		});

	// MenuBar
	////////////////////////////////////////////////////////////////////////

		// Page Redirect
		function pageRedirect( dest ) {
			window.location.assign(siteRoot + dest);
			$('#loading').show();
		}

		// Abstract Redirect Function
		$("[data-redirect]").on('click', function(){
			// Restaurant Selection
			if ($(this).data('rid')) {
				pageRedirect( $(this).data('redirect') + '?rid=' + $(this).data('rid'));
			}
			// else if {

			// }
			// Static Redirect
			else { pageRedirect( $(this).data('redirect') )} 
		});
    
	// Home Screen
	////////////////////////////////////////////////////////////////////////

		// Show Enter Address Popup on Search field Focus
		$('#addressSearch').on('click', function(){
            if (userLoggedIn == true) { // If User is Logged In, Show Saved Addresses
            	$('#chooseAddress').toggle('400');
            } else {
                $('#addressInputFields').toggle('400');
            }
		});
    
    	// Show Enter Address popup from Saved Addresses popup
    	$('#addNewAddress').on('click', function(){
            $('#chooseAddress').toggle('400');
            $('#addressInputFields').toggle('400');
        });
    
    	// Populate Address Field w/ Presaved Address
    	$('#chooseAddress input[name=chooseAddressOption]').on('click', function(){
            $('#addressSearch').val($(this).val() + ' (saved)');
            // @TODO Populate Hidden Form Fields w/ Saved Address Data
        });

		// Enable Save Address Field once All inputs have data
		$('#addressInputFields').on('keyup', function(){
	     	$('#addressInputFields input.inputField').each(function(){
	     		// Theres a bug here, only works on mouseup for last field
	     		if($.trim(this.value).length == 0) { // zero-length string AFTER a trim
	     			$('#saveAddress').prop('disabled', true);
	     			$('#saveAddress').prop('checked', false);
	     			$('li.saveField').addClass('disabledText');
	     		} else {
	     			$('#saveAddress').prop('disabled', false);
	     			$('li.saveField').removeClass('disabledText');
	     		}
	     	}); 
		});

		// Update Address Input Data
		$('#addressInputFields button.popupOk').on('click', function(){
			// Assign Data to Hidden Hold Fields
			$('#addressSearch').val($('#addressLineInput').val());
			$('#nicknameHold').val($('#nicknameInput').val());
			$('#addressLineHold').val($('#addressLineInput').val());
			$('#cityHold').val($('#cityInput').val());
			$('#zipcodeHold').val($('#zipcodeInput').val());
            
			// If Save Address is Checked, AJAX Save Request on 'OK'
			if ($('#saveAddress:checked').length == 1) {
                $('#addressSearch').val($('#nicknameInput').val() + ' (saved)');
				console.log('Ajax Request Needed (save address');
				// @TODO Reload Saved Address w/ AJAX, select new Saved Address 
			}
            
			// @TODO Address Verification Check???
		});

		// Revert Address Field Data on 'Cancel'
		$('#addressInputFields button.popupCancel').on('click', function(){
			// Assign Data From Hidden Hold Fields
			$('#addressSearch').val($('#addressLineHold').val());
			$('#nicknameInput').val($('#nicknameHold').val());
			$('#addressLineInput').val($('#addressLineHold').val());
			$('#cityInput').val($('#cityHold').val());
			$('#zipcodeInput').val($('#zipcodeHold').val());
		});

		// Populate Search field with GPS Data
		$('#gpsButton').on('click', function(){
			// Get phone GPS location
			var gpsData = '40.735537, -73.990729';
			$('#addressSearch').val('GPS: '+gpsData);
		});

		// Control Filter Menu Selection Checkboxes
		$('#restFilters input').on('click', function(){
			if ($('#restFilters input:checked').length!=0) {
				$('#restFilterAll').prop('checked', false);
			}	else { // If None Selected, Check 'All Menus'
				$('#restFilterAll').prop('checked', true);
			}

			// If all Filters are Selected, unselect all and select 'All Menus'
			if ($('#restFilters input:checkbox:not(:checked)').length==1) {
				$('#restFilters input').prop('checked', false);
				$('#restFilterAll').prop('checked', true);
			}
		});

		// Control 'All Menu' filter selection
		$('#restFilters #restFilterAll').on('click', function(){
			$('#restFilters input').prop('checked', false);
			$('#restFilters #restFilterAll').prop('checked', true);
		});

		// Populate Filter Display with Selections
		$('#restFilters button.popupOk').on('click', function(){
			$('#restFilterButton').html('Menu Filter: ');
			// Display Selected filters
		    $('#restFilters input:checked').each(function(i,v){
		    	$('#restFilterButton').append($(v).attr('value') + ', ');
		    	// @TODO Remove trailing comma
		    });
		    console.log('AJAX Request Needed (update menu filter)'); // @TODO
		});

		// Hide Action Button until Address Entered
		$('#restSearch button, #chooseAddress label').on('click', function(){
			if ($('#addressSearch').prop('value').length > 0) {
				$('.actionButton').removeClass('actionRequired');
				$('#loginButton').addClass('actionRequired');
			} else {
				$('.actionButton').addClass('actionRequired');
				$('#loginButton').removeClass('actionRequired');
			};
		});

		// @TODO Ajax Login Action, Update Data Fields
		$('#loginPopup button.okButton').on('click', function(){
			$('#loginButton').addClass('actionRequired');
		});


	// Restaurant Search Screen
	////////////////////////////////////////////////////////////////////////

		// Reload Menu Screen upon Filter Change
		// @TODO

	// Restraunt Menu Screen
	////////////////////////////////////////////////////////////////////////

		// Menu accordion Actions
		$('#menuCategories h3').on('click', function(){
			var activePanel = $(this).data('accordion');
			// If No accordion Panels Open
			if ($('.catPanel.activePanel').length == 0) {
				$(this).addClass('activeHead').parent('.catPanel').addClass('activePanel');
				$('#menuTip').slideUp();
				$('.catPanel.activePanel .catItems').slideDown();
			// If Active Accordian is Clicked Again
			} else if ($(this).hasClass('activeHead')) {
				$('h3.activeHead').removeClass('activeHead'); 
				$('#menuTip').slideDown();
				$('.catPanel.activePanel .catItems').slideUp();
				$('.catPanel.activePanel').removeClass('activePanel');
			// If One Accordian Panel is Open and a new one is Clicked
			} else {
				$('.catPanel.activePanel .catItems').slideUp();
				$('.catPanel.activePanel').removeClass('activePanel');
				$('h3.activeHead').removeClass('activeHead');
				$(this).addClass('activeHead').parent('.catPanel').addClass('activePanel');
				$('.catPanel.activePanel .catItems').slideDown();
			}
		});

		// Menu Item Click Action
		$('.menuItem').on('click', function(){
			window.location.assign("item.php");
			// Redirect to Restaurant Menu Screen
			// @TODO Take API data and filter into new API call for redirect
		});

		// Review Your Order Click Action
		$('#reviewOrder').on('click', function(){
			window.location.assign("review.php");
			// Redirect to Restaurant Menu Screen
			// @TODO Take API data and filter into new API call for redirect
		});

	// Menu Item Screen
	////////////////////////////////////////////////////////////////////////

		// Check Jay's Choices
		$('#jaysChoices .itemOptions	').on('click', function(){
			$(this).children('.optionChosen').css('background-position', '0 28px');
			// @TODO On Click, reselect form fields w/ Jay's Choices
		});

		// Display Popup on User Choice Selection
		$('#userChoices .itemOptions').on('click', function(){
			var selectedChoice = $(this).data('option');
			$('.menuPopup').filter('[data-popup='+selectedChoice+']').toggle('400');
		});

		// @TODO Tie Option Selection Functionailty between Jay's and User's Choices

		// Item Order Quantity Prompt and Add
		$('#addToOrder').on('click', function(){
			$('#itemQuantity').show('400');
		});

		// Change Action Button per Add/Edit step
		if (getRequest["item"] == 'edit') {
			$('#addToOrder').text('Edit Order');
			$('#itemOptions').prop('action', 'review.php?item=edited');
		} else {
			$('#itemOptions').prop('action', 'menu.php?order=add');
		};;

		// Change Redirection per Add/Edit step
		$('#itemQuantity .popupOk').on('click', function(){
			// Redirect Back to Menu Screen
			if (getRequest["item"] == 'edit') {
			} else {
				$('#itemOptions').prop('action', 'menu.php?order=add');
			};
		});

	// Review Order Screen
	////////////////////////////////////////////////////////////////////////

		// Tap Order Item for Edit/Remove popup
		$('.itemReview').on('click', function(){
			clickedItem = $(this).data('itemnumber');
			$('#editItemMenu').show('400');
			// Populate Menu Header
			$('#editItemMenu h5').text($(this).children('h6').text());
		});

		// Edit/Remove Item popup
		$('#editItemMenu h4').on('click', function(){
			var action = $(this).prop('title');
			// Redirect to Edit Item screen
			if (action == 'edit') {
				window.location.assign("item.php?item=edit&test=here");
			};

			// Remove Item from Order
			if (action == 'remove') {
				$('.itemReview[data-itemnumber='+clickedItem+']').remove();
				$( ".popupCancel" ).trigger( "click" );
			};

			// Send Back to Menu Screen if Last Option is removes
			if ($('.itemReview').length == 0) {
				window.location.assign("menu.php");
			};
		});

		// Edit Item and Redirect back to Review Order screen
		$('#editOrderItem').on('click', function(){	
			window.location.assign("review.php");
		});

		
		// Proceed to Checkout
		$('#checkout').on('click', function(){
			window.location.assign("checkout.php");
		});

	// Checkout Screen
	////////////////////////////////////////////////////////////////////////

		// Show Delivery Addresses Popup
		$('#deliveryAddressBoxUser').on('click', function(){
			$('#deliveryAddresses').toggle('400');
		});

		// Allow User to enter new address from Checkout screen
		$('#enterNewAddressButton').on('click', function(){
			$(this).parent().parent().parent().toggle('400');
			$('#enterNewAddress').toggle('400');
		});

		// Show Menu for Guest User
		$('#deliveryAddressBoxGuest').on('click', function(){
			$('#enterNewAddress').toggle('400');
		});

		// Show Delivery Addresses Popup
		$('#tipButton').on('click', function(){
			$('#tipMenu').toggle('400');
		});

		// Collapse Credit Card Fields if Pay w/ Cash option is Checked
		$('#cashOption').on('change', function(){
			if ($('#cashOption').prop('checked')) {
				$('#payWithCredit').hide('400');
			} else {
				$('#payWithCredit').show('400');
			};
		});

	// Create Account Prompt Screen	
	////////////////////////////////////////////////////////////////////////

		// Create Account Popup
		$('#createAccount').on('click', function(){
			$('#newAccount').toggle('400');
		});

		// Continue to Receipt Screen
		$('#skipCreate, #newAccount .popupOk, body.prompt #loginPopup .popupOk').on('click', function(){
			window.location.assign("receipt.php");
		});

		// Simulate Logged In Users Skipping Prompt
		if ( pageClass == 'prompt' && userLoggedIn == true) {
			window.location.assign("receipt.php");
		};
			console.log(userLoggedIn);
			console.log(pageClass);

		$('.existingUser').on('click', function(){
			$('#loginPopup').show('400');
		});

		$('#forgotPasswordButton').on('click', function(){
			$('#forgotPassword').show('400');
		});

		$('#forgotPassword button.popupOk').on('click', function(){
			window.location.assign("reset.php");
		});

		$('#resetConfirm').on('click', function(){
			window.location.assign("index.php");
		});

		$('#backToHome').on('click', function(){
			window.location.assign("index.php");
		});

	// Button Actions
	////////////////////////////////////////////////////////////////////////

		// Hide Action Items during Popup Events, Scroll to Top
		$('.popupButton').on('click', function(){
			 $('html, body').animate({
		        scrollTop: $("#appContent").offset().top
		    }, 400);
			$('button.actionButton').hide('400');
			$('.actionInfo').hide('400');
			console.log('popup');
		});

		// Ok/Cancel Menu Popup Window Close Action & Action Button Toggle
		$('.popupOk, .popupCancel').on('click', function(){
			// If Button requires a User Action, Disregard and Keep Hidden
			if (!$('actionButton').hasClass('actionRequired')) {
				$(this).parent().parent().toggle('400');
				$('.actionButton').show('400');
				$('.actionInfo').show('400');
			}
		});

		// Toggle Action Button via Other Button
		$('.userAction').on('click', function(){
			// If Button requires a User Action, Disregard and Keep Hidden
			if (!$('actionButton').hasClass('actionRequired')) {
				$('.actionButton').show('400');
				$('.actionInfo').show('400');
			}
		});

			// Give #appContent Element Padding if Action Info is displayed
			if ($('.actionInfo').css("display") == "block"){
				$('#appContent').css('padding-bottom', '40px');
			}

			// Send Action Info to Bottom if By Itself
			if ($('.actionInfo').css("display") == "block" && $('.actionButton').css("display") != "block"){
				$('.actionInfo').css('bottom', '0px');
			}

			// Give #appContent Element Padding if Action Button is displayed
			if ($('.actionButton').css("display") == "block"){
				$('#appContent').css('padding-bottom', '60px');
			}

			// Give #appContent Element More Padding if Action Info & Action Button are both displayed
			if ($('.actionInfo').css("display") == "block" && $('.actionButton').css("display") == "block"){
				$('#appContent').css('padding-bottom', '100px');
			}

		// Give Popup Items Cursors on Hover
		$('.popupBox ul li, .popupBox .inputBox').children().on('mouseenter', function(){
			$(this).css('cursor', 'pointer');
			$(this).filter('input[type=text], input[type=number]').css('cursor', 'text');
		}); // @TODO this seems like an unnecessary hack (css solution???)

    // Menu Actions
	////////////////////////////////////////////////////////////////////////

    	// Close Menu Once Option is Chosen 
		$('.radioMenu input[type=radio]').on('click', function(){
        	$(this).parents('.radioMenu').toggle('400');
			$('.actionInfo').show('400');
			$('.actionButton').show('400');
        }); // @TODO allow for separate actionButton behaviors


















});
