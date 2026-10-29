
import Link from "next/link"
export default function Page() {

    return (
        <>

            <div className="sign-form-area bg-13">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-8 m-auto">
                            <div className="sign-form-wrap">
                                <div className="sign-logo text-center">
                                    <Link href="/"><img src="/assets/img/logo/site-logo-6.svg" alt="" /></Link>
                                </div>
                                <div className="sign-form">
                                    <div className="form-heading">
                                        <h3>Forgot Password?</h3>
                                        <p>Enter your email address to receive a reset link</p>
                                    </div>
                                    <form action="#">
                                        <label htmlFor="email">EMAIL </label>
                                        <input type="email" name="email" id="email" placeholder="Enter Your Email" />
                                        <button type="submit" className="theme-btn-11 full-btn">
                                            Reset Password
                                        </button>
                                    </form>
                                    <div className="space20" />
                                    <h4>Remember Password? <Link href="/signup">Login Now</Link></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}