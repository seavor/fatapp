<?php
session_start();
$pageTitle = 'Create Account';
$pageClass = 'prompt';
include 'includes/meta.php';
?>

<!-- ************************************************************************************* -->
	<div id="appContent">

		<?php include 'includes/header.php'; ?>

		<h2 class="screenHeader">
			Create an Account<br>
			and</br>
			Save Your Cards &amp; Addressess
		</h2>
	
		<button id="createAccount" class="mediumButton buttonCenter popupButton" type="button">Yes, Please!</button>
		<button id="skipCreate" class="mediumButton buttonCenter" type="button">No Thanks,<br>Take Me to My Receipt</button>

		<p class="existingUser bottomLink popupButton">Already a member? Sign In</p>
		
		<div id="newAccount" class="popupMenu">
			<div class="popupBox clearfix">
				<h5>Create Account:</h5>
				<ul class="inputItems">
					<li class="inputBox">
						<input id="newName" name="newName" type="text" class="inputField" placeholder="Name">
					</li>
					<li class="inputBox">
						<input id="newEmail" name="newEmail" type="email" class="inputField" placeholder="Email">
					</li>
					<li class="inputBox">
						<input id="newPhone" name="newPhone" type="number" class="inputField" placeholder="Phone Number">
					</li>
					<li class="inputBox">
						<input id="newPassword" name="newPassword" type="password" class="inputField" placeholder="Choose Password">
					</li>
				</ul>
				<button class="popupCancel smallButton cancelButton" type="button">Cancel</button>
				<button class="popupOk smallButton okButton" type="button">Ok</button>
			</div>
		</div>

		<div id="loginPopup" class="popupMenu">
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
			</div>
		</div>

		<div id="forgotPassword" class="popupMenu">
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

	</div>
<!-- ************************************************************************************* -->

<?php include 'includes/footer.php'; ?>