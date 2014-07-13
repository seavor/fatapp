<?php
session_start();
$pageTitle = 'Add to Order';
$pageClass = 'item';
include 'includes/meta.php';
?>

<?php

$data = json_decode(file_get_contents($dbRoot.'restaurant_details?rid=' . $_SESSION['rid']), true);
$item = $data['menu'][$_GET['cidx']]['children'][$_GET['iidx']];

printR();

?>

<!-- ************************************************************************************* -->
	<div id="appContent">
        
		<?php include 'includes/header.php'; ?>

		<form id="itemOptions" name="itemOptions" action="menu.php?rid=<?php echo $_SESSION['rid']; ?>" method="post">

			<div class="menuItem menuHead">
				<h6><?php echo $item['name']; ?></h6>
				<p class="itemPrice">$<?php echo $item['price']; ?></p>
				<p class="itemDescription"><?php echo $item['descrip']; ?></p>
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


<!--   *************************************************************************************************** -->

			<?php
				$i = 0;
				while ($item['children'][$i]) {
					$isRadio = ( $item['children'][$i]['min_child_select'] == 1 &&  $item['children'][$i]['max_child_select'] == 1); ?>

					<div data-option="opt<?php echo $item['children'][$i]['id']; ?>" class="itemOptions popupButton">
						<h4>
							<?php echo $item['children'][$i]['name']; ?>
							<?php if($item['children'][$i]['min_child_select'] > 0) { echo '<span class="required">*</span>'; } ?>
						</h4>
						<p class="itemOptionSelections"><!-- @TODO insert selected choices --></p>
					</div>
					<div data-popup="opt<?php echo $item['children'][$i]['id']; ?>" class="popupMenu <?php if($isRadio) { echo 'radioMenu'; }?>">
						<div class="popupBox clearfix">
							<h5><?php echo $item['children'][$i]['name']; ?></h5>
							<p class="required error"></p>
							<ul class="<?php if($isRadio) { echo 'dataItems'; } else { echo 'popupItems'; } ?>">
								<?php foreach ($item['children'][$i]['children'] as $option) { ?>
									<li>
										<label for="_<?php echo $option['id']; ?>"><?php echo $option['name']; ?>
											<input
												id="_<?php echo $option['id']; ?>"
												name="<?php echo $item['children'][$i]['id']; ?>"
												value="<?php echo $option['id']; ?>"
												type="<?php if($isRadio) { echo 'radio'; } else { echo 'checkbox'; }?>"
												class=""
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
					<p>$<?php echo $item['price']; ?></p>
				</div>
				<div class="itemPriceInfo">
					<h6>Extras</h6>
					<p>$x</p> <!-- @TODO: update via jquery when option modal closes -->
				</div>
				<div class="itemPriceInfo">
					<h6>Total</h6>
					<p>$x</p><!-- @TODO: update via jquery when option modal closes -->
				</div>
			</div>

			<!-- @TODO Hidden Item Option Form Fields -->
			<input id="itemAdded" name="itemAdded" type="hidden" value="<?php echo $item['id']; ?>">

			<button id="addToOrder" class="actionButton popupButton" type="button">Add to Order</button>

		</form>
	
	</div>
<!-- ************************************************************************************* -->

<?php include 'includes/footer.php'; ?>