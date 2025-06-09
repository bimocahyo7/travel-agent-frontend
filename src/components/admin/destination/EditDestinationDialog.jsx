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
import { Label } from "@/components/ui/label";
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
    image: destination.image || null,
  });

  // Get data image from backend
  const getImageUrl = (image) => {
    if (!image) return null;
    if (image instanceof File) return URL.createObjectURL(image);
    // Cek jika image sudah berupa URL penuh
    if (typeof image === "string" && image.startsWith("http")) return image;
    // Fallback ke image_url dari destination jika ada
    if (destination.image_url) return destination.image_url;
    // Fallback ke path manual
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/images/${image}`;
  };

  const preview = getImageUrl(form.image);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState({});

  const editDestinationSchema = z.object({
    name: z.string().min(3, "Nama destinasi minimal 3 karakter"),
    location: z.string().min(3, "Lokasi minimal 3 karakter"),
    description: z.string().min(3, "Deskripsi minimal 3 karakter"),
    price: z.number().min(1, "Masukkan harga valid"),
    image: z
      .any()
      .refine((file) => {
        // Jika tidak ada file baru, lewati validasi
        if (!file || typeof file === "string") {
          return true;
        }

        // Jika ada file baru, validasi tipe file
        return (
          file instanceof File &&
          ["image/jpeg", "image/png", "image/webp"].includes(file.type)
        );
      }, "File harus berupa gambar valid")
      .optional(),
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
    }
  };

  const resetForm = () => {
    setForm({
      name: destination.name,
      location: destination.location,
      description: destination.description,
      price: destination.price,
      image: destination.image || null,
    });
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

      if (form.image instanceof File) {
        formData.append("image", form.image);
      }

      await updateDestination(destination.id, formData);
      setLoading(false);
      setOpen(false);
      toast.success("Destinasi berhasil diedit!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Gagal mengupdate destinasi!",
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
      <DialogContent
        className="min-w-2xl w-full"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Destination</DialogTitle>
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
              <div>
                <label className="block text-sm font-medium mt-2">
                  Preview
                </label>
                <div className="w-full h-[120px] rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-gray-500">
                      No image selected
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Footer full width */}
          <DialogFooter className="md:col-span-2 flex justify-end gap-2 mt-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
