<?php 
$head_title="Innovatek - Architecture & Interior PHP Template | Home Dark Three";
$dark_mode=true;
$dark_logo_url="assets/images/logo/logo-light.png";
$sticky_logo_url="assets/images/logo/logo-light.png";
?>

<?php require_once('parts/header/header3-dark.php'); ?>
<?php

require_once('parts/home3-dark/banner.php');
require_once('parts/home3/service.php');
require_once('parts/home3-dark/marquee.php');
require_once('parts/home3/project.php');
require_once('parts/home3-dark/fun-fact.php');
require_once('parts/home3/team.php');
require_once('parts/home3-dark/contact.php');
require_once('parts/home3/news.php');

?>
<?php
$new_footer_logo_url = "assets/images/logo/logo-light.png";
?>
<?php require_once('parts/footer/footer3-dark.php'); ?>