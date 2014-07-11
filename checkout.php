<?php
$pageTitle = 'Checkout';
$pageClass = 'checkout';
include 'includes/meta.php';
?>

<!-- ************************************************************************************* -->
	<div id="appContent">
        
		<?php include 'includes/header.php'; ?>

		<form id="checkoutForm" name="checkoutForm" action="prompt.php" method="post">

		<?php
			// Simulate Logged In View w/ Saved Addresses
			$userLoggedIn = false;
			if ($userLoggedIn == true) {
		?>

			<div id="deliveryAddressBoxUser" class="popupButton">
				<h2 id="deliveryAddress" class="mainHeader">Delivery Address</h2>
				<div id="chosenAddress" class="screenItem">
					<h3>Choose Address</h3>
					<p>123 Easy St.</p>
				</div>
			</div>
			
			<div id="deliveryAddresses" class="popupMenu radioMenu">
				<div class="popupBox clearfix">
					<h5>Choose Address:</h5>
					<ul class="dataItems">
						<li>
							<label for="_homeAddress">Home
								<input id="_homeAddress" name="chooseAddressOption" value="home" type="radio" class="">
							</label>
						</li>
						<li>
							<label for="_workAddress">Work
								<input id="_workAddress" name="chooseAddressOption" value="work" type="radio" class="">
							</label>
						</li>
						<li>
							<label for="_friendAddress">Friend
								<input id="_friendAddress" name="chooseAddressOption" value="friend" type="radio" class="">
							</label>
						</li>
						<button id="enterNewAddressButton" class="bigButton buttonCenter popupButton" type="button">New Address</button>
					</ul>
				</div>
			</div>

		<!-- Simulate Guest/No Saved Addresses View -->
		<?php } else { ?>

			<div id="deliveryAddressBoxGuest" class="popupButton">
				<h2 id="deliveryAddress" class="mainHeader">Delivery Address</h2>
				<div id="chosenAddress" class="screenItem">
					<h3>Enter Address</h3>
				</div>
			</div>

		<?php } ?>

			<div id="enterNewAddress" class="popupMenu">
				<div class="popupBox clearfix">
					<h5>Enter Address:</h5>
					<ul class="inputItems">
						<li class="inputBox">
							<input id="addressLineInput" name="addressLine" type="text" class="inputField" placeholder="Address Line" value="<?php echo $_SESSION['addressLine']; ?>">
						</li>
						<li class="inputBox">
							<input id="cityInput" name="city" type="text" class="inputField" placeholder="City" value="<?php echo $_SESSION['city']; ?>">
						</li>
						<li class="inputBox">
							<input id="stateInput" name="state" type="text" class="inputField" placeholder="State" value="">
						</li>
						<li class="inputBox">
							<input id="zipcodeInput" name="zipcode" type="number" class="inputField" placeholder="Zip Code" value="<?php echo $_SESSION['zipcode']; ?>">
						</li>
						<?php if ($userLoggedIn) { ?>
							<li class="inputBox">
								<input id="nicknameInput" name="nickname" type="text" class="inputField" placeholder="Nickname (optional)">
							</li>
							<li class="saveField disabledText">
								<label for="saveAddress">Save this Address
									<input id="saveAddress" name="saveAddress" type="checkbox" disabled>
								</label>
							</li>
						<?php } ?>
					</ul>
					<button class="popupCancel smallButton cancelButton" type="button">Cancel</button>
					<button class="popupOk smallButton okButton" type="button">Ok</button>
				</div>
			</div>

			<h2 id="paymentHeader" class="mainHeader">Payment</h2>

			<div class="inputArea">
				<ul class="inputItems">
					<li class="leftCheckbox">
						<label id="payWithCash" for="cashOption">Pay with Cash
							<input id="cashOption" name="payWithCash" type="checkbox">
						</label>
					</li>
					<h5>Phone Number:</h5>
					<li class="inputBox">
						<input id="phoneNumberInput" name="phonenumber" type="number" class="inputField" placeholder="Phone Number">
					</li>
					<div id="payWithCredit">

						<h5>Credit Card Info:</h5>
						<li class="inputBox">
							<input id="cardNameInput" name="cardNameInput" type="text" class="inputField" placeholder="Name on Card">
						</li>
						<li class="inputBox">
							<input id="cardNumberInput" name="cardNumberInput" type="text" class="inputField" placeholder="Card Number">
						</li>
						<li class="inputBox tertiaryBox">
							<select id="expmonth" name="expmonth" class="inputField">
								<option value="" disabled selected>MM</option>
								<option value="01">01</option>
								<option value="02">02</option>
								<option value="03">03</option>
								<option value="04">04</option>
								<option value="05">05</option>
								<option value="06">06</option>
								<option value="07">07</option>
								<option value="08">08</option>
								<option value="09">09</option>
								<option value="10">10</option>
								<option value="11">11</option>
								<option value="12">12</option>
							</select>
						</li>
						<li class="inputBox tertiaryBox">
							<select name="expyear" class="inputField">
								<option value="" disabled selected>YY</option>
								<script>
									var myDate = new Date();

									var year = myDate.getFullYear();
									var year100 = year + 100;

									for(var i = year; i < year100; i++){
									  document.write('<option value="'+i+'">'+i+'</option>');
									}
								</script>
							</select>
						</li>
						<li class="inputBox tertiaryBox lastItem">
							<input id="cvv" name="cvv" type="password" placeholder="CVV" class="inputField">
						</li>

						<h5>Billing Address:</h5>
						<li class="inputBox">
							<input id="billingLine1Input" name="billingLine1" type="text" class="inputField" placeholder="Address Line 1">
						</li>
						<li class="inputBox">
							<input id="billingLine2Input" name="billingLine2" type="text" class="inputField" placeholder="Address Line 2">
						</li>
						<li class="inputBox">
							<input id="billingCityInput" name="billingCity" type="text" class="inputField" placeholder="City">
						</li>
						<li class="inputBox halfBox">
							<select id="billingStateInput" name="billingState" class="inputField">
								<option value="" disabled selected>State</option>
								<option value="AL">Alabama</option>
								<option value="AK">Alaska</option>
								<option value="AZ">Arizona</option>
								<option value="AR">Arkansas</option>
								<option value="CA">California</option>
								<option value="CO">Colorado</option>
								<option value="CT">Connecticut</option>
								<option value="DE">Delaware</option>
								<option value="DC">District Of Columbia</option>
								<option value="FL">Florida</option>
								<option value="GA">Georgia</option>
								<option value="HI">Hawaii</option>
								<option value="ID">Idaho</option>
								<option value="IL">Illinois</option>
								<option value="IN">Indiana</option>
								<option value="IA">Iowa</option>
								<option value="KS">Kansas</option>
								<option value="KY">Kentucky</option>
								<option value="LA">Louisiana</option>
								<option value="ME">Maine</option>
								<option value="MD">Maryland</option>
								<option value="MA">Massachusetts</option>
								<option value="MI">Michigan</option>
								<option value="MN">Minnesota</option>
								<option value="MS">Mississippi</option>
								<option value="MO">Missouri</option>
								<option value="MT">Montana</option>
								<option value="NE">Nebraska</option>
								<option value="NV">Nevada</option>
								<option value="NH">New Hampshire</option>
								<option value="NJ">New Jersey</option>
								<option value="NM">New Mexico</option>
								<option value="NY">New York</option>
								<option value="NC">North Carolina</option>
								<option value="ND">North Dakota</option>
								<option value="OH">Ohio</option>
								<option value="OK">Oklahoma</option>
								<option value="OR">Oregon</option>
								<option value="PA">Pennsylvania</option>
								<option value="RI">Rhode Island</option>
								<option value="SC">South Carolina</option>
								<option value="SD">South Dakota</option>
								<option value="TN">Tennessee</option>
								<option value="TX">Texas</option>
								<option value="UT">Utah</option>
								<option value="VT">Vermont</option>
								<option value="VA">Virginia</option>
								<option value="WA">Washington</option>
								<option value="WV">West Virginia</option>
								<option value="WI">Wisconsin</option>
								<option value="WY">Wyoming</option>
								<option value="AS">American Samoa</option>
								<option value="GU">Guam</option>
								<option value="MP">Northern Mariana Islands</option>
								<option value="PR">Puerto Rico</option>
								<option value="UM">United States Minor Outlying Islands</option>
								<option value="VI">Virgin Islands</option>
								<option value="AA">Armed Forces Americas</option>
								<option value="AP">Armed Forces Pacific</option>
								<option value="AE">Armed Forces Others</option>
							</select>	
						</li>
						<li class="inputBox halfBox lastItem">
							<input id="billZipcodeInput" name="billZipcode" type="number" class="inputField" placeholder="Zip Code">
						</li>
						<li class="saveField">
							<label for="saveCreditCard">Save this Card
								<input id="saveCreditCard" name="saveCreditCard" type="checkbox">
							</label>
						</li>
					</div>
				</ul>
			</div>

			<div id="orderTotal" class="actionInfo">
				<div class="itemPriceInfo">
					<h6>Subtotal</h6>
					<p>$22.97</p>
				</div>
				<div id="tipButton" class="itemPriceInfo popupButton">
					<h6>Add a Tip</h6>
					<p>$0.00</p>
				</div>
				<div class="itemPriceInfo">
					<h6>TOTAL</h6>
					<p>$24.97</p>
				</div>
			</div>

			<div id="tipMenu" class="popupMenu">
				<div class="popupBox clearfix">
					<h5>Give a Tip:</h5>
					<div class="inputBox">
						<input id="tipInput" name="tip" type="text" class="inputField" placeholder="Tip Amount">
					</div>
					<button class="popupCancel smallButton cancelButton" type="button">Cancel</button>
					<button class="popupOk smallButton okButton" type="button">Ok</button>
				</div>
			</div>

			<button for="checkoutForm" id="purchase" class="actionButton" type="submit">Send Me Food!</button>

		</form>

	</div>
<!-- ************************************************************************************* -->

<?php include 'includes/footer.php'; ?>
