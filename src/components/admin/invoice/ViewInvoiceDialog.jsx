"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, User, FileText, DollarSign, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ViewInvoiceDialog({ invoice }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="text-sky-700 border-sky-700 cursor-pointer"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">
            Invoice Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="size-5 text-gray-500" />
              User Information
            </h3>
            <div className="pl-7">
              <p className="text-sm text-gray-600">
                Name: {invoice.user?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Email: {invoice.user?.email || "N/A"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="size-5 text-gray-500" />
              Pengajuan Information
            </h3>
            <div className="pl-7">
              <p className="text-sm text-gray-600">
                ID: #{invoice.pengajuan?.id || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Created: {new Date(invoice.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <DollarSign className="size-5 text-gray-500" />
              Payment Details
            </h3>
            <div className="pl-7">
              <p className="text-sm font-medium">
                Total:{" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(parseFloat(invoice.total) || 0)}
              </p>
              <div className="mt-1">
                <Badge
                  variant={
                    invoice.status === "paid"
                      ? "success"
                      : invoice.status === "sent"
                        ? "warning"
                        : "default"
                  }
                >
                  {invoice.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Optional Informaion Data */}
          {/* <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="size-5 text-gray-500" />
              Timestamps
            </h3>
            <div className="pl-7">
              <p className="text-sm text-gray-600">
                Created: {new Date(invoice.created_at).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Updated: {new Date(invoice.updated_at).toLocaleString()}
              </p>
            </div>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
