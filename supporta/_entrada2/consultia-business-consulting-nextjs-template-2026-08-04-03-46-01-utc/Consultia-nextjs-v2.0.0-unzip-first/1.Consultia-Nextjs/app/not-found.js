import Layout from "@/components/layout/Layout";

export default function NotFound() {
    return (
        <>
            <Layout>
                <div>
                    <div className="error-page section-padding bg-13">
                        <div className="space100" />
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 m-auto">
                                    <div className="404 text-center">
                                        <img src="/assets/img/error/404.svg" alt="404" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 m-auto">
                                    <div className="space50" />
                                    <div className="text-center">
                                        <div className="heading2 no-margin-heading">
                                            <h2>Page not found!</h2>
                                            <p>Sorry, the page you are looking for doesn’t exist or has been moved. Here are some helpful links.</p>
                                            <div className="space30" />
                                            <a className="theme-btn-11" href="#">
                                                Take me home
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*=====404 end=======*/}
                    {/*=====Subscribe start=======*/}
                    <div className="subscribe-4 bg12 padding-90 inner-font-1 inner-subscribe">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <div className="heading4 white-heading inner-heading no-margin-heading">
                                        <h2>Want to join our team?</h2>
                                        <p>We are always looking for talented people, We here to help you to open your bright future.</p>
                                    </div>
                                </div>
                                <div className="col-lg-5 col-md-6 offset-lg-1">
                                    <div className="sunscribe-form">
                                        <div className="subscribe-from-wrap">
                                            <form action="#">
                                                <input type="email" placeholder="Email Address" />
                                                <button type="submit" name="button">
                                                    Subscribe Now
                                                    <img src="/assets/img/icons/arrow-up-right.svg" alt="arrow-up-right" />
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
    );
}
