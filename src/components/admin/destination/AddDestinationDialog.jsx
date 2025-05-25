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
import { SquarePlus } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";
import { Label } from "@/components/ui/label";

export default function AddDestinationDialog() {
  const { createDestination } = useDestinations();
  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    price: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState({});

  const destinationSchema = z.object({
    name: z.string().min(3, "Nama destinasi minimal 3 karakter"),
    location: z.string().min(3, "Lokasi minimal 3 karakter"),
    description: z.string().min(3, "Deskripsi minimal 3 karakter"),
    price: z.number().min(1, "Masukkan harga valid"),
    image: z.instanceof(File, { message: "Gambar wajib diupload" }),
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
      name: "",
      location: "",
      description: "",
      price: "",
      image: null,
    });
    setPreview(null);
    setError({});
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = destinationSchema.safeParse({
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

      await createDestination(formData);

      resetForm();
      setOpen(false);
      toast.success("Destinasi berhasil ditambahkan");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Gagal menambahkan destinasi!",
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
        <Button className="bg-teal-200 cursor-pointer" variant="primary">
          <SquarePlus /> Add Destination
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Add Destination</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
        >
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
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
            <div className="space-y-2">
              <Label>Location</Label>
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
            <div className="space-y-2">
              <Label>Price</Label>
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
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Description</Label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description destination"
              required
              className="h-32"
            />
            <div className="min-h-[6px]">
              {error.description && (
                <p className="text-rose-400 text-sm">{error.description}</p>
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
              <div className="min-h-[10px] mt-2">
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
          </div>
          {/* Footer full width */}
          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
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
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
