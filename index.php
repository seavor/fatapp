<?php
session_start();
$pageTitle = 'Fat App';
$pageClass = 'home';
include 'includes/meta.php';

?>

<!-- ************************************************************************************* -->
	<div id="appContent">
        
		<?php include 'includes/header.php'; ?>

		<form id="restSearch" name="restSearch" action="restaurants.php" method="post">

			<div class="clearfix">
				<div id="addressField" class="inputBox popupButton" data-button="chooseAddress">
					<input id="addressSearch" name="addressSearch" type="text" class="inputField" placeholder="enter address" required readonly>
				</div>
			</div>

			<button id="restFilterButton" class="bigButton popupButton" type="button" data-button="restFilter">Filter: All Menus</button>

			<div id="dailyFitTip">
				<h3>Cardiello Fit Tip:</h3>
				<p>An apple a day is a played out cliche.</p>
            </div>

			<div id="restFilters" class="popupMenu" data-display="restFilter">
				<div class="popupBox clearfix">
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
			<?php if ($_SESSION['userLoggedIn'] == true) { ?>

				<div id="chooseAddress" class="popupMenu radioMenu" data-popup="restFilter">
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

			<?php } ?>
															<!-- Activate this as chooseAddress popup for Guest users -->
			<div id="addressInputFields" class="popupMenu" <?php if ($_SESSION['userLoggedIn'] == false) { echo 'data-popup="restFilter"'; } ?>>
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
						<!-- Show Save fields for logged in users -->
						<?php if ($_SESSION['userLoggedIn'] == true) { ?>
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

			<!-- Hold Previous Form Field Values Inbetween Ok or Cancel Actions -->
			<input id="nicknameHold" name="nicknameHold" type="hidden">
			<input id="addressLineHold" name="addressLineHold" type="hidden" value="392 Broadway">
			<input id="cityHold" name="cityHold" type="hidden" value="New York">
			<input id="zipcodeHold" name="zipcodeHold" type="hidden" value="10013">

			<!-- <button id="loginButton" class="existingUser actionButton" type="button">Login</button> -->
			<button id="searchRestaurants" class="actionButton actionRequired" type="submit">Find Restraunts</button>
		
        </form>
        
	</div>
<!-- ************************************************************************************* -->

<?php include 'includes/footer.php'; ?>
