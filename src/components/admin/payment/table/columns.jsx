"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EditPaymentDialog from "@/components/admin/payment/EditPaymentDialog";
import { formatDate } from "@/lib/utils";
import { useMemo } from "react";
import { generateCustomPDF } from "../CustomPDFGenerator";
import jsPDF from "jspdf";
import "jspdf-autotable";

export function getPaymentColumns(users = [], handleShowBookingDetail, handleExportPDF) {
  return [
    {
      id: "patent_code",
      header: "ID",
      cell: ({ row }) => {
        const payment = row.original;
        const id = payment.id || '-';
        const date = payment.payment_date || payment.createdAt;
        let code = '/';
        if (date && id) {
          const d = new Date(date);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          code = `${year}${month}/${id}`;
        }
        return code;
      },
    },
    {
      accessorKey: "user_id",
      header: "User",
      cell: ({ row }) => {
        const userId = row.getValue("user_id");
        const user = users.find((u) => u.id === userId);
        return (
          <span className="font-medium">
            {user ? user.name : userId}
          </span>
        );
      },
      filterFn: (row, id, value) => {
        const userId = row.getValue("user_id");
        const user = users.find((u) => u.id === userId);
        if (!value) return true;
        if (!user) return String(userId).toLowerCase().includes(String(value).toLowerCase());
        return user.name.toLowerCase().includes(String(value).toLowerCase());
      },
    },
    {
      accessorKey: "booking_id",
      header: "Booking ID",
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        return (
          <span className="flex justify-items-start">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(amount)}
          </span>
        );
      },
    },
    {
      accessorKey: "payment_method",
      header: "Payment Method",
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("payment_method")}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <Badge
            variant={
              status === "completed"
                ? "success"
                : status === "paid"
                ? "success"
                : status === "pending"
                ? "warning"
                : "destructive"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "bukti_pembayaran",
      header: "Bukti Pembayaran",
      cell: ({ row }) => {
        const buktiPembayaran = row.getValue("bukti_pembayaran");
        if (!buktiPembayaran) return <span>-</span>;
        
        return (
          <Button
            variant="link"
            size="sm"
            onClick={() => window.open(buktiPembayaran, '_blank')}
          >
            Lihat Bukti
          </Button>
        );
      },
    },
    {
      accessorKey: "payment_date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Payment Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <span className="font-medium">
          {formatDate(row.getValue("payment_date"))}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Edit Status",
      cell: ({ row }) => {
        const payment = row.original;
        const [open, setOpen] = require('react').useState(false);
        return (
          <>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
              Edit Status
            </Button>
            <EditPaymentDialog
              isOpen={open}
              onClose={() => setOpen(false)}
              payment={payment}
            />
          </>
        );
      },
    },
    {
      id: "show_booking_detail",
      header: "Lihat Detail",
      cell: ({ row }) => {
        const payment = row.original;
        if (payment.status === "completed") {
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShowBookingDetail(payment)}
            >
              Lihat Detail
            </Button>
          );
        }
        return null;
      },
    },
  ];
}
