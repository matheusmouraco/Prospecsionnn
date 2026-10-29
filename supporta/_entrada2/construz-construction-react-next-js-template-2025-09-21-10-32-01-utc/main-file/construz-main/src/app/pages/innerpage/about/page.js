import AboutThree from "~/sections/About/AboutThree";
import BlogThree from "~/sections/About/BlogThree";
import Breadcumb from "~/sections/About/Breadcumb";
import ClientThree from "~/sections/About/ClientThree";
import PortfolioThree from "~/sections/About/PortfolioThree";
import ProcessThree from "~/sections/About/ProcessThree";
import TeamThree from "~/sections/About/TeamThree/TeamThree";
import WhyChooseThree from "~/sections/About/WhyChooseThree";
import HeaderOne from "~/sections/Common/Header/HeaderOne";
import FooterTwo from "~/sections/Common/Footer/FooterTwo";
import CounterThree from "~/sections/Common/Counter/CounterThree";
import TestimonialThree from "~/sections/Common/Testimonial/TestimonialThree";
import Scroll from "~/sections/Common/Scroll";
import Portfolio from "~/sections/Home-1/Portfolio";
export default function AboutPage() {
  return (
    <>
      <HeaderOne />
      <Breadcumb />
      <AboutThree />
      <WhyChooseThree />
      <ProcessThree />
      <Portfolio />
      <CounterThree />
      <TestimonialThree />
      <TeamThree />
      <ClientThree />
      <BlogThree />
      <FooterTwo />
      <Scroll />
    </>
  );
}
