<!-- ******************************************* -->
	<?php

		include 'includes/functions.php';

		$_SESSION['previous'] = basename($_SERVER['HTTP_REFERER']);
		$userLoggedIn = $_SESSION['userLoggedIn'] = false; # No Users for this Version

		$siteRoot = "http://localhost:8888/";
		$dbRoot = 'http://162.243.27.144:8000/';

	?>

	<script type="text/javascript">
		var siteRoot = "<?php echo $siteRoot; ?>";
		var userLoggedIn = "<?php echo $userLoggedIn; ?>";
		var pageClass = "<?php echo $pageClass; ?>";
	</script>
<!-- ******************************************* -->
<html>

	<head>

		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="description" content="Eat Healthy, Be Healthy">
		<title>Fat App | <?php echo $pageTitle; ?></title>
		<link rel="icon" href="<?php echo $siteRoot; ?>/images/header/favicon.png" sizes="16x16" type="image/png">
		<link rel="stylesheet" type="text/css" href="<?php echo $siteRoot; ?>/css/normalize.min.css" />
		<link rel="stylesheet" type="text/css" href="<?php echo $siteRoot; ?>/css/style.css" />
		<script type="text/javascript" src="<?php echo $siteRoot; ?>/js/jquery-1.8.3.min.js"></script>
		<script type="text/javascript" src="<?php echo $siteRoot; ?>/js/jquery.js"></script>
		<script type="text/javascript" src="<?php echo $siteRoot; ?>/js/pol.js"></script>

			<!--[if lt IE 9]>
				<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
			<! [endif]-->

			<!--[if !IE 7]>
				<style type="text/css">
					#wrap {display:table;height:100%}
				</style>
			<![endif]-->

	</head>
			
	<body class="<?php echo $pageClass; ?>">