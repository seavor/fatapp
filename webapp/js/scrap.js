<div id="closedRestaurants" class="restListing">
		<h6>Closed</h6>

		<!-- ng-repeat -->
		<div class="restaurantListingItem" data-rid="{{rid}}">
			<div class="topBox clearfix">
				<h5>{{name}}</h5>
				<p class="distanceAway">{{distance}}</p>
			</div>
			<div class="bottomBox clearfix">
				<div class="feeWrapper">
					<p>Minimum Order: ${{mino}}}</p>
					<p>{{cuisines}}</p>
				</div>
				<div class="appleRating">
					<div class="appleWrapper">
						<img src="images/apple{{ratingx}}.png">
						<img src="images/apple{{ratingy}}.png">
						<img src="images/apple{{ratingz}}.png">
					</div>
				</div>
			</div>
		</div>

	</div>