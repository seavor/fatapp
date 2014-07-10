<?php
$pageTitle = 'Restaurant Menu';
$pageClass = 'menu';
include 'includes/meta.php';
?>

<?php

$data = json_decode(file_get_contents($dbRoot.'restaurant_details?rid=' . $_GET['rid']), true);

?>



<!-- @TODO Escape GET Str -->
<?php $_SESSION['rid'] = $_GET['rid']; ?>

<script type="text/javascript" src="js/menuLoad.js"></script>

<!-- ************************************************************************************* -->
	<div id="appContent">
        
		<?php include 'includes/header.php'; ?>

			<div id="menuContent">

				<div id="menuHeader" class="restaurantListingItem">
					<div class="topBox clearfix">
						<h5><?php echo $data['name']; ?></h5>
						<p class="distanceAway">0.3m</p>
					</div>
					<div class="bottomBox clearfix">
						<div class="feeWrapper">
							<p>Minimum Order: $1x.00</p>
							<p>Delivery Fee: $x.00</p>
						</div>
						<div class="appleRating">
							<?php
								$rating = $data['rating'];
								switch ($rating) {
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

				<div id='menuTip' class="healthTips">
					<h4>Jay's Tips</h4>
					<p><?php echo $data['tip']; ?></p>
				</div>

				<!-- Display each Category -->
				<?php foreach ($data['menu'] as $value) { ?>
					<div id="menuCategories">
						<div class="catPanel">
							<h3><?php echo $value['name'] ?></h3>
							<div class="catItems">
								<div class="healthTips">
									<p><?php echo $value['tip'] ?></p>
								</div>

								<!-- Display each Category's Menu Item -->
								<?php foreach ($value['children'] as $items) { ?>
									<div class="menuItem itemBest" data-iid='<?php echo $items['id']; ?>'>
										<h6><?php echo $items['name']; ?></h6>
										<p class="itemPrice">$<?php echo $items['price']; ?></p>
										<p class="itemDescription"><?php echo $items['descrip']; ?></p>
									</div>
								<?php } ?>

							</div>
						</div>
					</div>
				<?php } ?>

				<p class="hidden" id="tray"></p>

				<!-- Show only once item has been added to order -->
				<?php
					if ($_GET['order']=='add') { ?>
					<button id="reviewOrder" class="actionButton" type="button" data-redirect="review.php">Review Your Order</button>
				<?php } ?>

		</div>
	</div>
<!-- ************************************************************************************* -->

<?php include 'includes/footer.php'; ?>
