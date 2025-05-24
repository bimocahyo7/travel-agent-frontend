import React from "react";

export default function InvoiceModal({ open, onClose, onSubmit, invoiceData, setInvoiceData, pengajuan }) {
  if (!open || !pengajuan) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-0">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Buat Invoice</h2>
        <div className="mb-4 space-y-1 text-sm">
          <div><b>Institusi:</b> {pengajuan.institution}</div>
          <div><b>Nama Pemohon:</b> {pengajuan.applicant}</div>
          <div><b>Email:</b> {pengajuan.email}</div>
          <div><b>Lokasi:</b> {pengajuan.destination_id}</div>
          <div><b>Jenis Kendaraan:</b> {pengajuan.vehicle_id}</div>
          <div><b>Tanggal Berangkat:</b> {pengajuan.departure_date}</div>
          <div><b>Tanggal Pulang:</b> {pengajuan.return_date}</div>
          <div><b>Jumlah Peserta:</b> {pengajuan.participants}</div>
          <div><b>Notes:</b> {pengajuan.notes || '-'}</div>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="mb-2">
            <label className="block text-sm font-semibold">Harga (Rp)</label>
            <input
              type="number"
              className="border rounded px-2 py-1 w-full"
              value={invoiceData.amount}
              onChange={e => setInvoiceData({ ...invoiceData, amount: e.target.value })}
              required
              min={0}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-3 py-1 rounded bg-gray-300"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-blue-500 text-white"
            >
              Buat Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
