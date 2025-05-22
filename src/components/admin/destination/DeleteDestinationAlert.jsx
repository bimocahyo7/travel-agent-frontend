"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useDestinations } from "@/hooks/useDestinations";
import toast from "react-hot-toast";

export default function DeleteDestinationAlert({ destination }) {
  const { deleteDestination } = useDestinations();

  const handleDelete = async () => {
    try {
      await deleteDestination(destination.id);
      toast.success("Destinasi berhasil dihapus!");
    } catch (error) {
      toast.error(err?.response?.data?.message || "Gagal menghapus destinasi!");
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
          <Trash2 />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Data?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus destinasi{" "}
            <b>{destination.name}</b>? Tindakan ini tidak dapat dibatalkan.
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
