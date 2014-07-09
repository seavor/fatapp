<?php
$pageTitle = 'Fat App';
$pageClass = 'home';
include 'includes/meta.php';
?>

<!-- ************************************************************************************* -->
	<div id="appContent">
        
		<?php include 'includes/header.php'; ?>

		<form id="restSearch" name="restSearch" action="restaurants.php" method="post">

			<div class="clearfix">
				<div id="addressField" class="inputBox popupButton">
					<input id="addressSearch" name="addressSearch" type="text" class="inputField" placeholder="enter address" required readonly>
				</div>
				<button id="gpsButton" class="" type="button"></button>
			</div>

			<button id="restFilterButton" class="bigButton popupButton popupButton" type="button" data-popupbutton="restFilter">Filter: All Menus</button>

			<div id="dailyFitTip">
				<h3>Cardiello Fit Tip:</h3>
				<p>An apple a day is a played out cliche.</p>
            </div>

			<div id="restFilters" class="menuPopup" data-popup="restFilter">
				<div class="popupBox clearfix">
					<h5>Menu Filter:</h5>
					<ul class="popupItems">
					<li>
						<label for="restFilterAll">All Menus
							<input id="restFilterAll" name="all" value="All Menus" type="checkbox" class="" checked>
						</label>
					</li>
						<li>
							<label for="restFilterBrunch">Brunch
								<input id="restFilterBrunch" name="brunch" value="Brunch" type="checkbox" class="">
							</label>
						</li>
						<li>
							<label for="restFilterLunch">Lunch
								<input id="restFilterLunch" name="lunch" value="Lunch" type="checkbox" class="">
							</label>
						</li>
						<li>
							<label for="restFilterDinner">Dinner
								<input id="restFilterDinner" name="dinner" value="Dinner" type="checkbox" class="">
							</label>
						</li>
					</ul>
					<button class="popupOk smallButton okButton" type="button">Ok</button>
				</div>
			</div>

			<!-- This Element for Logged In Users Only -->
			<div id="chooseAddress" class="menuPopup radioMenu">
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
						<button id="addNewAddress" class="bigButton buttonCenter popupButton" type="button">New Address</button>
					</ul>
				</div>
			</div>

			<div id="addressInputFields" class="menuPopup">
				<div class="popupBox clearfix">
					<h5>Enter Address:</h5>
					<ul class="inputItems">
						<li class="inputBox">
							<input id="addressLineInput" name="addressLine" type="text" class="inputField" placeholder="Address Line">
						</li>
						<li class="inputBox">
							<input id="cityInput" name="city" type="text" class="inputField" placeholder="City">
						</li>
						<li class="inputBox">
							<input id="zipcodeInput" name="zipcode" type="number" class="inputField" placeholder="Zip Code">
						</li>
						<?php $userLoggedIn = true; if ($userLoggedIn) { ?>
							<li class="inputBox">
								<input id="nicknameInput" name="nickname" type="text" class="inputField" placeholder="Nickname (optional)">
							</li>
						<?php } ?>
						<?php $userLoggedIn = true; if ($userLoggedIn) { ?>
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

			<div id="loginPopup" class="menuPopup">
				<div class="popupBox clearfix">
					<h5>Login:</h5>
					<ul class="inputItems">
						<li class="inputBox">
							<input id="emailLogin" name="emailLogin" type="text" class="inputField" placeholder="Email">
						</li>
						<li class="inputBox">
							<input id="passwordLogin" name="passwordLogin" type="password" class="inputField" placeholder="Password">
						</li>
						<li class="reverseLeftCheckbox">
							<label id="autoLogin" for="autoLoginInput">Automatically Log Me In
								<input id="autoLoginInput" name="autoLogin" type="checkbox">
							</label>
						</li>
					</ul>

					<p id="forgotPasswordButton" class="afterLink popupButton">Forgot Password?</p>

					<button class="popupCancel smallButton cancelButton" type="button">Cancel</button>
					<button class="popupOk smallButton okButton" type="button">Ok</button>
					<button id="signupButton" class="bigButton buttonCenter" type="button">Sign Up</button>

				</div>
			</div>

			<div id="forgotPassword" class="menuPopup">
				<div class="popupBox clearfix">
					<h5>Request Reset Email:</h5>
					<ul class="inputItems">
						<li class="inputBox">
							<input id="emailRetrieval" name="emailRetrieval" type="email" class="inputField" placeholder="Email">
						</li>
					</ul>
					<button class="popupCancel smallButton cancelButton" type="button">Cancel</button>
					<button class="popupOk smallButton okButton" type="button">Ok</button>
				</div>
			</div>

			<!-- Hold Previous Form Field Values Inbetween Ok or Cancel Actions -->
			<input id="nicknameHold" name="nicknameHold" type="hidden">
			<input id="addressLineHold" name="addressLineHold" type="hidden">
			<input id="cityHold" name="cityHold" type="hidden">
			<input id="zipcodeHold" name="zipcodeHold" type="hidden">

			<button id="loginButton" class="existingUser actionButton" type="button">Login</button>
			<button id="searchRestaurants" class="actionButton actionRequired" type="submit">Find Restraunts</button>
		
        </form>
        
	</div>
<!-- ************************************************************************************* -->

<?php include 'includes/footer.php'; ?>
