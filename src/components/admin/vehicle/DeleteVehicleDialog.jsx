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
import { useVehicle } from "@/hooks/vehicle";
import toast from "react-hot-toast";

export default function DeleteVehicleDialog({ vehicle }) {
  const { deleteVehicle } = useVehicle();

  const handleDelete = async () => {
    try {
      await deleteVehicle(vehicle.id);
      toast.success("Kendaraan berhasil dihapus!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal menghapus kendaraan!");
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
            Apakah Anda yakin ingin menghapus kendaraan{" "}
            <b>{vehicle.name}</b> ({vehicle.type} - {vehicle.licensePlate})? Tindakan ini tidak dapat dibatalkan.
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
