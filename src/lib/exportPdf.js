import jsPDF from "jspdf";

export function exportPengajuanPdf({ pengajuan, invoice }) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Detail Pengajuan", 10, 15);
  doc.setFontSize(12);
  doc.text(`ID: ${pengajuan.id}`, 10, 25);
  doc.text(`Destinasi: ${pengajuan.destination}`, 10, 35);
  doc.text(`Tanggal Berangkat: ${pengajuan.departure_date}`, 10, 45);
  doc.text(`Tanggal Pulang: ${pengajuan.return_date}`, 10, 55);
  doc.text(`Peserta: ${pengajuan.participants}`, 10, 65);
  doc.text(`Status: ${pengajuan.status}`, 10, 75);
  doc.text(`Diajukan pada: ${pengajuan.created_at}`, 10, 85);

  if (invoice) {
    doc.setFontSize(14);
    doc.text("Invoice", 10, 100);
    doc.setFontSize(12);
    doc.text(`Total: ${invoice.total || "-"}`, 10, 110);
    doc.text(`Status: ${invoice.status || "-"}`, 10, 120);
    // Tambahkan detail invoice lain sesuai kebutuhan
  }

  doc.save(`pengajuan_${pengajuan.id}.pdf`);
} 