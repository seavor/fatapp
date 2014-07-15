<?php
session_start();
$pageTitle = 'Restaurant Menu';
$pageClass = 'menu';
include 'includes/meta.php';
?>

<?php

// @TODO Escape GET Str
$_SESSION['rid'] = $_GET['rid'];

$data = json_decode(file_get_contents($dbRoot.'restaurant_details?rid=' . $_SESSION['rid']), true);
// printR($_POST);

if ($_GET['clearTray']) {
	$_SESSION['tray'] = '';
}

// Identify Item Added to Tray
if ($_POST['itemAdded']) {
	$_SESSION['tray'] .= '+' . $_POST['itemAdded'] . '/' . $_POST['itemQuantity'];
}

// Remove Leading '+' from tray object
if (strpos($_SESSION['tray'], '+') == 0) {
	$_SESSION['tray'] = substr($_SESSION['tray'], 1);
}

// Add Options for new Item
foreach ($_POST as $key => $value) {
	// Filter for Numeric values (option IDs)
	if(ctype_digit($key)) {
		if (is_array($value)) {
			// Loop thru Array and Add options
			foreach ($value as $option) {
				$_SESSION['tray'] .= ',' . $option;
			}
			// Add nan-array/single-variable options
		} else {
			$_SESSION['tray'] .= ',' . $value;
		}
	}
}

echo $_SESSION['tray'];

printR($_POST);

?>

<!-- Load Active Restaurant ID into Javascript -->
<script type="text/javascript">var rid = "<?php echo $_SESSION['rid']; ?>";</script>

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
							<p>Minimum Order: $<?php echo $_SESSION['activeRestMino']; ?></p>
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
				<?php foreach ($data['menu'] as $catID => $value) { ?>
					<div id="menuCategories">
						<div class="catPanel">
							<h3><?php echo $value['name'] ?></h3>
							<div class="catItems">
								<div class="healthTips">
									<p><?php echo $value['tip'] ?></p>
								</div>

								<!-- Display each Category's Menu Item -->
								<?php foreach ($value['children'] as $itemID => $items) { ?>
									<div class="menuItem itemBest" data-iid="<?php echo $items['id']; ?>">
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
					if (!empty($_SESSION['tray'])) { ?>
					<button id="reviewOrder" class="actionButton" type="button" data-redirect="review.php">Review Your Order</button>
				<?php } ?>

		</div>
	</div>
<!-- ************************************************************************************* -->

<?php include 'includes/footer.php'; ?>
