<?php
$pageTitle = 'Receipt';
$pageClass = 'receipt';
include 'includes/meta.php';
?>

<!-- ************************************************************************************* -->
	<div id="appContent">
        
		<?php include 'includes/header.php'; ?>

		<h2 class="screenHeader highHeader">Your Food is on the Way!</h2>

		<p class="centerSubheader">Estimated time of Delivery: 12:03pm</p>

		<div class="restaurantListingItem restaurantHead clearfix">
			<h5>Restaurant Name</h5>
			<p class="distanceAway">0.3m</p>
		</div>
		
		<h2 id="yourOrder" class="mainHeader underLine">Your Order:</h2>

		<div class="itemReview clearfix">
			<h6>Farmer's Breakfast</h6>
			<p class="itemTotal">$13.98</p>
			<p class="itemAmount">x 2</p>
		</div>
		<div class="itemReview clearfix">
			<h6>Breakfast on the Go</h6>
			<p class="itemTotal">$8.99</p>
			<p class="itemAmount">x 1</p>
		</div>

		<div id="orderReceiptAmount" class="actionInfo">
			<div class="itemPriceInfo">
				<h6>Subtotal</h6>
				<p>$22.97</p>
			</div>
			<div class="itemPriceInfo">
				<h6>Tip</h6>
				<p>$0.00</p>
			</div>
			<div class="itemPriceInfo">
				<h6>TOTAL</h6>
				<p>$24.97</p>
			</div>
		</div>
		
		<button id="backToHome" class="actionButton" type="button">Back to Home</button>

	</div>
<!-- ************************************************************************************* -->

<?php include 'includes/footer.php'; ?>