import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function PDFPreviewModal({ open, onClose, pdfDataUrl, onDownload }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[350px] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Preview PDF</DialogTitle>
        </DialogHeader>
        <div className="w-full h-[500px] border rounded overflow-hidden bg-slate-50 flex items-center justify-center">
          {pdfDataUrl ? (
            <iframe
              src={pdfDataUrl}
              title="PDF Preview"
              className="w-full h-full"
              frameBorder={0}
            />
          ) : (
            <span>Loading preview...</span>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Tutup</Button>
          <Button onClick={onDownload} disabled={!pdfDataUrl}>
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 