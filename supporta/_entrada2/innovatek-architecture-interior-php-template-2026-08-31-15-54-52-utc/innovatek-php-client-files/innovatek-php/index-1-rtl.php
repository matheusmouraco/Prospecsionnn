<?php 
$head_title="Innovatek - Architecture & Interior PHP Template | Home Page 01 RTL";
?>

<?php
  $rtl_mode=true;
  $body_class="rtl";
?>
<?php require_once('parts/header/header.php'); ?>

<?php

require_once('parts/home1-rtl/banner.php');
require_once('parts/home1-rtl/about.php');
require_once('parts/home1-rtl/project.php');
require_once('parts/home1-rtl/why-choose-us.php');
require_once('parts/home1-rtl/testimonial.php');
require_once('parts/home1-rtl/fun-fact.php');
require_once('parts/home1-rtl/marquee.php');
require_once('parts/home1-rtl/clients.php');
require_once('parts/home1-rtl/contact.php');
require_once('parts/home1-rtl/news.php');

?>
<?php
$new_footer_logo_url = "assets/images/logo/logo.png";
?>
<?php require_once('parts/footer/footer.php'); ?>