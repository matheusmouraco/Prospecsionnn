<?php 
$head_title="Innovatek - Architecture & Interior PHP Template | Home Page 03 RTL";
?>

<?php
  $rtl_mode=true;
  $body_class="rtl";
?>

<?php require_once('parts/header/header3.php'); ?>
<?php

require_once('parts/home3-rtl/banner.php');
require_once('parts/home3-rtl/service.php');
require_once('parts/home3-rtl/marquee.php');
require_once('parts/home3-rtl/project.php');
require_once('parts/home3-rtl/fun-fact.php');
require_once('parts/home3-rtl/team.php');
require_once('parts/home3-rtl/contact.php');
require_once('parts/home3-rtl/news.php');

?>
<?php
$new_footer_logo_url = "assets/images/logo/logo-light.png";
?>
<?php require_once('parts/footer/footer3.php'); ?>