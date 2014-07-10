var rid = window.location.url;

$.get('http://eric-song.com:8000/restaurant_details?rid=23938', function( data ) {
	// set meta info
	$('h5').text( data.name );
	$('.distanceAway').text( '0.5 mi' ); // TODO
	//$('.feeWrapper') TODO
	$('.appleRating').addClass( data.rating + 'restRating' );
	$('#menuTip p').text( data.tip );

	// create menu
	$('#menuCategories').html(''); // empty contents
	var categoryElem, itemElem, catItems;
	var itemShort;
	var itemRating;
	for( var category in data.menu ) {
		categoryElem = $( '<div>' );
		categoryElem.addClass( 'catPanel' );

		categoryElem.append( '<h3>' + data.menu[category].name + '</h3>' );

		catItems = $('<div>');
		catItems.addClass('catItems');

		catItems.append( '<p class="healthTips">' + data.menu[category].tip + '</p>' );

		// forloop for menu items
		for( var item in data.menu[category].children ) {

			itemShort = data.menu[category].children[item];

			itemElem = $( '<div>' );
			itemElem.addClass( 'menuItem' );
			if( itemShort.rating == 1 ) { itemRating = 'Best'; }
			else if ( itemShort.rating == 2 ) { itemRating = 'Better'; }
			else { itemRating = 'Good'; }
			itemElem.addClass( 'item' + itemRating );

			itemElem.append( '<h6>' + itemShort.name + '</h6>' );
			itemElem.append( '<p class="itemPrice">$' + itemShort.price + '</p>' );
			itemElem.append( '<p class="itemDescription">' + itemShort.descrip + '</p>' );

			// forloop for (hidden) options

			catItems.append( itemElem );
		}

		categoryElem.append( catItems );
		$('#menuCategories').append( categoryElem );
	}


	// COPIED FROM JQUERY.JS
	// 'cause elements got removed, then added.
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
			window.location.assign("http://jay.craftinc.co/cardiello/item.php");
			// Redirect to Restaurant Menu Screen
			// @TODO Take API data and filter into new API call for redirect
		});

}, 'jsonp');

// Make call to backend w/ rid
