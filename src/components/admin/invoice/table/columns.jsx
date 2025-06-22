"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import ViewInvoiceDialog from "@/components/admin/invoice/ViewInvoiceDialog";
import DeleteInvoiceDialog from "@/components/admin/invoice/DeleteInvoiceDialog";

export const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "user",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{user?.name || "Unknown User"}</span>
          <span className="text-sm text-gray-500">{user?.email}</span>
        </div>
      );
    },
    // Tambahkan custom filter function
    filterFn: "userNameFilter",
  },
  {
    accessorKey: "pengajuan",
    header: "Pengajuan ID",
    cell: ({ row }) => {
      const pengajuan = row.original.pengajuan;
      return <span>#{pengajuan?.id || "N/A"}</span>;
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const totalPrice = parseFloat(row.getValue("total"));
      return (
        <span className="flex justify-items-start">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(totalPrice)}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge
          variant={
            status === "paid"
              ? "success"
              : status === "sent"
                ? "warning"
                : "default"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const invoice = row.original;

      return (
        <div className="flex gap-2">
          <ViewInvoiceDialog invoice={invoice} />
          {/* <DeleteInvoiceDialog invoice={invoice} /> */}
        </div>
      );
    },
  },
];
