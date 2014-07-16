<html ng-app="app">

	<head>

		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="description" content="Eat Healthy, Be Healthy">
		<title>Fat App</title>
		<link rel="icon" href="images/header/favicon.png" sizes="16x16" type="image/png">
		<link rel="stylesheet" type="text/css" href="css/normalize.min.css" />
		<link rel="stylesheet" type="text/css" href="css/style.css" />
		<script type="text/javascript" src="js/angular.min.js"></script>
		<script type="text/javascript" src="js/angular-route.min.js"></script>
		<script type="text/javascript" src="js/jquery-1.8.3.min.js"></script>
		<script type="text/javascript" src="js/main.js"></script>

			<!--[if lt IE 9]>
				<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
			<! [endif]-->

			<!--[if !IE 7]>
				<style type="text/css">
					#wrap {display:table;height:100%}
				</style>
			<![endif]-->

	</head>

<body ng-controller='appCtrl'>

<!-- ************************************************************************************* -->
<!-- HEADER -->
<!-- ************************************************************************************* -->

	<div id="appHeader" >

		<div id="homeButton"></div>

		<div id="pageHeading">
			<h1>{{pageTitle}}</h1>
		</div>

		<div id="navButton">
			<img src="images/menu.png">
		</div>

		<div id="navItems" class="slideMenu">
			<ul>
				<li>
					<a href="account.php">My Account</a>
				</li>
			</ul>
		</div>

	</div>

<!-- ************************************************************************************* -->
<!-- MAIN CONTENT -->
<!-- ************************************************************************************* -->

	<div id="appContent" ng-view>

		
	</div>

<!-- ************************************************************************************* -->
<!-- SCRIPTS -->
<!-- ************************************************************************************* -->

</body>
</html>
