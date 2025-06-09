"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/auth";
import { getPaymentColumns } from "./columns";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BookingDetailModal from "../BookingDetailModal";
import jsPDF from "jspdf";
import PDFPreviewModal from "../PDFPreviewModal";
import { generateCustomPDF } from "../CustomPDFGenerator";

export function DataTable({ data, isLoading }) {
  const [sorting, setSorting] = useState([]);
  const { getUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleShowBookingDetail = (booking) => {
    setSelectedBooking(booking);
    setDetailModalOpen(true);
  };

  const handleExportPDF = async (payment) => {
    // Generate kode paten invoice seperti di tabel
    const id = payment.id || '-';
    const date = payment.payment_date || payment.createdAt;
    let patentCode = '/';
    if (date && id) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      patentCode = `${year}${month}/${id}`;
    }
    // Siapkan data sesuai struktur CustomPDFGenerator
    const dataPDF = {
      kepada: payment.user_id || '-',
      tglAcara: payment.payment_date || '-',
      noInvoice: patentCode,
      layanan: [
        {
          nama: 'Pembayaran',
          harga: String(payment.amount || '-'),
          total: String(payment.amount || '-')
        }
      ],
      pembayaran: {
        nama: payment.user_id || '-',
        norek: '-', // Ganti jika ada data rekening
      },
      ringkasan: {
        total: String(payment.amount || '-'),
        disc: '-',
        dp: '-',
        sisa: '-',
      },
    };
    try {
      const pdfUrl = await generateCustomPDF(dataPDF);
      setPdfDataUrl(pdfUrl);
      setPdfFileName(`payment_${payment.booking_id}.pdf`);
      setPdfPreviewOpen(true);
    } catch (e) {
      console.error("Error generate PDF:", e);
      alert("Gagal generate PDF");
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfDataUrl) return;
    const link = document.createElement("a");
    link.href = pdfDataUrl;
    link.download = pdfFileName || "payment.pdf";
    link.click();
  };

  const columns = useMemo(() => getPaymentColumns(users, handleShowBookingDetail, handleExportPDF), [users]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-3 gap-2">
        <Input
          placeholder="Filter customer..."
          value={table.getColumn("user_id")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("user_id")?.setFilterValue(event.target.value)
          }
          className="max-w-sm border-2 border-slate-400"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <BookingDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        bookingId={selectedBooking?.booking_id}
      />
      <PDFPreviewModal
        open={pdfPreviewOpen}
        onClose={() => setPdfPreviewOpen(false)}
        pdfDataUrl={pdfDataUrl}
        onDownload={handleDownloadPDF}
      />
    </div>
  );
}
