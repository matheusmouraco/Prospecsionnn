<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php echo $head_title;?></title>
<!-- Favicon img -->
<link rel="shortcut icon" href="assets/images/favicon.png" type="image/x-icon">
<link rel="icon" href="assets/images/favicon.png" type="image/x-icon">
<!-- Bootstarp min css -->
<link rel="stylesheet" href="assets/css/bootstrap.min.css">
<!-- Mean menu css -->
<link rel="stylesheet" href="assets/css/meanmenu.css">
<!-- All min css -->
<link rel="stylesheet" href="assets/css/all.min.css">
<!-- Swiper bundle min css -->
<link rel="stylesheet" href="assets/css/swiper-bundle.min.css">
<!-- Magnigic popup css -->
<link rel="stylesheet" href="assets/css/magnific-popup.css">
<!-- Animate css -->
<link rel="stylesheet" href="assets/css/animate.css">
<!-- Splitting css -->
<link rel="stylesheet" href="assets/css/splitting.css">
<!-- Nice select css -->
<link rel="stylesheet" href="assets/css/nice-select.css">

<!-- Style css -->
<link rel="stylesheet" href="assets/css/style.css">
</head>

<body
<?php if(isset($body_class)&&!empty($body_class)) {?>
class="<?php echo $body_class;?>"
<?php }?>
<?php if(isset($body_bg_image)&&!empty($body_bg_image)) {?>
data-tm-bg-img="<?php echo $body_bg_image;?>"
<?php }?>
>