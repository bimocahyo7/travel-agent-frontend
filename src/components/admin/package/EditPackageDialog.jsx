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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePackages } from "@/hooks/usePackages";
import { useDestinations } from "@/hooks/useDestinations";
import { SquarePen } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";

export default function EditPackageDialog({ packages }) {
  const { updatePackage } = usePackages();
  const { destinations } = useDestinations();

  const [form, setForm] = useState({
    name: packages.name,
    duration: packages.duration,
    description: packages.description,
    price: packages.price,
    status: packages.status || "active",
    destination_id: packages.destination?.id?.toString() || "",
    image: packages.image || null,
  });

  // Get data image from backend
  const getImageUrl = (image) => {
    if (!image) return null;
    if (image instanceof File) return URL.createObjectURL(image);
    // Gunakan image_url jika ada
    if (packages.image_url) return packages.image_url;
    // Fallback ke path manual
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${image}`;
  };

  const preview = getImageUrl(form.image);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState({});

  const editPackageSchema = z.object({
    name: z.string().min(3, "Nama paket minimal 3 karakter"),
    duration: z.string().min(3, "Durasi paket minimal 3 karakter"),
    description: z.string().min(3, "Deskripsi minimal 3 karakter"),
    price: z.number().min(1, "Masukkan harga valid"),
    status: z.enum(["active", "inactive"]),
    destination_id: z.string().min(1, "Destinasi wajib dipilih"),
    image: z.any().optional(),
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
      name: packages.name,
      duration: packages.duration,
      description: packages.description,
      price: packages.price,
      status: packages.status || "active",
      destination_id: packages.destination?.id?.toString() || "",
      image: packages.image || null,
    });
    setError({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validationData = {
        ...form,
        price: Number(form.price),
        status: form.status || "active",
      };

      const result = editPackageSchema.safeParse(validationData);

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

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("duration", form.duration);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("status", form.status || "active");
      formData.append("destination_id", form.destination_id);

      if (form.image instanceof File) {
        formData.append("image", form.image);
      }

      if (!form.image && packages.image) {
        formData.append("image", packages.image);
      }

      await updatePackage(packages.id, formData);
      setLoading(false);
      setOpen(false);
      toast.success("Package berhasil diedit!");
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(
        error?.response?.data?.message || "Gagal mengupdate package!",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (value) => {
    setForm((prev) => ({ ...prev, status: value }));
    setError((prev) => ({ ...prev, status: undefined }));
  };

  const handleDestinationChange = (value) => {
    setForm((prev) => ({ ...prev, destination_id: value }));
    setError((prev) => ({ ...prev, destination_id: undefined }));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
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
        className="sm:max-w-[800px]"
        // Prevent closing when clicking outside dialog
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Package</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block mb-1 text-sm font-medium">Name</label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter package name"
                  required
                />
                {error.name && (
                  <p className="text-rose-400 text-sm mt-1">{error.name}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Price</label>
                <Input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min={0}
                  required
                />
                {error.price && (
                  <p className="text-rose-400 text-sm mt-1">{error.price}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Duration
                </label>
                <Input
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="Enter duration"
                  required
                />
                {error.duration && (
                  <p className="text-rose-400 text-sm mt-1">{error.duration}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Status</label>
                <Select
                  name="status"
                  value={form.status || "active"}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {form.status === "active" ? "Active" : "Inactive"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {error.status && (
                  <p className="text-rose-400 text-sm mt-1">{error.status}</p>
                )}
              </div>

              <div className="h-24">
                <label className="block mb-1 text-sm font-medium">
                  Destination
                </label>
                <Select
                  name="destination_id"
                  value={form.destination_id}
                  onValueChange={handleDestinationChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select destination">
                      {destinations?.find(
                        (d) => d.id.toString() === form.destination_id,
                      )?.name || "Select destination"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {destinations?.map((destination) => (
                      <SelectItem
                        key={destination.id}
                        value={destination.id.toString()}
                      >
                        {destination.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="h-5">
                  {error.destination_id && (
                    <p className="text-rose-400 text-xs">
                      {error.destination_id}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-3">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Description
                </label>
                <Textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  className="min-h-[110px]"
                  required
                />
                {error.description && (
                  <p className="text-rose-400 text-sm mt-1">
                    {error.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <Input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer file:cursor-pointer"
                />
                {error.image && (
                  <p className="text-rose-400 text-sm mt-1">{error.image}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
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
