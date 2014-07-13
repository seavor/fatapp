TODOs
=====

restaurants.php
---------------
* apply filters on restaurants page ( + send the selected filter on main page onto restaurants page ) [jQuery job]
* calculate distance on restaurants page (get lon/lat from sent address, calculate diff from rest lon/lat)
* remove the "confirm form resubmission" which happens on hitting back button on menu page

menu.php
--------
* get delivery fee & minimum order amnt
* calculate distance (as in restaurants page)
* show "goodness" for items
* show review order button only when at least one item has been added to the tray
* remove the "confirm form resubmission" which happens on hitting back button on items page

items.php
---------
* don't show option header if there are no options for an item
* either remove "Jay's Choices" completely, or put them into the DB
* have 1 instead of 2 foreach loops when showing the category options
* calculate price of selected item extras + total
* allow for scroll on option categories with many options

review.php
----------
* populate page, from the tray string:
** items
** options
** cost
** amount
** subtotal
** fee
* allow for tip input on this page?

checkout.php
------------
* show the delivery address (one-liner, as in index page)
* ask for name (in contact section)

receipt.php
-----------
* show correct ETA
* put in restaurant name
* show order (as before, from tray string)