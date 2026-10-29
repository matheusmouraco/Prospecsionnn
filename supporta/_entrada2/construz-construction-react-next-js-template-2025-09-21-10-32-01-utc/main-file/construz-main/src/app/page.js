import Banner from "~/sections/Home/Banner";
import Counter from "~/sections/Home/Counter";
import Demo from "~/sections/Home/Demo";
import DemoTwo from "~/sections/Home/DemoTwo";
import Footer from "~/sections/Home/Footer";
import Header from "~/sections/Home/Header";
import Inner from "~/sections/Home/Inner";
import InnerTwo from "~/sections/Home/InnerTwo";

import "~/public/landing-assets/css/animate.css";
import "~/public/landing-assets/css/font-awesome.min.css";
import "~/public/landing-assets/css/mfp.min.css";
import "~/public/landing-assets/css/bootstrap.min.css";
import "~/public/landing-assets/css/style.css";
import "~/public/main-assets/css/react-adjustment.css";

export default function HomePage() {
  return (
    <div style={{ overflow: 'hidden' }}>
      <Header />
      <Banner />
      <Counter />
      <Demo />
      <Inner />
      <DemoTwo />
      <InnerTwo />
      <Footer />
    </div>
  );
}
