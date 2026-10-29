
import Layout from "@/components/layout/Layout"
export default function Page() {

    return (
        <>

            <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="CART">
                <div>
                    <div className="section-padding cart-area">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="cart-items">
                                        <table className="table table-borderless">
                                            <tbody>
                                                <tr className="cart-head">
                                                    <th className="first-th" />
                                                    <th className="table-product">Product</th>
                                                    <th className="table-price">Price</th>
                                                    <th className="table-quantity">Quantity</th>
                                                    <th className="table-subtotal">Subtotal</th>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <h4 className="empty-cart-text">Your shopping cart is empty.</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="space40" />
                            <div className="row justify-content-end">
                                <div className="col-lg-3">
                                    <div className="subtotal-price">
                                        <ul className="subtotal-price-list">
                                            <li>Subtotal <span>$0</span></li>
                                            <li>Shipping <span>$0</span></li>
                                            <li>Total <span>$0</span></li>
                                        </ul>
                                        <button className="theme-btn-11 full-btn">Checkout</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*=====Cart end=======*/}
                    {/*=====Subscribe start=======*/}
                    <div className="subscribe-4 bg12 padding-90 inner-font-1 inner-subscribe">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <div className="heading4 white-heading inner-heading no-margin-heading">
                                        <h2>Want to join our team?</h2>
                                        <p>
                                            We are always looking for talented people, We here to help you
                                            to open your bright future.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-lg-5 col-md-6 offset-lg-1">
                                    <div className="sunscribe-form">
                                        <div className="subscribe-from-wrap">
                                            <form action="#">
                                                <input type="email" placeholder="Email Address" />
                                                <button type="submit" name="button">
                                                    Subscribe Now
                                                    <img src="/assets/img/icons/arrow-up-right.svg" alt="" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </Layout>
        </>
    )
}