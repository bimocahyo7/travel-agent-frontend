import AboutUs from "@/components/landing/AboutUs";
import Destination from "@/components/landing/Destination";
import Intro from "@/components/landing/Intro";
import Navbar from "@/components/landing/Navbar";
import Package from "@/components/landing/Package";
import Footer from "@/components/landing/Footer";
import Filter from "@/components/landing/TravelRequestForm";
import TabNavigation from "@/components/landing/TabNavigation";

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <Intro />
      {/* <TabNavigation /> */}
      <Destination />
      <Filter />
      <Package />
      <AboutUs />
      <Footer />
    </div>
  );
}
