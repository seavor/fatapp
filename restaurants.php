<?php
$pageTitle = 'Restaurants';
$pageClass = 'restSearchPage';
include 'includes/meta.php';
?>

<!-- ************************************************************************************* -->
	<div id="appContent">
        
		<?php include 'includes/header.php'; ?>

		<h2 id="restFilterButton" class="subHeader popupButton" data-popupbutton="restFilterButton">Menu Filter: All Menus</h2>
		
		<div id="restFilters" class="menuPopup" data-popup="restFilterButton">
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

		<div id="openRestaurants" class="restListing">

			<h6>Open &amp; Delivering</h6>

				<div class="viewRestrauntClick restaurantListingItem" data-rid="23865">
					<div class="topBox clearfix">
						<h5>Salaam Bombay</h5>
						<p class="distanceAway">0.3m</p>
					</div>
					<div class="bottomBox clearfix">
						<div class="feeWrapper">
							<p>Minimum Order: $10.00</p>
							<p>Delivery Fee: $0.00</p>
						</div>
						<div class="appleRating">
							<?php
								$apple = 2;
								switch ($apple) {
									case 1: $applex = 0; $appley = 0; $applez = 1; break;
									case 2: $applex = 0; $appley = 1; $applez = 1; break;
									case 3: $applex = 1; $appley = 1; $applez = 1; break;
									default: $applex = 0; $appley = 0; $applez = 0; break;
								}
							?>
							<div class="appleWrapper">
								<img src="images/apple<?php echo $applex; ?>.png">
								<img src="images/apple<?php echo $appley; ?>.png">
								<img src="images/apple<?php echo $applez; ?>.png">
							</div>
						</div>
					</div>
				</div>
				<div class="viewRestrauntClick restaurantListingItem">
					<div class="topBox clearfix">
						<h5>Restaurant Name</h5>
						<p class="distanceAway">0.3m</p>
					</div>
					<div class="bottomBox clearfix">
						<div class="feeWrapper">
							<p>Minimum Order: $10.00</p>
							<p>Delivery Fee: $0.00</p>
						</div>
						<div class="appleRating">
							<?php
								$apple = 1;
								switch ($apple) {
									case 1: $applex = 0; $appley = 0; $applez = 1; break;
									case 2: $applex = 0; $appley = 1; $applez = 1; break;
									case 3: $applex = 1; $appley = 1; $applez = 1; break;
									default: $applex = 0; $appley = 0; $applez = 0; break;
								}
							?>
							<div class="appleWrapper">
								<img src="images/apple<?php echo $applex; ?>.png">
								<img src="images/apple<?php echo $appley; ?>.png">
								<img src="images/apple<?php echo $applez; ?>.png">
							</div>
						</div>
					</div>
				</div>

				<div class="viewRestrauntClick restaurantListingItem">
					<div class="topBox clearfix">
						<h5>Restaurant Name</h5>
						<p class="distanceAway">0.3m</p>
					</div>
					<div class="bottomBox clearfix">
						<div class="feeWrapper">
							<p>Minimum Order: $10.00</p>
							<p>Delivery Fee: $0.00</p>
						</div>
						<div class="appleRating">
							<?php
								$apple = 3;
								switch ($apple) {
									case 1: $applex = 0; $appley = 0; $applez = 1; break;
									case 2: $applex = 0; $appley = 1; $applez = 1; break;
									case 3: $applex = 1; $appley = 1; $applez = 1; break;
									default: $applex = 0; $appley = 0; $applez = 0; break;
								}
							?>
							<div class="appleWrapper">
								<img src="images/apple<?php echo $applex; ?>.png">
								<img src="images/apple<?php echo $appley; ?>.png">
								<img src="images/apple<?php echo $applez; ?>.png">
							</div>
						</div>
					</div>
				</div>

			</div>

			<div id="closedRestaurants" class="restListing">
				<h6>Closed</h6>

				<div class="viewRestrauntClick restaurantListingItem">
					<div class="topBox clearfix">
						<h5>Restaurant Name</h5>
						<p class="distanceAway">0.3m</p>
					</div>
					<div class="bottomBox clearfix">
						<div class="feeWrapper">
							<p>Minimum Order: $10.00</p>
							<p>Delivery Fee: $0.00</p>
						</div>
						<div class="appleRating">
							<?php
								$apple = 1;
								switch ($apple) {
									case 1: $applex = 0; $appley = 0; $applez = 1; break;
									case 2: $applex = 0; $appley = 1; $applez = 1; break;
									case 3: $applex = 1; $appley = 1; $applez = 1; break;
									default: $applex = 0; $appley = 0; $applez = 0; break;
								}
							?>
							<div class="appleWrapper">
								<img src="images/apple<?php echo $applex; ?>.png">
								<img src="images/apple<?php echo $appley; ?>.png">
								<img src="images/apple<?php echo $applez; ?>.png">
							</div>
						</div>
					</div>
				</div>

				<div class="viewRestrauntClick restaurantListingItem">
					<div class="topBox clearfix">
						<h5>Restaurant Name</h5>
						<p class="distanceAway">0.3m</p>
					</div>
					<div class="bottomBox clearfix">
						<div class="feeWrapper">
							<p>Minimum Order: $10.00</p>
							<p>Delivery Fee: $0.00</p>
						</div>
						<div class="appleRating">
							<?php
								$apple = 2;
								switch ($apple) {
									case 1: $applex = 0; $appley = 0; $applez = 1; break;
									case 2: $applex = 0; $appley = 1; $applez = 1; break;
									case 3: $applex = 1; $appley = 1; $applez = 1; break;
									default: $applex = 0; $appley = 0; $applez = 0; break;
								}
							?>
							<div class="appleWrapper">
								<img src="images/apple<?php echo $applex; ?>.png">
								<img src="images/apple<?php echo $appley; ?>.png">
								<img src="images/apple<?php echo $applez; ?>.png">
							</div>
						</div>
					</div>
				</div>

				<div class="viewRestrauntClick restaurantListingItem">
					<div class="topBox clearfix">
						<h5>Restaurant Name</h5>
						<p class="distanceAway">0.3m</p>
					</div>
					<div class="bottomBox clearfix">
						<div class="feeWrapper">
							<p>Minimum Order: $10.00</p>
							<p>Delivery Fee: $0.00</p>
						</div>
						<div class="appleRating">
							<?php
								$apple = 3;
								switch ($apple) {
									case 1: $applex = 0; $appley = 0; $applez = 1; break;
									case 2: $applex = 0; $appley = 1; $applez = 1; break;
									case 3: $applex = 1; $appley = 1; $applez = 1; break;
									default: $applex = 0; $appley = 0; $applez = 0; break;
								}
							?>
							<div class="appleWrapper">
								<img src="images/apple<?php echo $applex; ?>.png">
								<img src="images/apple<?php echo $appley; ?>.png">
								<img src="images/apple<?php echo $applez; ?>.png">
							</div>
						</div>
					</div>
				</div>









		</div>








	</div>
<!-- ************************************************************************************* -->

<?php include 'includes/footer.php'; ?>
