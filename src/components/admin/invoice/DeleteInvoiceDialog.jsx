"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useInvoices } from "@/hooks/invoice";
import toast from "react-hot-toast";

export default function DeleteInvoiceDialog({ invoice }) {
  const { deleteInvoice } = useInvoices();

  const handleDelete = async () => {
    try {
      await deleteInvoice(invoice.id);
      toast.success("Invoice berhasil dihapus!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal menghapus invoice!");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="primary"
          className="bg-rose-700 text-white cursor-pointer"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Invoice?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus invoice untuk pengajuan{" "}
            <b>ID: {invoice.pengajuan?.id}</b> dengan total{" "}
            <b>Rp {invoice.total?.toLocaleString("id-ID")}</b>?
            <br />
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 cursor-pointer"
            onClick={handleDelete}
          >
            Ya, Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
