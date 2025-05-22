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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
    <Dialog open={open} onOpenChange={setOpen}>
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
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <Input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            required
          />
          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
          <Input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            required
          />
          <div>
            <label className="block mb-1 text-sm font-medium">Image</label>
            <Input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
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
