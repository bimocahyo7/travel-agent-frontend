import AboutUs from "@/components/landing/AboutUs";
import Contact from "@/components/landing/Contact";
import Destination from "@/components/landing/Destination";
import Intro from "@/components/landing/Intro";
import Navbar from "@/components/landing/Navbar";
import Package from "@/components/landing/Package";
import Footer from "@/components/landing/Footer";
import Filter from "@/components/landing/filter";
import TabNavigation from "@/components/landing/TabNavigation";
export default function Home() {
  return (
    <>
      <Navbar />
      <Intro />
      {/* <TabNavigation /> */}
      <Destination />
      <Filter />
      <Package />
      <AboutUs />
      {/* <Contact /> */}
      <Footer />
    </>
  );
}
