"use client";

import { useDestinations } from "@/hooks/useDestinations";
import { usePackages } from "@/hooks/usePackages";
import { usePengajuan } from "@/hooks/pengajuan";
import { usePaymentsub } from "@/hooks/paymentsub";
import { useInvoices } from "@/hooks/invoice";
import { useVehicle } from "@/hooks/vehicle";
import { MdLocationOn, MdPayments } from "react-icons/md";
import { FaBox, FaFileInvoice, FaCar } from "react-icons/fa";
import { BsClockHistory } from "react-icons/bs";
import { HiArrowPath } from "react-icons/hi2";

export default function DashboardPage() {
  const { destinations } = useDestinations();
  const { packages } = usePackages();
  const { pengajuans } = usePengajuan();
  const { payments } = usePaymentsub();
  const { invoices } = useInvoices();
  const { vehicles } = useVehicle();

  const summaryCards = [
    {
      title: "Total Destinations",
      value: destinations?.length || 0,
      description: "Active travel destinations",
      icon: <MdLocationOn size={24} />,
      color: "bg-blue-50",
      iconColor: "text-blue-500",
      borderColor: "border-blue-200",
    },
    {
      title: "Total Packages",
      value: packages?.length || 0,
      description: "Available travel packages",
      icon: <FaBox size={24} />,
      color: "bg-green-50",
      iconColor: "text-green-500",
      borderColor: "border-green-200",
    },
    {
      title: "Total Vehicles",
      value: vehicles?.length || 0,
      description: "Available vehicles",
      icon: <FaCar size={24} />,
      color: "bg-indigo-50",
      iconColor: "text-indigo-500",
      borderColor: "border-indigo-200",
    },
    {
      title: "Pending Submissions",
      value: pengajuans?.filter((p) => p.status === "pending")?.length || 0,
      description: "Waiting for approval",
      icon: <BsClockHistory size={24} />,
      color: "bg-yellow-50",
      iconColor: "text-yellow-500",
      borderColor: "border-yellow-200",
    },
    {
      title: "Total Payments",
      value: payments?.length || 0,
      description: "Payment submissions",
      icon: <MdPayments size={24} />,
      color: "bg-purple-50",
      iconColor: "text-purple-500",
      borderColor: "border-purple-200",
    },
    {
      title: "Total Invoices",
      value: invoices?.length || 0,
      description: "Generated invoices",
      icon: <FaFileInvoice size={24} />,
      color: "bg-pink-50",
      iconColor: "text-pink-500",
      borderColor: "border-pink-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
            <HiArrowPath className="text-gray-600" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className={`${card.color} ${card.borderColor} border rounded-xl p-6 transition-all hover:shadow-md`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-gray-700 font-semibold">{card.title}</h3>
                  <p className="text-4xl font-bold text-gray-800">
                    {card.value}
                  </p>
                  <p className="text-gray-600 text-sm">{card.description}</p>
                </div>
                <div
                  className={`${card.iconColor} p-3 bg-white rounded-lg shadow-sm`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            {pengajuans?.slice(0, 2).map((pengajuan, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3"
              >
                <BsClockHistory className="text-blue-500" />
                <div>
                  <p className="font-medium">New submission received</p>
                  <p className="text-sm text-gray-500">
                    Status: {pengajuan.status}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Latest Payments</h2>
            {payments?.slice(0, 3).map((payment, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3"
              >
                <MdPayments className="text-green-500" />
                <div>
                  <p className="font-medium">Payment Received</p>
                  <p className="text-sm text-gray-500">ID: {payment.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
