"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import EditDestinationDialog from "@/components/admin/destination/EditDestinationDialog";
import DeleteDestinationAlert from "@/components/admin/destination/DeleteDestinationAlert";

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
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="block max-w-[150px] truncate line-clamp-2">
        {row.getValue("location")}
      </span>
    ),
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
        <span className="flex justify-items-start">
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
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.getValue("image");

      const imageUrl = image
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${image}`
        : null;

      if (!imageUrl) {
        return (
          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return (
        <div className="flex gap-2">
          <EditDestinationDialog destination={rowData} />
          <DeleteDestinationAlert destination={rowData} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
