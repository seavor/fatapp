<?php
session_start();
$pageTitle = 'Add to Order';
$pageClass = 'item';
include 'includes/meta.php';
?>

<?php

$data = json_decode(file_get_contents($dbRoot.'restaurant_details?rid=' . $_SESSION['rid']), true);

foreach ($data['menu'] as $categoryIter) {
	foreach ($categoryIter['children'] as $itemIter) {
		if($itemIter['id'] == $_GET['iid']) {
			$item = $itemIter;
			break 2;
		}
	}
}

?>

<!-- ************************************************************************************* -->
	<div id="appContent">
        
		<?php include 'includes/header.php'; ?>

		<form id="itemOptions" name="itemOptions" action="menu.php?rid=<?php echo $_SESSION['rid']; ?>" method="post">

			<div class="menuItem menuHead">
				<h6><?php echo $item['name']; ?></h6>
				<p class="itemPrice">$<?php echo $item['price']; ?></p>
				<p class="itemDescription"><?php echo $item['descrip']; ?></p>
				<p class="error itemError"></p>
			</div>

			<?php if( $item['children'] ) {?>

				<div id="userChoices" class="itemOptionsBox">
					<h3>Been good lately? Treat yourself:</h3>


	<!--   *************************************************************************************************** -->

				<?php
					$i = 0;
					while ($item['children'][$i]) {
						$isRadio = ( $item['children'][$i]['min_child_select'] == 1 &&  $item['children'][$i]['max_child_select'] == 1);
						$isRequired = ($item['children'][$i]['min_child_select'] > 0); ?>

						<div data-option="opt<?php echo $item['children'][$i]['id']; ?>" class="itemOptions popupButton">
							<h4>
								<?php echo $item['children'][$i]['name']; ?>
								<?php if($isRequired) { echo '<span class="required">*</span>'; } ?>
							</h4>
							<p class="itemOptionSelections"><!-- @TODO insert selected choices --></p>
						</div>
						<div data-popup="opt<?php echo $item['children'][$i]['id']; ?>" class="popupMenu <?php if($isRadio) { echo 'radioMenu'; }?>">
							<div class="popupBox clearfix <?php if($isRequired) { echo 'mustChoose'; } ?>">
								<h5><?php echo $item['children'][$i]['name']; ?></h5>
								<p class="error"></p>
								<ul class="<?php if($isRadio) { echo 'dataItems'; } else { echo 'popupItems'; } ?>">
									<?php foreach ($item['children'][$i]['children'] as $option) { ?>
										<li>
											<label for="_<?php echo $option['id']; ?>">
												<span class="name"><?php echo $option['name']; ?></span>
												<input
													id="_<?php echo $option['id']; ?>"
													name="<?php echo $item['children'][$i]['id']; ?>"
													value="<?php echo $option['id']; ?>"
													type="<?php if($isRadio) { echo 'radio'; } else { echo 'checkbox'; }?>"
													class=""
													data-price="<?php echo $option['price']; ?>"
												>
												<p class="popupItemPrice">($<?php echo $option['price']; ?>)</p>
											</label>
										</li>
									<?php } ?>
								</ul>
								<?php if(!$isRadio) {
									echo '<button class="popupOk smallButton okButton itemButton" type="button" data-min="'.
									$item['children'][$i]['min_child_select'].'" data-max="'.$item['children'][$i]['max_child_select'].
									'">Ok</button>';
								}?>
							</div>
						</div>

				<?php $i++; } ?>

	<!--   *************************************************************************************************** -->
				</div>

			<?php } ?>

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
					<p id="itemBasePrice">$<?php echo $item['price']; ?></p>
				</div>
				<div class="itemPriceInfo">
					<h6>Extras</h6>
					<p id="itemExtraPrice">$0.00</p> <!-- @TODO: update via jquery when option modal closes -->
				</div>
				<div class="itemPriceInfo">
					<h6>Total</h6>
					<p id="itemTotalPrice">$<?php echo $item['price']; ?></p><!-- @TODO: update via jquery when option modal closes -->
				</div>
			</div>

			<!-- @TODO Hidden Item Option Form Fields -->
			<input id="itemAdded" name="itemAdded" type="hidden" value="<?php echo $item['id']; ?>">

			<button id="addToOrder" class="actionButton" type="button">Add to Order</button>

		</form>
	
	</div>
<!-- ************************************************************************************* -->

<?php include 'includes/footer.php'; ?>