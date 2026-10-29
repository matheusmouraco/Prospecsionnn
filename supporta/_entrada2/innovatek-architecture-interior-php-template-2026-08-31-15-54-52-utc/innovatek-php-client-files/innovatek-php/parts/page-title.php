<!-- Start main-content -->
<section class="page-title" style="background-image: url(assets/images/background/page-title-bg.jpg);">
    <div class="auto-container">
        <div class="title-outer text-center position-relative">
            <h1 class="title"><?php if(isset($page_title)&&!empty($page_title)) { echo $page_title; } ?></h1>
            <ul class="page-breadcrumb">
                <li><a href="index.php">Home</a></li>
                <li><?php if(isset($page_sub_title)&&!empty($page_sub_title)) { echo $page_sub_title; } ?></li>
            </ul>
        </div>
    </div>
</section>
<!-- end main-content -->