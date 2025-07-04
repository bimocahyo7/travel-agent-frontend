"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { usePengajuan } from "@/hooks/pengajuan";
import { toast } from "react-hot-toast";
import InvoiceModal from "../InvoiceModal";

export const columns = ({ vehicles = [], onShowInvoice, onShowBarcode, onShowPaymentReceived }) => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "institution",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Institution
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.getValue("institution")}</span>,
  },
  {
    accessorKey: "applicant",
    header: "Applicant",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "destination",
    header: "Destination",
    cell: ({ row }) => <span>{row.getValue("destination")}</span>,
  },
  {
    accessorKey: "vehicle_id",
    header: "Vehicle",
    cell: ({ row }) => {
      const vehicleId = row.getValue("vehicle_id");
      const vehicle = vehicles?.find((v) => v.id === vehicleId);
      return (
        <span>
          {vehicle ? vehicle.type : vehicleId}
        </span>
      );
    },
  },
  {
    accessorKey: "departure_date",
    header: "Departure Date",
  },
  {
    accessorKey: "return_date",
    header: "Return Date",
  },
  {
    accessorKey: "participants",
    header: "Participants",
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
      <span className="block max-w-[200px] truncate line-clamp-2">
        {row.getValue("notes")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusOptions = [
        { value: "menunggu_konfirmasi", label: "Menunggu Konfirmasi Admin" },
        { value: "menunggu_persetujuan", label: "Invoice Dikirim" },
        { value: "disetujui", label: "Disetujui" },
        { value: "dalam_perjalanan", label: "Dalam Perjalanan" },
        { value: "menunggu_pembayaran", label: "Pembayaran Dikirim" },
        { value: "lunas", label: "Pembayaran Diterima" },
        { value: "ditolak", label: "Pengajuan Ditolak" },
      ];
      const { updatePengajuan } = usePengajuan();
      const [localStatus, setLocalStatus] = React.useState(row.getValue("status"));
      const id = row.original.id;
      // Find the index of the current status
      const currentStatusIndex = statusOptions.findIndex(opt => opt.value === localStatus);
      const handleStatusChange = async (value) => {
        setLocalStatus(value);
        const result = await updatePengajuan(id, { status: value });
        if (result) {
          toast.success("Status berhasil diupdate");
          if (value === "menunggu_persetujuan" && onShowInvoice) {
            onShowInvoice(row.original);
          }
          if (value === "menunggu_pembayaran" && onShowBarcode) {
            onShowBarcode(id);
          }
          if (value === "lunas" && onShowPaymentReceived) {
            onShowPaymentReceived(row.original.id);
          }
        } else {
          toast.error("Gagal update status");
        }
      };

      return (
        <Select value={localStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="capitalize w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option, idx) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="capitalize"
                disabled={
                  option.value === "disetujui" || (idx !== currentStatusIndex && idx !== currentStatusIndex + 1)
                }
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
];
