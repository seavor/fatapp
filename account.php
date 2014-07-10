<?php
$pageTitle = 'My Account';
$pageClass = 'account';
include 'includes/meta.php';
?>

<!-- ************************************************************************************* -->
	<div id="appContent">
        
		<?php include 'includes/header.php'; ?>

		<div class="itemReview clearfix">
			<h6 id="manageAddresses">Manage Addresses</h6>
		</div>

		<div class="itemReview clearfix">
			<h6 id="manageCards">Manage Cards</h6>
		</div>

		<h5 class="headerDivide">Personal Settings</h5>

		<div class="itemReview clearfix" data-popupbutton="editName">
			<h6>Name: Jay Cardiello</h6>
		</div>

			<div class="popupMenu" data-popup="editName">
				<div class="popupBox clearfix">
					<h5>Edit Name:</h5>
					<div class="inputBox singleItem">
						<input id="editName" name="editName" type="text" class="inputField" placeholder="{existing name}">
					</div>
					<button class="popupCancel smallButton cancelButton" type="button">Cancel</button>
					<button class="popupOk smallButton okButton" type="button">Ok</button>
				</div>
			</div>

		<div class="itemReview clearfix" data-popupbutton="editEmail">
			<h6>Email: jay@cardiello.com</h6>
		</div>

			<div class="popupMenu" data-popup="editEmail">
				<div class="popupBox clearfix">
					<h5>Edit Email:</h5>
					<div class="inputBox singleItem">
						<input id="editEmail" name="editEmail" type="email" class="inputField" placeholder="{existing email}">
					</div>
					<button class="popupCancel smallButton cancelButton" type="button">Cancel</button>
					<button class="popupOk smallButton okButton" type="button">Ok</button>
				</div>
			</div>

		<div class="itemReview clearfix" data-popupbutton="editPhone">
			<h6>Phone: (347) 555-1234</h6>
		</div>

			<div class="popupMenu" data-popup="editPhone">
				<div class="popupBox clearfix">
					<h5>Edit Phone:</h5>
					<div class="inputBox singleItem">
						<input id="editPhone" name="editPhone" type="number" class="inputField" placeholder="{existing phone}">
					</div>
					<button class="popupCancel smallButton cancelButton" type="button">Cancel</button>
					<button class="popupOk smallButton okButton" type="button">Ok</button>
				</div>
			</div>

	</div>
<!-- ************************************************************************************* -->

<?php include 'includes/footer.php'; ?>
