"use client";

import { useState } from "react";
import PackageForm from "@/app/(customer)/landing/layanan/PackageForm";
import HotelForm from "@/app/(customer)/landing/layanan/HotelForm";
import CarForm from "@/app/(customer)/landing/layanan/CarForm";
import { Button } from "@/components/ui/button";
import { Hotel, Car, Gift } from "lucide-react";

export default function TabNavigation() {
    const [activeTab, setActiveTab] = useState("packages");

    const renderTabContent = () => {
        switch (activeTab) {
            case "packages":
                return <PackageForm />;
            case "hotels":
                return <HotelForm />;
            case "cars":
                return <CarForm />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 pt-16"> {/* pt-16 untuk navbar */}

            {/* Tombol Tab: sekarang di atas */}
            <div className="bg-white border-b shadow-md p-3 flex justify-around sticky top-16 z-40">
                <Button
                    variant={activeTab === "packages" ? "default" : "ghost"}
                    onClick={() => setActiveTab("packages")}
                    className="flex flex-col items-center gap-1"
                >
                    <Gift size={20} />
                    <span className="text-xs">Packages</span>
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
