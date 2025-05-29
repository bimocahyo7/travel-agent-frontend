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
import { usePackages } from "@/hooks/usePackages";
import { useDestinations } from "@/hooks/useDestinations";
import { SquarePlus } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddPackageDialog() {
  const { createPackage } = usePackages();
  const { destinations } = useDestinations();
  const [form, setForm] = useState({
    name: "",
    duration: "",
    description: "",
    price: "",
    status: "active",
    destination_id: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState({});

  const packageSchema = z.object({
    name: z.string().min(3, "Nama paket minimal 3 karakter"),
    duration: z.string().min(3, "Durasi paket minimal 3 karakter"),
    description: z.string().min(3, "Deskripsi minimal 3 karakter"),
    price: z.number().min(1, "Masukkan harga valid"),
    status: z.enum(["active", "inactive"]),
    destination_id: z.string().min(1, "Destinasi wajib dipilih"),
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
      duration: "",
      description: "",
      price: "",
      status: "active",
      destination_id: "",
      image: null,
    });
    setPreview(null);
    setError({});
    setLoading(false);
  };

  const handleStatusChange = (value) => {
    setForm((prev) => ({ ...prev, status: value }));
    setError((prev) => ({ ...prev, status: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = packageSchema.safeParse({
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

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("duration", form.duration);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("status", form.status);
      formData.append("destination_id", form.destination_id);

      if (form.image) {
        formData.append("image", form.image);
      }

      await createPackage(formData);
      resetForm();
      setOpen(false);
      toast.success("Paket berhasil ditambahkan");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal menambahkan paket!");
    } finally {
      setLoading(false);
    }
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
        <Button className="bg-teal-200 cursor-pointer" variant="primary">
          <SquarePlus /> Add Package
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
          <DialogTitle>Add Package</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
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
                  value={form.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
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
                  onValueChange={(value) => {
                    setForm((prev) => ({ ...prev, destination_id: value }));
                    setError((prev) => ({
                      ...prev,
                      destination_id: undefined,
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select destination" />
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
                    <p className="text-rose-400 text-sm">
                      {error.destination_id}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
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
                onClick={resetForm}
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
