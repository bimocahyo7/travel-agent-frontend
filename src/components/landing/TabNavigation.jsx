"use client";

import { useState } from "react";
import HotelForm from "@/components/landing/layanan/HotelForm";
import CarForm from "@/components/landing/layanan/CarForm";
import { Button } from "@/components/ui/button";
import { Plane, Hotel, Car } from "lucide-react";
import FlightForm from "@/components/landing/layanan/FlightForm";

export default function TabNavigation() {
  const [activeTab, setActiveTab] = useState("flights");

  const renderTabContent = () => {
    switch (activeTab) {
      case "flights":
        return <FlightForm />;
      case "hotels":
        return <HotelForm />;
      case "cars":
        return <CarForm />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pt-16">
      {" "}
      <div className="bg-white border-b shadow-md p-3 flex justify-around sticky top-16 z-40">
        <Button
          variant={activeTab === "flights" ? "default" : "ghost"}
          onClick={() => setActiveTab("flights")}
          className="flex flex-col items-center gap-1"
        >
          <Plane size={20} />
          <span className="text-xs">Flights</span>
        </Button>
        <Button
          variant={activeTab === "hotels" ? "default" : "ghost"}
          onClick={() => setActiveTab("hotels")}
          className="flex flex-col items-center gap-1"
        >
          <Hotel size={20} />
          <span className="text-xs">Hotels</span>
        </Button>
        <Button
          variant={activeTab === "cars" ? "default" : "ghost"}
          onClick={() => setActiveTab("cars")}
          className="flex flex-col items-center gap-1"
        >
          <Car size={20} />
          <span className="text-xs">Cars</span>
        </Button>
      </div>
      {/* Konten Tab */}
      <main className="flex-grow p-4">{renderTabContent()}</main>
    </div>
  );
}
