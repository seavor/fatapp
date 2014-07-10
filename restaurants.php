<?php
$pageTitle = 'Restaurants';
$pageClass = 'restSearchPage';
include 'includes/meta.php';
?>

<?php

$data = json_decode(file_get_contents('http://eric-song.com:8000/delivery_list?datetime=ASAP&addr=378%20Greenwich%20St&city=New%20York&zip=10013'), true);
echo '<pre>';
print_r();
echo '</pre>';
?>

<!-- ************************************************************************************* -->
	<div id="appContent">
        
		<?php include 'includes/header.php'; ?>

		<h2 id="restFilterButton" class="subHeader popupButton" data-button="restFilterButton">Menu Filter: All Menus</h2>
		
		<div id="restFilters" class="popupMenu" data-popup="restFilterButton">
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

			<?php $i = 0; while ($data[$i] && $data['is_delivering'] == 1) { ?>

				<div class="restaurantListingItem" data-rid="<?php echo $data[$i]['id']; ?>">
					<div class="topBox clearfix">
						<h5><?php echo $data[$i]['na']; ?></h5>
						<p class="distanceAway">0.3m</p>
					</div>
					<div class="bottomBox clearfix">
						<div class="feeWrapper">
							<p>Minimum Order: $<?php echo $data[$i]['mino']; ?></p>
							<p>Delivery Fee: $x.00</p>
						</div>
						<div class="appleRating">
							<?php
								$apple = $data[$i]['rating'];
								switch ($apple) {
									case 1: $ratingx = 0; $ratingy = 0; $ratingz = 1; break;
									case 2: $ratingx = 0; $ratingy = 1; $ratingz = 1; break;
									case 3: $ratingx = 1; $ratingy = 1; $ratingz = 1; break;
									default: $ratingx = 0; $ratingy = 0; $ratingz = 0; break;
								}
							?>
							<div class="appleWrapper">
								<img src="images/apple<?php echo $ratingx; ?>.png">
								<img src="images/apple<?php echo $ratingy; ?>.png">
								<img src="images/apple<?php echo $ratingz; ?>.png">
							</div>
						</div>
					</div>
				</div>

			<?php $i++; } ?>

		</div>

		<div id="closedRestaurants" class="restListing">
			<h6>Closed</h6>

			<?php $i = 0; while ($data[$i] && $data['is_delivering'] == 0) { ?>

				<div class="restaurantListingItem" data-rid="<?php echo $data[$i]['id']; ?>">
					<div class="topBox clearfix">
						<h5><?php echo $data[$i]['na']; ?></h5>
						<p class="distanceAway">0.3m</p>
					</div>
					<div class="bottomBox clearfix">
						<div class="feeWrapper">
							<p>Minimum Order: $<?php echo $data[$i]['mino']; ?></p>
							<p>Delivery Fee: $x.00</p>
						</div>
						<div class="appleRating">
							<?php
								$apple = $data[$i]['rating'];
								switch ($apple) {
									case 1: $ratingx = 0; $ratingy = 0; $ratingz = 1; break;
									case 2: $ratingx = 0; $ratingy = 1; $ratingz = 1; break;
									case 3: $ratingx = 1; $ratingy = 1; $ratingz = 1; break;
									default: $ratingx = 0; $ratingy = 0; $ratingz = 0; break;
								}
							?>
							<div class="appleWrapper">
								<img src="images/apple<?php echo $ratingx; ?>.png">
								<img src="images/apple<?php echo $ratingy; ?>.png">
								<img src="images/apple<?php echo $ratingz; ?>.png">
							</div>
						</div>
					</div>
				</div>

			<?php $i++; } ?>

		</div>






	</div>
<!-- ************************************************************************************* -->

<?php include 'includes/footer.php'; ?>
