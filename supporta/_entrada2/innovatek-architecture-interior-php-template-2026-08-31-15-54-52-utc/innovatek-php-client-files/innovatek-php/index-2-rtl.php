<?php 
$head_title="Innovatek - Architecture & Interior PHP Template | Home Page 02 RTL";
?>

<?php
  $rtl_mode=true;
  $body_class="rtl";
?>

<?php require_once('parts/header/header2.php'); ?>
<?php

require_once('parts/home2-rtl/banner.php');
require_once('parts/home2-rtl/feature.php');
require_once('parts/home2-rtl/project.php');
require_once('parts/home2-rtl/about.php');
require_once('parts/home2-rtl/why-choose-us.php');
require_once('parts/home2-rtl/experience.php');
require_once('parts/home2-rtl/contact.php');
require_once('parts/home2-rtl/news.php');

?>
<?php
$new_footer_logo_url = "assets/images/logo/logo-light.png";
?>
<?php require_once('parts/footer/footer2.php'); ?>