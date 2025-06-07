"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, Star } from "lucide-react";
import DeleteReviewDialog from "@/components/admin/review/DeleteReviewDialog";
import ViewReviewDialog from "@/components/admin/review/ViewReviewDialog";

export const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "user_id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user_name = row.original.user?.name || "Unknown User";

      return (
        <div className="flex flex-col">
          <span className="font-medium">{user_name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "package_id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Package Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const package_id = row.original.package.id;
      const package_name = row.original.package?.name || "Unknown Package";

      return (
        <div className="flex flex-col">
          <span className="font-medium">{package_name}</span>
          <span className="text-sm text-gray-500">ID: {package_id}</span>
        </div>
      );
    },

    // Add custom filter mode
    filterFn: "packageNameFilter",
  },
  {
    accessorKey: "rating",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rating
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rating = row.getValue("rating");

      return (
        <div className="flex justify-center">
          <div className="inline-flex justify-center items-center gap-1 px-3 py-1 rounded-full bg-amber-200">
            <span className="text-sm font-medium text-amber-900">{rating}</span>
            <Star className="h-4 w-4 text-amber-600 fill-amber-600" />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => {
      return (
        <div className="block max-w-[250px] truncate line-clamp-2">
          <span className="text-center">{row.getValue("comment")}</span>
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
          <ViewReviewDialog review={rowData} />
          <DeleteReviewDialog review={rowData} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
