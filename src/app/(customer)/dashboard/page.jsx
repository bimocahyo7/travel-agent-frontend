import AboutUs from "@/app/(customer)/landing/AboutUs";
import Contact from "@/app/(customer)/landing/Contact";
import Destination from "@/app/(customer)/landing/Destination";
import Intro from "@/app/(customer)/landing/Intro";
import Navbar from "@/app/(customer)/landing/Navbar";
import Package from "@/app/(customer)/landing/Package";
import Footer from "@/app/(customer)/landing/Footer";
import Filter from "@/app/(customer)/landing/TravelRequestForm";
import TabNavigation from "@/app/(customer)/landing/TabNavigation";
import RoleGuard from "@/components/auth/RoleGuard";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div>
    <RoleGuard allowedRoles={["customer"]}>
      <Navbar />
      <Intro /> 
      {/* <TabNavigation /> */}
      <Destination />
      <Filter />
      <Package />
      <AboutUs />
      {/* <Contact /> */}
      <Footer />
      <Link href="/pengajuan" className="text-blue-600 underline">Kelola Pengajuan</Link>
    </RoleGuard>
    </div>
  );
}
