<?php
$pageTitle = 'Add to Order';
$pageClass = 'item';
include 'includes/meta.php';
?>

<!-- ************************************************************************************* -->
	<div id="appContent">
        
		<?php include 'includes/header.php'; ?>

		<form id="itemOptions" name="itemOptions" action="menu.php" method="post">

			<div class="menuItem menuHead">
				<h6>Farmer's Breakfast</h6>
				<p class="itemPrice">$6.99</p>
				<p class="itemDescription">
					2 eggs (sunny-side up or scrambled), hash browns, whole-wheat biscuit and orange juice
				</p>
			</div>

			<div id="jaysChoices" class="itemOptionsBox">
				<h3>Jay's Choices:</h3>
				<div data-option="optEggs" class="itemOptions">
					<h4>Eggs</h4>
					<p class="itemOptionSelections">Scrambled</p>
					<div class="optionChosen"><!-- bg img --></div>
				</div>
				<div data-option="optPancakes" class="itemOptions">
					<h4>Pancakes</h4>
					<div class="optionChosen"><!-- bg img --></div>
				</div>
			</div>

			<div id="userChoices" class="itemOptionsBox">
				<h3>Been good lately? Treat yourself:</h3>
				<div data-option="optEggs" class="itemOptions popupButton">
					<h4>Eggs</h4>
					<p class="itemOptionSelections">Scrambled</p>
				</div>
				<div data-popup="optEggs" class="popupMenu radioMenu">
					<div class="popupBox clearfix">
						<h5>Eggs Options:</h5>
						<ul class="dataItems">
							<li>
								<label for="_scrambled">Scrambled
									<input id="_scrambled" name="eggOption" value="scrambled" type="radio" class="">
								</label>
							</li>
							<li>
								<label for="_sunnySideUp">Sunny-Side Up
									<input id="_sunnySideUp" name="eggOption" value="sunnySideUp" type="radio" class="">
								</label>
							</li>
		                </ul>
					</div>
				</div>
				<div data-option="optPancakes" class="itemOptions popupButton">
					<h4>Pancakes</h4>
				</div>
				<div data-popup="optPancakes" class="popupMenu">
					<div class="popupBox clearfix">
						<h5>Pancakes Options:</h5>
						<ul class="popupItems">
							<li>
								<label for="restFilterAll">Strawberries
									<input id="restFilterAll" name="all" value="All Menus" type="checkbox" class="">
									<p class="popupItemPrice">($2.00)</p>
								</label>
							</li>
							<li>
								<label for="restFilterBrunch">Blueberries
									<input id="restFilterBrunch" name="brunch" value="Brunch" type="checkbox" class="">
									<p class="popupItemPrice">($2.00)</p>
								</label>
							</li>
							<li>
								<label for="restFilterLunch">Chocolate Syrup
									<input id="restFilterLunch" name="lunch" value="Lunch" type="checkbox" class="">
									<p class="popupItemPrice">($3.00)</p>
								</label>
							</li>
						</ul>
						<button class="popupOk smallButton okButton" type="button">Ok</button>
					</div>
				</div>
			</div>

			<div id="itemQuantity" class="popupMenu">
				<div class="popupBox clearfix">
					<h5>Enter Quantity:</h5>
					<div class="inputBox">
						<select class="selectNumber inputField" name="itemQuantity">
							<option value="1" default>1</option>
						    <?php for ($i = 2; $i <= 10; $i++) { ?>
						        <option value="<?php echo $i; ?>"><?php echo $i; ?></option>
						    <?php } ?>
						</select>
					</div>
					<button class="popupCancel smallButton cancelButton" type="button">Cancel</button>
					<button for="itemOptions" class="popupOk smallButton okButton" type="submit">Ok</button>
				</div>
			</div>

			<div id="orderItemTotal" class="actionInfo">
				<div class="itemPriceInfo">
					<h6>Item Price</h6>
					<p>$6.99</p>
				</div>
				<div class="itemPriceInfo">
					<h6>Extras</h6>
					<p>$0.00</p>
				</div>
				<div class="itemPriceInfo">
					<h6>Total</h6>
					<p>$6.99</p>
				</div>
			</div>

			<!-- @TODO Hidden Item Option Form Fields -->

			<button id="addToOrder" class="actionButton popupButton" type="button">Add to Order</button>

		</form>
	
	</div>
<!-- ************************************************************************************* -->

<?php include 'includes/footer.php'; ?>