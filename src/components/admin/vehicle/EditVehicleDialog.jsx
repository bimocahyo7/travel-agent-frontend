"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Keep Textarea for potential description field, although not in current vehicle schema
import { useVehicle } from "@/hooks/vehicle"; // Use useVehicle hook
import { SquarePen } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";
import { Label } from "@/components/ui/label"; // Added Label import

export default function EditVehicleDialog({ vehicle }) { // Receive vehicle prop
  const { updateVehicle } = useVehicle(); // Use updateVehicle function
  const [form, setForm] = useState({
    name: vehicle.name,
    type: vehicle.type,
    license_plate: vehicle.license_plate,
    capacity: vehicle.capacity,
    status: vehicle.status || "available",
    description: vehicle.description || "",
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState({});

  const editVehicleSchema = z.object({
    name: z.string().min(3, "Nama kendaraan minimal 3 karakter"),
    type: z.string().min(3, "Tipe kendaraan minimal 3 karakter"),
    license_plate: z.string().min(3, "Plat nomor minimal 3 karakter"),
    capacity: z.number().min(1, "Masukkan kapasitas valid"),
    status: z.enum(["available", "in_use", "maintenance"]),
    description: z.string().optional(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number(value) : value,
    }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const resetForm = () => {
    setForm({
      name: vehicle.name,
      type: vehicle.type,
      license_plate: vehicle.license_plate,
      capacity: vehicle.capacity,
      status: vehicle.status || "available",
      description: vehicle.description || "",
    });
    setError({});
  };

  // Sync form state with vehicle prop
  useEffect(() => {
    setForm({
      name: vehicle.name,
      type: vehicle.type,
      license_plate: vehicle.license_plate,
      capacity: vehicle.capacity,
      status: vehicle.status || "available",
      description: vehicle.description || "",
    });
  }, [vehicle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = editVehicleSchema.safeParse({
      ...form,
      capacity: Number(form.capacity),
    });

    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setError(fieldErrors);
      setLoading(false);
      return;
    }

    setError({});

    try {
      await updateVehicle(vehicle.id, {
        name: form.name,
        type: form.type,
        license_plate: form.license_plate,
        capacity: form.capacity,
        status: form.status,
        description: form.description,
      });
      setLoading(false);
      setOpen(false);
      toast.success("Kendaraan berhasil diedit!");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Gagal mengupdate kendaraan!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        // Reset saat modal ditutup
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="cursor-pointer">
          <SquarePen />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-2xl w-full"> {/* Added width class */}
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"> {/* Updated grid layout */}
          <div className="flex flex-col gap-4"> {/* Group fields */}
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter vehicle name"
                required
              />
              <div className="min-h-[10px]">
                {error.name && (
                  <p className="text-rose-400 text-sm">{error.name}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Input
                name="type"
                value={form.type}
                onChange={handleChange}
                placeholder="Enter vehicle type"
                required
              />
              <div className="min-h-[10px]">
                {error.type && (
                  <p className="text-rose-400 text-sm">{error.type}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>License Plate</Label>
              <Input
                name="license_plate"
                value={form.license_plate}
                onChange={handleChange}
                placeholder="Enter license plate"
                required
              />
              <div className="min-h-[10px]">
                {error.license_plate && (
                  <p className="text-rose-400 text-sm">{error.license_plate}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Capacity</Label>
              <Input
                name="capacity"
                type="number"
                value={String(form.capacity)}
                onChange={handleChange}
                placeholder="Enter capacity"
                min={1}
                required
              />
              <div className="min-h-[10px]">
                {error.capacity && (
                  <p className="text-rose-400 text-sm">{error.capacity}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              >
                <option value="available">Available</option>
                <option value="in_use">In Use</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <div className="min-h-[10px]">
                {error.status && (
                  <p className="text-rose-400 text-sm">{error.status}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter description"
                rows={4}
              />
              <div className="min-h-[10px]">
                {error.description && (
                  <p className="text-rose-400 text-sm">{error.description}</p>
                )}
              </div>
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 mt-2"> {/* Footer full width */}
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="cursor-pointer"
                onClick={resetForm}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="cursor-pointer" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

