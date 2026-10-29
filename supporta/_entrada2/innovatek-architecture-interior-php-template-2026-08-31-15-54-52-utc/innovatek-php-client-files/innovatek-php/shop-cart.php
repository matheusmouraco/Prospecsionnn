<?php $head_title="Innovatek - Architecture & Interior PHP Template | Cart Page"; ?>

<?php require_once('parts/header/inner-header.php'); ?>

<?php
$page_title = "Cart";
$page_sub_title = "Cart";
require_once('parts/page-title.php');
?>

<!--cart Start-->
<section>
    <div class="container pb-100">
        <div class="team-five__wrp">
            <div class="section-content">
                <div class="row">
                    <div class="col-md-12">
                        <div class="table-responsive">
                <table class="table table-striped table-bordered tbl-shopping-cart">
                    <thead>
                    <tr>
                        <th></th>
                        <th>Photo</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="cart_item">
                        <td class="product-remove"><a title="Remove this item" class="remove" href="#">×</a></td>
                        <td class="product-thumbnail"><a href="#"><img alt="product" src="assets/images/resource/products/1.jpg"></a></td>
                        <td class="product-name"><a href="shop-product-details.php">Winter Black Jacket</a>
                        <ul class="variation">
                            <li class="variation-size">Size: <span>Medium</span></li>
                        </ul></td>
                        <td class="product-price"><span class="amount">$36.00</span></td>
                        <td class="product-quantity">
                            <div class="product-details__quantity">
                                <div class="quantity-box">
                                    <button type="button" class="sub"><i class="fa fa-minus"></i></button>
                                    <input type="number" id="1" value="1" />
                                    <button type="button" class="add"><i class="fa fa-plus"></i></button>
                                </div>
                            </div>
                        </td>
                        <td class="product-subtotal"><span class="amount">$36.00</span></td>
                    </tr>
                    <tr class="cart_item">
                        <td class="product-remove"><a title="Remove this item" class="remove" href="#">×</a></td>
                        <td class="product-thumbnail"><a href="#"><img alt="product" src="assets/images/resource/products/2.jpg"></a></td>
                        <td class="product-name"><a href="shop-product-details.php">Swan Crop V-Neck Tee</a>
                        <ul class="variation">
                            <li class="variation-size">Size: <span>Small</span></li>
                        </ul></td>
                        <td class="product-price"><span class="amount">$115.00</span></td>
                        <td class="product-quantity">
                            <div class="product-details__quantity">
                                <div class="quantity-box">
                                    <button type="button" class="sub"><i class="fa fa-minus"></i></button>
                                    <input type="number" id="1" value="1" />
                                    <button type="button" class="add"><i class="fa fa-plus"></i></button>
                                </div>
                            </div>
                        </td>
                        <td class="product-subtotal"><span class="amount">$115.00</span></td>
                    </tr>
                    <tr class="cart_item">
                        <td class="product-remove"><a title="Remove this item" class="remove" href="#">×</a></td>
                        <td class="product-thumbnail"><a href="#"><img alt="product" src="assets/images/resource/products/3.jpg"></a></td>
                        <td class="product-name"><a href="shop-product-details.php">Blue Solid Casual Shirt</a>
                        <ul class="variation">
                            <li class="variation-size">Size: <span>Large</span></li>
                        </ul></td>
                        <td class="product-price"><span class="amount">$68.00</span></td>
                        <td class="product-quantity">
                            <div class="product-details__quantity">
                                <div class="quantity-box">
                                    <button type="button" class="sub"><i class="fa fa-minus"></i></button>
                                    <input type="number" id="1" value="1" />
                                    <button type="button" class="add"><i class="fa fa-plus"></i></button>
                                </div>
                            </div>
                        </td>
                        <td class="product-subtotal"><span class="amount">$68.00</span></td>
                    </tr>
                    <tr class="cart_item">
                        <td colspan="3">
                        <form class="row g-3 coupon-form">
                            <div class="col-auto">
                            <input type="text" name="coupon_code" class="input-text form-control mr-1" id="coupon_code" value="" placeholder="Coupon code">
                            </div>
                            <div class="col-auto">
                            <button type="submit" class="apply-button" name="apply_coupon" value="Apply Coupon"><span class="btn-title">Apply Coupon</span></button>
                            </div>
                        </form>
                        </td>
                        <td colspan="2">&nbsp;</td>
                        <td><button type="button" class="theme-btn btn-two"><span class="btn-title text-white">Update Cart</span></button></td>
                    </tr>
                    </tbody>
                </table>
                        </div>
                    </div>
                    <div class="col-md-12 mt-30">
                        <div class="row">
                <div class="col-md-5">
                    <h4>Calculate Shipping</h4>
                    <form class="form" action="#">
                    <div class="mb-10">
                        <select class="form-control">
                        <option>Select Country</option>
                        <option>Australia</option>
                        <option>UK</option>
                        <option>USA</option>
                        </select>
                    </div>
                    <div class="mb-10">
                        <input type="text" class="form-control" placeholder="State/country" value="">
                    </div>
                    <div class="mb-10">
                        <input type="text" class="form-control" placeholder="Postcod/zip" value="">
                    </div>
                    <div class="mb-30">
                        <button type="button" class="theme-btn btn-two"><span class="btn-title text-white">Update Totals</span></button>
                    </div>
                    </form>
                </div>
                <div class="col-md-2">
                </div>
                <div class="col-md-5">
                    <h4>Cart Totals</h4>
                    <table class="table table-bordered cart-total">
                    <tbody>
                        <tr>
                        <td>Cart Subtotal</td>
                        <td>$180.00</td>
                        </tr>
                        <tr>
                        <td>Shipping and Handling</td>
                        <td>$70.00</td>
                        </tr>
                        <tr>
                        <td>Order Total</td>
                        <td>$250.00</td>
                        </tr>
                    </tbody>
                    </table>
                    <a class="theme-btn btn-two" href="shop-checkout.php"><span class="btn-title text-white">Proceed to Checkout</span> </a> </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!--cart Start-->

<?php
$new_footer_logo_url = "assets/images/logo/logo-light.png";
?>
<?php require_once('parts/footer/inner-footer.php'); ?>