import AboutUs from "@/app/(customer)/landing/AboutUs";
import Contact from "@/app/(customer)/landing/Contact";
import Destination from "@/app/(customer)/landing/Destination";
import Intro from "@/app/(customer)/landing/Intro";
import Navbar from "@/app/(customer)/landing/Navbar";
import Package from "@/app/(customer)/landing/Package";
import Footer from "@/app/(customer)/landing/Footer";
import Filter from "@/app/(customer)/landing/filter";
import TabNavigation from "@/app/(customer)/landing/TabNavigation";
import RoleGuard from "@/components/auth/RoleGuard";

export default function Dashboard() {
  return (
    <RoleGuard allowedRoles={["customer"]}>
      <Navbar />
      <TabNavigation />
      {/* <Intro /> */}
      <Filter />
      <Destination />
      <Package />
      <AboutUs />
      {/* <Contact /> */}
      <Footer />
    </RoleGuard>
  );
}
