"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { columns } from "./columns";
import { useState } from "react";
import { useVehicle } from "@/hooks/vehicle";
import InvoiceModal from "../InvoiceModal";
import BarcodeSendModal from "../BarcodeSendModal";
import PaymentModal from "../PaymentModal";
import DetailPengajuanModal from "../DetailPengajuanModal";

export function DataTable({ data, isLoading }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const { vehicles } = useVehicle();

  // Tambahkan state untuk modal invoice
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedInvoiceData, setSelectedInvoiceData] = useState(null);

  // Tambahkan state untuk modal barcode
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [selectedPengajuanId, setSelectedPengajuanId] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // State for detail modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPengajuanDetail, setSelectedPengajuanDetail] = useState(null);

  // Handler untuk show invoice
  const handleShowInvoice = (rowData) => {
    setSelectedInvoiceData(rowData);
    setInvoiceModalOpen(true);
  };

  const handleShowBarcodeModal = (pengajuanId) => {
    setSelectedPengajuanId(pengajuanId);
    setBarcodeModalOpen(true);
  };

  const handleShowPaymentModal = (pengajuanId) => {
    setSelectedPengajuanId(pengajuanId);
    setPaymentModalOpen(true);
  };

  // Handler for detail modal
  const handleShowDetailModal = (rowData) => {
    // Find the vehicle type
    const vehicle = vehicles?.find((v) => v.id === rowData.vehicle_id);
    setSelectedPengajuanDetail({ ...rowData, vehicle_type: vehicle ? vehicle.type : rowData.vehicle_id });
    setDetailModalOpen(true);
  };

  const table = useReactTable({
    data,
    columns: columns({ vehicles, onShowInvoice: handleShowInvoice, onShowBarcode: handleShowBarcodeModal }),
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

  return (
    <div className="w-full">
      <div className="flex items-center py-3 gap-2">
        {/* Search Bar */}
        <Input
          placeholder="Filter institution..."
          value={table.getColumn("institution")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("institution")?.setFilterValue(event.target.value)
          }
          className="max-w-sm border-2 border-slate-400"
        />
        {/* Button Add Pengajuan (optional, implement if needed) */}
        {/* <AddPengajuanDialog /> */}
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
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* Loading data from fetch API */}
          {isLoading ? (
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center font-semibold text-base"
                >
                  Loading data...
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
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
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                    {/* Button for detail modal */}
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleShowDetailModal(row.original)}>
                        Detail
                      </Button>
                    </TableCell>
                    {row.original.status === "menunggu_pembayaran" && (
                      <TableCell>
                        {/* <Button onClick={() => handleShowPaymentModal(row.original.id)}>
                          Pembayaran
                        </Button> */}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
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
      <InvoiceModal
        open={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        invoiceData={selectedInvoiceData}
      />
      <BarcodeSendModal
        open={barcodeModalOpen}
        onClose={() => setBarcodeModalOpen(false)}
        pengajuanId={selectedPengajuanId}
      />
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        pengajuanId={selectedPengajuanId}
      />
      <DetailPengajuanModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        pengajuanData={selectedPengajuanDetail}
      />
    </div>
  );
}
