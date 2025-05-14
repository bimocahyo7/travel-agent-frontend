"use client";

import { PlaneTakeoff, CalendarDays, Plus } from "lucide-react";
import Header from "@/app/(customer)/Header";
import { useAuth } from "@/hooks/auth";
import RoleGuard from "@/components/auth/RoleGuard";

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <RoleGuard allowedRoles={["customer"]}>
      <div className="ml-64 p-6 space-y-6">
        <Header title="Dashboard Customer" />
        {/* <h1 className="text-2xl font-bold mb-6">Dashboard Customer</h1> */}

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Hallo, {user?.name}!</h2>
          <p className="text-gray-600">
            Ready for your next adventure? Check your trips below or make a new
            booking.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upcoming Trip */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-primary">
                <PlaneTakeoff className="w-5 h-5" />
                <span className="font-medium">Upcoming Trip</span>
              </div>
              <button className="text-sm border px-3 py-1 rounded-md hover:bg-gray-100">
                View All
              </button>
            </div>
            <div className="text-gray-700 space-y-1">
              <p className="font-semibold">✈️ Bali Getaway</p>
              <p className="text-sm text-gray-500">May 18 - May 22, 2025</p>
              <p className="text-sm">
                Status:{" "}
                <span className="text-green-600 font-medium">Confirmed</span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-2 text-primary mb-4">
              <CalendarDays className="w-5 h-5" />
              <span className="font-medium">Quick Actions</span>
            </div>
            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Book a New Trip
              </button>
              <button className="flex items-center gap-2 border px-4 py-2 rounded-md hover:bg-gray-100">
                📄 My Bookings
              </button>
              <button className="flex items-center gap-2 border px-4 py-2 rounded-md hover:bg-gray-100">
                🛠️ Get Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default Dashboard;
