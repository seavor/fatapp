<?php
session_start();
$pageTitle = 'Receipt';
$pageClass = 'receipt';
include 'includes/meta.php';

// ORDER PROCESSING
// *************************************************************************************
include "ordrin/api.php";

// $ordrin_api = new Ordrin\APIs('vwXYUSj_Bxl3UT-8xM7NAoHnEcVKM-OcrbPIvCzj5e4', Ordrin\APIs::TEST);

$fields = array(
	'rid'			  => $_SESSION['rid'],
	'em' 			  => $_POST['email'],
	'tray'			  => $_SESSION['tray'],
	'tip' 			  => '0',
	'first_name'      => 'Jeremy',
	'last_name'       => 'Letto',
	'delivery_date'   => 'ASAP',
	'phone' 		  => $_POST['phonenumber'],
	'addr' 			  => $_POST['addressLine'],
	'addr2' 		  => $_POST['addressLine'],
	'city' 			  => $_POST['city'],
	'state' 		  => 'NY',
	'zip' 			  => '10013',
	'card_name'       => $_POST['cardNameInput'],
	'card_number'     => '4111111111111111',
	'card_cvc'        => $_POST['cvv'],
	'card_expiry'      => $_POST['expmonth'] . '/' . $_POST['expyear'],
	'card_bill_addr'  => $_POST['billingLine1'],
	'card_bill_addr2' => $_POST['billingLine2'],
	'card_bill_city'  => $_POST['billingCity'],
	'card_bill_state' => $_POST['billingState'],
	'card_bill_zip'   => '10013',
	'card_bill_phone' => $_POST['phonenumber']
);

$url = "https://o-test.ordr.in/o/".$_SESSION['rid']."?_auth=1,vwXYUSj_Bxl3UT-8xM7NAoHnEcVKM-OcrbPIvCzj5e4";

// //url-ify the data for the POST
foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
rtrim($fields_string, '&');

//open connection
$ch = curl_init();

//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL, $url);
curl_setopt($ch,CURLOPT_POST, count($fields));
curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);

//execute post
$result = curl_exec($ch);

//close connection
curl_close($ch);





// $test = $ordrin_api->order_guest($orderArray);

// SEND ORDER
// *************************************************************************************
// $data = json_decode(file_get_contents($dbRoot.'delivery_list?datetime=ASAP&addr='.$_SESSION['addressLine'].'&city='.$_SESSION['city'].'&zip='.$_SESSION['zipcode']), true);





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