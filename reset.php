<?php
$pageTitle = 'Reset Password';
$pageClass = 'reset';
include 'includes/meta.php';
?>

<!-- ************************************************************************************* -->
	<div id="appContent">

		<?php include 'includes/header.php'; ?>
		
		<div id="newPasswordBox" class="screenItems">

			<h2 class="screenHeader">Reset Password</h2>

			<div class="screenBox clearfix">
				<ul class="screenItems">
					<li class="inputBox">
						<input id="newPassword" name="newPassword" type="password" class="inputField" placeholder="New Password">
					</li>
				</ul>
			</div>
		</div>

		<button id="resetConfirm" class="smallButton itemCenter" type="button">Reset</button>

	</div>
<!-- ************************************************************************************* -->

<?php include 'includes/footer.php'; ?>