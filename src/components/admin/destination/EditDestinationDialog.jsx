"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useDestinations } from "@/hooks/useDestinations";
import { SquarePen } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";

export default function EditDestinationDialog({ destination }) {
  const { updateDestination } = useDestinations();
  const [form, setForm] = useState({
    name: destination.name,
    location: destination.location,
    description: destination.description,
    price: destination.price,
    image: null,
  });
  const [preview, setPreview] = useState(destination.image);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState({});

  const editDestinationSchema = z.object({
    name: z.string().min(3, "Nama destinasi minimal 3 karakter"),
    location: z.string().min(3, "Lokasi minimal 3 karakter"),
    description: z.string().min(3, "Deskripsi minimal 3 karakter"),
    price: z.number().min(1, "Masukkan harga valid"),
    // Initial validation image
    image: z.any().optional(),
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setForm({
      name: destination.name,
      location: destination.location,
      description: destination.description,
      price: destination.price,
      image: null,
    });
    setPreview(destination.image);
    setError({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = editDestinationSchema.safeParse({
      ...form,
      price: Number(form.price),
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
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("location", form.location);
      formData.append("description", form.description);
      formData.append("price", form.price);
      if (form.image) {
        formData.append("image", form.image);
      }

      await updateDestination(destination.id, formData);
      setLoading(false);
      setOpen(false);
      toast.success("Destinasi berhasil diedit!");
    } catch (error) {
      toast.error(
        err?.response?.data?.message || "Gagal mengupdate destinasi!",
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Destination</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter destination name"
              required
            />
            <div className="min-h-[10px]">
              {error.name && (
                <p className="text-rose-400 text-sm">{error.name}</p>
              )}
            </div>
          </div>
          <div>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Enter location name"
              required
            />
            <div className="min-h-[10px]">
              {error.location && (
                <p className="text-rose-400 text-sm">{error.location}</p>
              )}
            </div>
          </div>
          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter description destination"
            required
          />
          <div className="min-h-[10px]">
            {error.description && (
              <p className="text-rose-400 text-sm">{error.description}</p>
            )}
          </div>
          <Input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Enter price"
            min={0}
            required
          />
          <div className="min-h-[10px]">
            {error.price && (
              <p className="text-rose-400 text-sm">{error.price}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Image</label>
            <Input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="min-h-[10px]">
              {error.image && (
                <p className="text-rose-400 text-sm">{error.image}</p>
              )}
            </div>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-32 h-20 object-cover rounded"
              />
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="cursor-pointer" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
