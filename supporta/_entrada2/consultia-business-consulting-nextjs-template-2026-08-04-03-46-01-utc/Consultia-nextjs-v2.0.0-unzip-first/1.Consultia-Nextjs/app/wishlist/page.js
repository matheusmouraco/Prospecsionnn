
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import QuantityInput from "@/components/elements/QuantityInput"

export default function Page() {

    return (
        <>

            <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="Wishlist">
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
                                                <tr className="cart-product-list">
                                                    <td className="cart-prodct cart-product-img">
                                                        <img src="/assets/img/products/product-1.jpg" alt="" />
                                                    </td>
                                                    <td>
                                                        <div className="cart-prodct">
                                                            <div className="cart-product-details">
                                                                <ul className="reviews">
                                                                    <li><i className="fa-solid fa-star" /></li>
                                                                    <li><i className="fa-solid fa-star" /></li>
                                                                    <li><i className="fa-solid fa-star" /></li>
                                                                    <li><i className="fa-solid fa-star" /></li>
                                                                    <li><i className="fa-solid fa-star" /></li>
                                                                </ul>
                                                                <p>Anchor Bracelet Mens</p>
                                                                <Link href="#">Remove</Link>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="cart-price">$15.99</td>
                                                    <td>
                                                        <QuantityInput />
                                                    </td>
                                                    <td className="cart-price">$15.99</td>
                                                </tr>
                                                <tr className="cart-product-list">
                                                    <td className="cart-prodct cart-product-img">
                                                        <img src="/assets/img/products/product-2.jpg" alt="" />
                                                    </td>
                                                    <td>
                                                        <div className="cart-prodct">
                                                            <div className="cart-product-details">
                                                                <ul className="reviews">
                                                                    <li><i className="fa-solid fa-star" /></li>
                                                                    <li><i className="fa-solid fa-star" /></li>
                                                                    <li><i className="fa-solid fa-star" /></li>
                                                                    <li><i className="fa-solid fa-star" /></li>
                                                                    <li><i className="fa-solid fa-star" /></li>
                                                                </ul>
                                                                <p>Anchor Bracelet Mens</p>
                                                                <Link href="#">Remove</Link>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="cart-price">$15.99</td>
                                                    <td>
                                                        <QuantityInput />
                                                    </td>
                                                    <td className="cart-price">$15.99</td>
                                                </tr>
                                            </tbody>
                                        </table>
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