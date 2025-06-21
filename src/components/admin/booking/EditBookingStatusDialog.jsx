"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBooking } from "@/hooks/booking";
import { Edit } from "lucide-react";
import { toast } from "sonner";

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "confirmed", label: "Confirmed", color: "bg-green-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
  { value: "completed", label: "Completed", color: "bg-gray-500" },
];

export default function EditBookingStatusDialog({ booking }) {
  if (!booking) {
    return null;
  }

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(booking?.status || "pending");
  const { updateBookingStatus, updating: loading } = useBooking();

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      setStatus(booking?.status || "pending");
    }
  };

  const handleUpdateStatus = async () => {
    if (status === booking?.status) {
      toast.error("Status still the same as before!");
      return;
    }

    try {
      await updateBookingStatus(booking.id, status);
      toast.success("Booking status updated successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update booking status!"
      );
    }
  };

  const currentStatus = statusOptions.find(
    (option) => option.value === booking?.status
  ) || statusOptions[0];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="cursor-pointer"
          disabled={loading}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Status
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Booking Status</DialogTitle>
          <DialogDescription>
            Update the status for booking #{booking?.id}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateStatus();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Current Status:</span>
              <span
                className={`px-2 py-1 rounded-md text-white text-sm capitalize ${
                  currentStatus?.color
                }`}
              >
                {booking?.status || "pending"}
              </span>
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(statusOptions) &&
                  statusOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      disabled={option.value === booking?.status}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${option.color}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading || status === booking?.status}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}