"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import EditPackageDialog from "@/components/admin/package/EditPackageDialog";
import DeletePackageAlert from "@/components/admin/package/DeletePackageAlert";

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
    accessorKey: "destination",
    header: "Destination",
    cell: ({ row }) => {
      const destination = row.original.destination;
      return (
        <span className="font-medium">
          {destination?.name || "No destination"}
        </span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="block max-w-[250px] truncate line-clamp-2">
        {row.getValue("description")}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return (
        <span className="flex justify-center">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(price)}
        </span>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <span className="block max-w-[150px] truncate line-clamp-2">
        {row.getValue("duration")}
      </span>
    ),
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.getValue("image");
      const imageUrl =
        row.original.image_url ||
        (image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${image}` : null);

      if (!imageUrl) {
        return (
          <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
            No image
          </div>
        );
      }

      return (
        <div className="w-16 h-12 relative">
          <img
            src={imageUrl}
            alt={row.getValue("name") || "Package image"}
            className="w-full h-full object-cover rounded shadow"
            loading="lazy"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status");
      console.log("Rendering status:", status);

      return (
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
              }`}
          >
            {status}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return (
        <div className="flex gap-2">
          <EditPackageDialog packages={rowData} />
          <DeletePackageAlert packages={rowData} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
