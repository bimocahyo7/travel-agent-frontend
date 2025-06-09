import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
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
    header: "Pengajuan",
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
      return (
        <Badge
          variant={
            status === "lunas"
              ? "success"
              : status === "ditolak"
              ? "destructive"
              : "warning"
          }
        >
          {status.replace("_", " ").toUpperCase()}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(payment)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {payment.status === "belum_lunas" && (
              <DropdownMenuItem onClick={() => onVerify(payment)}>
                <Badge variant="outline" className="mr-2">
                  ✓
                </Badge>
                Verify Payment
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onEdit(payment)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(payment.id)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];