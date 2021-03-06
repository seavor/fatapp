<?php
session_start();
$pageTitle = 'Review Order';
$pageClass = 'review';
include 'includes/meta.php';
?>

<?php
// get the restaurant menu for item extraction
$data = json_decode(file_get_contents($dbRoot.'restaurant_details?rid=' . $_SESSION['rid']), true);

$tray = $_SESSION['tray'];

echo $tray;

?>

<!-- ************************************************************************************* -->
	<div id="appContent">
        
		<?php include 'includes/header.php'; ?>

		<!-- @TODO: loop over tray string + match it to data to get back items -->

		<div data-itemnumber='1' class="itemReview popupButton clearfix">
			<h6>Farmer's Breakfast</h6>
			<p class="itemTotal">$13.98</p>
			<p class="itemAmount">x 2</p>
		</div>
		<div data-itemnumber='2' class="itemReview popupButton clearfix">
			<h6>Breakfast on the Go</h6>
			<p class="itemTotal">$8.99</p>
			<p class="itemAmount">x 1</p>
		</div>


		<div id="orderTotal" class="actionInfo">
			<div class="itemPriceInfo">
				<h6>Subtotal</h6>
				<p>$22.97</p>
			</div>
			<div class="itemPriceInfo">
				<h6>Delivery Fee</h6>
				<p>$2.00</p> <!-- @TODO: make fee call -->
			</div>
			<div class="itemPriceInfo">
				<h6>TOTAL</h6>
				<p>$24.97</p>
			</div>
		</div>

		<div id="editItemMenu" class="popupMenu">
			<div class="popupBox clearfix">
				<h5></h5>
				<ul class="lineItems">
					<li>
						<h4 title="edit" class="">Edit Item</h4>
					</li>
					<li>
						<h4 title="remove" class="">Remove Item</h4>
					</li>
				</ul>
				<button class="popupCancel smallButton cancelButton" type="button">Cancel</button>
			</div>
		</div>


		<button id="checkout" class="actionButton" data-redirect="checkout.php" type="submit">Proceed to Checkout</button>





















	</div>
<!-- ************************************************************************************* -->

<?php include 'includes/footer.php'; ?>
