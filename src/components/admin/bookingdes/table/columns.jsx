"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import EditBookingdesDialog from "../EditBookingdesDialog";

export const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "customer",
    accessorFn: (row) => row.user?.name,
    header: "Customer",
  },
  {
    id: "destination",
    accessorFn: (row) => row.destination?.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Destination
        </Button>
      );
    },
  },
  {
    id: "vehicle",
    accessorFn: (row) => row.vehicle?.name,
    header: "Vehicle",
  },
  {
    accessorKey: "booking_date",
    header: "Booking Date",
    cell: ({ row }) => {
      return format(new Date(row.getValue("booking_date")), "dd MMM yyyy");
    },
  },
  {
    accessorKey: "jumlah_penumpang",
    header: "Passengers",
    cell: ({ row }) => {
      const value = parseInt(row.getValue("jumlah_penumpang"));
      return value.toString();
    },
  },
  {
    accessorKey: "total_price",
    header: "Total Price",
    cell: ({ row }) => {
      const amount = parseInt(row.getValue("total_price"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const statusColors = {
        pending: "bg-yellow-500",
        confirmed: "bg-green-500",
        cancelled: "bg-red-500",
        completed: "bg-blue-500",
      };

      return (
        <Badge className={`${statusColors[status]} text-white`}>
          {status.toUpperCase()}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const booking = row.original;

      return (
        <div className="flex items-center gap-2">
          <EditBookingdesDialog booking={booking} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(booking.id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  (window.location.href = `/admin/bookingdes/${booking.id}`)
                }
              >
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];