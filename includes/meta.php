<!-- ******************************************* -->
	<?php $siteRoot = "http://jay.craftinc.co/cardiello/"; ?>
<!-- ******************************************* -->
<html>

	<head>

		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="description" content="">
		<meta name="author" content="Jeremy Letto">
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

	<!-- Simulate LoggedIn Status -->
	<?php
		$userLoggedIn = true;
		$logStatus = 'off';
	?>

	<div id="user" class="hidden"><?php echo $logStatus ?></div>
	<div id="pageClass" class="hidden"><?php echo $pageClass ?></div>