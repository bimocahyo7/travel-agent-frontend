import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { formatDate, formatRupiah } from "@/lib/utils";

export const columns = ({
  onView,
  onEdit,
  onDelete,
  onVerify,
}) => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "pengajuan",
    header: "Institution",
    cell: ({ row }) => {
      const pengajuan = row.original.pengajuan;
      return pengajuan ? pengajuan.institution : "-";
    },
    filterFn: (row, id, value) => {
      const pengajuan = row.original.pengajuan;
      return pengajuan?.institution?.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "amount_paid",
    header: "Amount Paid",
    cell: ({ row }) => formatRupiah(row.getValue("amount_paid")),
  },
  {
    accessorKey: "method",
    header: "Payment Method",
    cell: ({ row }) => {
      const method = row.getValue("method");
      return method?.replace("_", " ").toUpperCase() || "-";
    },
  },
  {
    accessorKey: "status",
    header: "Status", 
    cell: ({ row }) => {
      const status = row.getValue("status") || "belum_lunas";
      const paidAt = row.getValue("paid_at");
      
      // If paid_at exists, set status to lunas
      const displayStatus = paidAt ? "lunas" : status;

      return (
        <Badge
          variant={
            displayStatus === "lunas"
              ? "success"
              : displayStatus === "ditolak"
              ? "destructive"
              : "warning"
          }
        >
          {displayStatus.replace("_", " ").toUpperCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paid_at",
    header: "Paid At",
    cell: ({ row }) => formatDate(row.getValue("paid_at")),
  },
  {
    accessorKey: "verified_at",
    header: "Verified At",
    cell: ({ row }) => formatDate(row.getValue("verified_at")),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0 text-red-600"
          onClick={() => onDelete(payment.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      );
    },
  },
];