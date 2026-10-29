<?php $head_title="Innovatek - Architecture & Interior PHP Template | Shop Page"; ?>

<?php require_once('parts/header/inner-header.php'); ?>

<?php
$page_title = "Shop";
$page_sub_title = "Products";
require_once('parts/page-title.php');
?>

<!-- Featured Products -->
<section class="featured-products overflow-hidden pt-0 mt-80">
    <div class="auto-container">
        <div class="team-five__wrp">
            <div class="row clearfix">
                <div class="col-lg-3 col-sm-12 px-3">
                    <div class="shop-sidebar">
                        <div class="sidebar-search">
                            <form action="shop-products.php" method="post" class="search-form">
                                <div class="form-group">
                                    <input type="search" name="search-field" placeholder="Search..." required="">
                                    <button><i class="far fa-search"></i></button>
                                </div>
                            </form>
                        </div>
                        <div class="sidebar-widget category-widget">
                            <div class="widget-title">
                                <h5 class="widget-title">Categories</h5>
                            </div>
                            <div class="widget-content">
                                <ul class="category-list clearfix">
                                    <li><a href="shop-product-details.php">Corporate Law</a></li>
                                    <li><a href="shop-product-details.php">Criminal Law</a></li>
                                    <li><a href="shop-product-details.php">Family Lawyer</a></li>
                                    <li><a href="shop-product-details.php">House Lawyer</a></li>
                                    <li><a href="shop-product-details.php">International Law</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="sidebar-widget price-filters">
                            <div class="widget-title">
                                <h5 class="widget-title">Filter by Price</h5>
                            </div>
                            <div class="range-slider clearfix">
                                <div class="price-range-slider"></div>
                                <div class="clearfix">
                                    <p>Price:</p>
                                    <div class="title"></div>
                                    <div class="input"><input type="text" class="property-amount" name="field-name" readonly></div>
                                    <input type="submit" value="Filter">
                                </div>
                            </div>
                        </div>
                        <div class="sidebar-widget post-widget">
                            <div class="widget-title">
                                <h5 class="widget-title">Popular Products</h5>
                            </div>
                            <div class="post-inner">
                                <div class="post">
                                    <figure class="post-thumb"><a href="shop-details.php"><img src="assets/images/resource/products/thumb-1.jpg" alt=""></a></figure>
                                    <a href="shop-product-details.php">Best Headset</a>
                                    <span class="price">$45.00</span>
                                </div>
                                <div class="post">
                                    <figure class="post-thumb"><a href="shop-details.php"><img src="assets/images/resource/products/thumb-2.jpg" alt=""></a></figure>
                                    <a href="shop-product-details.php">Quality Battery</a>
                                    <span class="price">$34.00</span>
                                </div>
                                <div class="post">
                                    <figure class="post-thumb"><a href="shop-details.php"><img src="assets/images/resource/products/thumb-3.jpg" alt=""></a></figure>
                                    <a href="shop-product-details.php">Smart Watch</a>
                                    <span class="price">$29.00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-9 col-sm-12 px-3 content-side">
                    <!--MixitUp Galery-->
                    <div class="mixitup-gallery mt-5 mt-lg-0">
                        <!--Filter-->
                        <div class="filters clearfix">
                            <ul class="filter-tabs filter-btns clearfix">
                                <li class="active filter" data-role="button" data-filter="all">All</li>
                                <li class="filter" data-role="button" data-filter=".dairy">Cyber</li>
                                <li class="filter" data-role="button" data-filter=".pantry">Digital</li>
                                <li class="filter" data-role="button" data-filter=".meat">Software</li>
                                <li class="filter" data-role="button" data-filter=".fruit">Technology</li>
                                <li class="filter" data-role="button" data-filter=".vagetables">Development</li>
                            </ul>
                        </div>

                        <div class="filter-list row">
                            <!--Product Block-->
                            <div class="product-block all mix pantry fruit col-lg-4 col-md-6 col-sm-12">
                                <div class="inner-box">
                                    <div class="image"><a href="shop-product-details.php"><img class="w-100" src="assets/images/resource/products/1.jpg" alt=""></a></div>
                                    <div class="content">
                                        <h4><a href="shop-product-details.php">Show Piece</a></h4>
                                        <span class="price">$32.00</span>
                                        <span class="rating"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></span>
                                    </div>
                                    <div class="icon-box">
                                        <a href="shop-product-details.php" class="ui-btn like-btn"><i class="fa fa-heart"></i></a>
                                        <a href="shop-cart.php" class="ui-btn add-to-cart"><i class="fa fa-shopping-cart"></i></a>
                                    </div>
                                </div>
                            </div>

                            <!--Product Block-->
                            <div class="product-block all mix dairy meat fruit col-lg-4 col-md-6 col-sm-12">
                                <div class="inner-box">
                                    <div class="image"><a href="shop-product-details.php"><img class="w-100" src="assets/images/resource/products/2.jpg" alt=""></a></div>
                                    <div class="content">
                                        <h4><a href="shop-product-details.php">Leather Belt</a></h4>
                                        <span class="price">$52.00</span>
                                        <span class="rating"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></span>
                                    </div>
                                    <div class="icon-box">
                                        <a href="shop-product-details.php" class="ui-btn like-btn"><i class="fa fa-heart"></i></a>
                                        <a href="shop-cart.php" class="ui-btn add-to-cart"><i class="fa fa-shopping-cart"></i></a>
                                    </div>
                                </div>
                            </div>

                            <!--Product Block-->
                            <div class="product-block all mix pantry fruit vagetables col-lg-4 col-md-6 col-sm-12">
                                <div class="inner-box">
                                    <div class="image"><a href="shop-product-details.php"><img class="w-100" src="assets/images/resource/products/3.jpg" alt=""></a></div>
                                    <div class="content">
                                        <h4><a href="shop-product-details.php">Sunglasses</a></h4>
                                        <span class="price">$43.00</span>
                                        <span class="rating"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></span>
                                    </div>
                                    <div class="icon-box">
                                        <a href="shop-product-details.php" class="ui-btn like-btn"><i class="fa fa-heart"></i></a>
                                        <a href="shop-cart.php" class="ui-btn add-to-cart"><i class="fa fa-shopping-cart"></i></a>
                                    </div>
                                </div>
                            </div>

                            <!--Product Block-->
                            <div class="product-block all mix dairy meat vagetables col-lg-4 col-md-6 col-sm-12">
                                <div class="inner-box">
                                    <div class="image"><a href="shop-product-details.php"><img class="w-100" src="assets/images/resource/products/4.jpg" alt=""></a></div>
                                    <div class="content">
                                        <h4><a href="shop-product-details.php">Backpack</a></h4>
                                        <span class="price">$22.00</span>
                                        <span class="rating"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></span>
                                    </div>
                                    <div class="icon-box">
                                        <a href="shop-product-details.php" class="ui-btn like-btn"><i class="fa fa-heart"></i></a>
                                        <a href="shop-cart.php" class="ui-btn add-to-cart"><i class="fa fa-shopping-cart"></i></a>
                                    </div>
                                </div>
                            </div>

                            <!--Product Block-->
                            <div class="product-block all mix pantry meat fruit col-lg-4 col-md-6 col-sm-12">
                                <div class="inner-box">
                                    <div class="image"><a href="shop-product-details.php"><img class="w-100" src="assets/images/resource/products/5.jpg" alt=""></a></div>
                                    <div class="content">
                                        <h4><a href="shop-product-details.php">Hand Watch</a></h4>
                                        <span class="price">$34.00</span>
                                        <span class="rating"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></span>
                                    </div>
                                    <div class="icon-box">
                                        <a href="shop-product-details.php" class="ui-btn like-btn"><i class="fa fa-heart"></i></a>
                                        <a href="shop-cart.php" class="ui-btn add-to-cart"><i class="fa fa-shopping-cart"></i></a>
                                    </div>
                                </div>
                            </div>

                            <!--Product Block-->
                            <div class="product-block all mix dairy pantry col-lg-4 col-md-6 col-sm-12">
                                <div class="inner-box">
                                    <div class="image"><a href="shop-product-details.php"><img class="w-100" src="assets/images/resource/products/6.jpg" alt=""></a></div>
                                    <div class="content">
                                        <h4><a href="shop-product-details.php">Party Bag</a></h4>
                                        <span class="price">$52.00</span>
                                        <span class="rating"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></span>
                                    </div>
                                    <div class="icon-box">
                                        <a href="shop-product-details.php" class="ui-btn like-btn"><i class="fa fa-heart"></i></a>
                                        <a href="shop-cart.php" class="ui-btn add-to-cart"><i class="fa fa-shopping-cart"></i></a>
                                    </div>
                                </div>
                            </div>

                            <!--Product Block-->
                            <div class="product-block all mix fruit vagetables col-lg-4 col-md-6 col-sm-12">
                                <div class="inner-box">
                                    <div class="image"><a href="shop-product-details.php"><img class="w-100" src="assets/images/resource/products/7.jpg" alt=""></a></div>
                                    <div class="content">
                                        <h4><a href="shop-product-details.php">Coffee Mug</a></h4>
                                        <span class="price">$25.00</span>
                                        <span class="rating"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></span>
                                    </div>
                                    <div class="icon-box">
                                        <a href="shop-product-details.php" class="ui-btn like-btn"><i class="fa fa-heart"></i></a>
                                        <a href="shop-cart.php" class="ui-btn add-to-cart"><i class="fa fa-shopping-cart"></i></a>
                                    </div>
                                </div>
                            </div>

                            <!--Product Block-->
                            <div class="product-block all mix dairy pantry meat vagetables col-lg-4 col-md-6 col-sm-12">
                                <div class="inner-box">
                                    <div class="image"><a href="shop-product-details.php"><img class="w-100" src="assets/images/resource/products/8.jpg" alt=""></a></div>
                                    <div class="content">
                                        <h4><a href="shop-product-details.php">Smart Watch</a></h4>
                                        <span class="price">$30.00</span>
                                        <span class="rating"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></span>
                                    </div>
                                    <div class="icon-box">
                                        <a href="shop-product-details.php" class="ui-btn like-btn"><i class="fa fa-heart"></i></a>
                                        <a href="shop-cart.php" class="ui-btn add-to-cart"><i class="fa fa-shopping-cart"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- End Featured Products -->

<?php
$new_footer_logo_url = "assets/images/logo/logo-light.png";
?>
<?php require_once('parts/footer/inner-footer.php'); ?>