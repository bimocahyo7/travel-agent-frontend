"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import EditVehicleDialog from "@/components/admin/vehicle/EditVehicleDialog"; // Import EditVehicleDialog
import DeleteVehicleDialog from "@/components/admin/vehicle/DeleteVehicleDialog"; // Import DeleteVehicleDialog

const VEHICLE_STATUS_LABELS = {
  available: "Available",
  in_use: "In Use",
  maintenance: "Maintenance",
};

export const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="block max-w-[100px] truncate line-clamp-2">
        {row.getValue("type")}
      </span>
    ),
  },
  {
    accessorKey: "license_plate",
    header: "License Plate",
    cell: ({ row }) => (
      <span className="block max-w-[100px] truncate line-clamp-2">
        {row.getValue("license_plate")}
      </span>
    ),
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => (
      <span className="flex justify-center">
        {row.getValue("capacity")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="capitalize">{VEHICLE_STATUS_LABELS[row.getValue("status")] || row.getValue("status")}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return (
        <div className="flex gap-2">
          <EditVehicleDialog vehicle={rowData} /> {/* Use EditVehicleDialog */}
          <DeleteVehicleDialog vehicle={rowData} /> {/* Use DeleteVehicleDialog */}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

