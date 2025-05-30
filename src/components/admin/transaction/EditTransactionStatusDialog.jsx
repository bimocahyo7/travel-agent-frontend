"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useTransaction } from "@/hooks/transaction"
import { SquarePen } from "lucide-react"
import { toast } from "sonner"

const statusOptions = [
  { value: "success", label: "Success", color: "bg-green-500" },
  { value: "failed", label: "Failed", color: "bg-red-500" },
]

export default function EditTransactionStatusDialog({ transaction }) {
  const { updateTransactionStatus } = useTransaction()
  const [status, setStatus] = useState(transaction?.status || "failed")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (status === transaction?.status) {
      toast.error("Status masih sama dengan sebelumnya!")
      return
    }

    try {
      setLoading(true)
      const success = await updateTransactionStatus(transaction.id, status)

      if (success) {
        toast.success("Status transaksi berhasil diperbarui!")
        setOpen(false)
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error(
        error?.response?.data?.message ||
          "Gagal memperbarui status transaksi!"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen)
    if (!isOpen) {
      // Reset form state when dialog closes
      setStatus(transaction?.status || "failed")
    }
  }

  const currentStatus = statusOptions.find(
    (option) => option.value === transaction?.status
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="cursor-pointer"
          disabled={loading}
        >
          <SquarePen className="h-4 w-4 mr-2" />
          Edit Status
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction Status</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Current Status:</span>
              <span
                className={`px-2 py-1 rounded-md text-white text-sm ${currentStatus?.color}`}
              >
                {transaction?.status?.toUpperCase()}
              </span>
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.value === transaction?.status}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${option.color}`}
                      />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                disabled={loading}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading || status === transaction?.status}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}