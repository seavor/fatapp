<?php
$pageTitle = 'Restaurant Menu';
$pageClass = 'menu';
include 'includes/meta.php';
?>

<script type="text/javascript" src="js/menuLoad.js"></script>

<!-- ************************************************************************************* -->
	<div id="appContent">
        
		<?php include 'includes/header.php'; ?>

			<div id="menuContent">

				<div id="menuHeader" class="restaurantListingItem">
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

				<div id='menuTip' class="healthTips">
					<h4>Jay's Tips</h4>
					<p>
						This restaurant is loaded with fats and sugars, and as well as carbs
						from the pancakes and toast. With restaurant like this, you want to hold
						the butter and go as light as possible with the syrup on the pancakes.
						If possible, ask for your eggs to be poached as opposed to fried or scrambled.
					</p>
				</div>

				<div id="menuCategories">
					<div class="catPanel">
						<h3 id="catAppetizers">Appetizers</h3>
						<div class="catItems">
							<div class="healthTips">
								<p>
									Food like this has a lot of red-flag ingredients. When picking items from this
									category, be careful to avoid this, that and the third. It’s best to do this
									and another thing.
								</p>
							</div>
							<div class="menuItem itemBest">
								<h6>Farmer's Breakfast</h6>
								<p class="itemPrice">$6.99</p>
								<p class="itemDescription">
									2 eggs (sunny-side up or scrambled), hash browns, whole-wheat biscuit and orange juice
								</p>
							</div>
							<div class="menuItem itemGood">
								<h6>Loaded Pancake Breakfast</h6>
								<p class="itemPrice">$10.99</p>
								<p class="itemDescription">
									2 extra-thick buttermilk pancakes, served with 2 eggs (sunny-side up or scrambled),
									buttered toast, coffee and orange juice
								</p>
							</div>
							<div class="menuItem itemBetter">
								<h6>Breakfast on the Go</h6>
								<p class="itemPrice">$8.99</p>
								<p class="itemDescription">
									Bacon, egg and cheese on a whole-wheat biscuit, hash browns and coffee
								</p>
							</div>
						</div>
					</div>
					<div class="catPanel">
						<h3 id="catEntrees">Entrees</h3>
						<div class="catItems">
							<div class="healthTips">
								<p>
									Food like this has a lot of red-flag ingredients. When picking items from this
									category, be careful to avoid this, that and the third. It’s best to do this
									and another thing.
								</p>
							</div>
							<div class="menuItem itemBest">
								<h6>Farmer's Breakfast</h6>
								<p class="itemPrice">$6.99</p>
								<p class="itemDescription">
									2 eggs (sunny-side up or scrambled), hash browns, whole-wheat biscuit and orange juice
								</p>
							</div>
							<div class="menuItem itemGood">
								<h6>Loaded Pancake Breakfast</h6>
								<p class="itemPrice">$10.99</p>
								<p class="itemDescription">
									2 extra-thick buttermilk pancakes, served with 2 eggs (sunny-side up or scrambled),
									buttered toast, coffee and orange juice
								</p>
							</div>
							<div class="menuItem itemBetter">
								<h6>Breakfast on the Go</h6>
								<p class="itemPrice">$8.99</p>
								<p class="itemDescription">
									Bacon, egg and cheese on a whole-wheat biscuit, hash browns and coffee
								</p>
							</div>
						</div>
					</div>
					<div class="catPanel">
						<h3 id="catSides">Sides</h3>
						<div class="catItems">
							<div class="healthTips">
								<p>
									Food like this has a lot of red-flag ingredients. When picking items from this
									category, be careful to avoid this, that and the third. It’s best to do this
									and another thing.
								</p>
							</div>
							<div class="menuItem itemBest">
								<h6>Farmer's Breakfast</h6>
								<p class="itemPrice">$6.99</p>
								<p class="itemDescription">
									2 eggs (sunny-side up or scrambled), hash browns, whole-wheat biscuit and orange juice
								</p>
							</div>
							<div class="menuItem itemGood">
								<h6>Loaded Pancake Breakfast</h6>
								<p class="itemPrice">$10.99</p>
								<p class="itemDescription">
									2 extra-thick buttermilk pancakes, served with 2 eggs (sunny-side up or scrambled),
									buttered toast, coffee and orange juice
								</p>
							</div>
							<div class="menuItem itemBetter">
								<h6>Breakfast on the Go</h6>
								<p class="itemPrice">$8.99</p>
								<p class="itemDescription">
									Bacon, egg and cheese on a whole-wheat biscuit, hash browns and coffee
								</p>
							</div>
						</div>
					</div>
					<div class="catPanel">
						<h3 id="catDrinks">Drinks</h3>
						<div class="catItems">
							<div class="healthTips">
								<p>
									Food like this has a lot of red-flag ingredients. When picking items from this
									category, be careful to avoid this, that and the third. It’s best to do this
									and another thing.
								</p>
							</div>
							<div class="menuItem itemBest">
								<h6>Farmer's Breakfast</h6>
								<p class="itemPrice">$6.99</p>
								<p class="itemDescription">
									2 eggs (sunny-side up or scrambled), hash browns, whole-wheat biscuit and orange juice
								</p>
							</div>
							<div class="menuItem itemGood">
								<h6>Loaded Pancake Breakfast</h6>
								<p class="itemPrice">$10.99</p>
								<p class="itemDescription">
									2 extra-thick buttermilk pancakes, served with 2 eggs (sunny-side up or scrambled),
									buttered toast, coffee and orange juice
								</p>
							</div>
							<div class="menuItem itemBetter">
								<h6>Breakfast on the Go</h6>
								<p class="itemPrice">$8.99</p>
								<p class="itemDescription">
									Bacon, egg and cheese on a whole-wheat biscuit, hash browns and coffee
								</p>
							</div>
						</div>
					</div>
				</div>

				<p class="hidden" id="tray"></p>



				<!-- Show only once item has been added to order -->
				<?php
					if ($_GET['order']=='add') { ?>
					<button id="reviewOrder" class="actionButton" type="button">Review Your Order</button>
				<?php } ?>

		</div>
	</div>
<!-- ************************************************************************************* -->

<?php include 'includes/footer.php'; ?>
