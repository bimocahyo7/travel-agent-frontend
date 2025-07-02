import jsPDF from "jspdf";

function formatTanggalIndo(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function hitungDurasiHari(tglBerangkat, tglKembali) {
  if (!tglBerangkat || !tglKembali) return "-";
  const tgl1 = new Date(tglBerangkat);
  const tgl2 = new Date(tglKembali);
  const diff = Math.round((tgl2 - tgl1) / (1000 * 60 * 60 * 24)) + 1;
  return diff > 0 ? diff : "-";
}

export function generatePengajuanPdfDataUrl({ pengajuan, invoice }) {
  const doc = new jsPDF();

  // Tambahkan watermark LUNAS jika status pengajuan lunas
  if (pengajuan?.status === "lunas") {
    doc.saveGraphicsState();
    doc.setFontSize(60);
    doc.setTextColor(0, 200, 83); // hijau muda
    doc.setFont("helvetica", "bold");
    doc.setGState(new doc.GState({ opacity: 0.15 }));
    doc.text("LUNAS", 105, 150, { align: "center", angle: -25 });
    doc.restoreGraphicsState();
  }

  // Header Travel Agent
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("TRIPNESIA", 15, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Jl. Tugu, Kec. Klojen, Kota Malang, Jawa Timur 65111", 15, 24);
  doc.text("Telp: +62 123 456 789 | Email: info@tripnesia.com", 15, 29);

  // Judul Invoice
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE PENGAJUAN", 105, 40, { align: "center" });

  // Garis pemisah
  doc.setLineWidth(0.7);
  doc.line(15, 44, 195, 44);

  // Info Pengajuan (tanpa garis kotak/grid)
  doc.setFontSize(11);
  let y = 52;
  doc.setFont("helvetica", "bold");
  doc.text("Informasi Pengajuan", 20, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text(`ID Pengajuan`, 20, y);
  doc.text(`: ${pengajuan?.id || "-"}`, 55, y);
  doc.text(`Instansi`, 110, y);
  doc.text(`: ${pengajuan?.institution || "-"}`, 140, y);
  y += 6;
  doc.text(`Pemohon`, 20, y);
  doc.text(`: ${pengajuan?.applicant || "-"}`, 55, y);
  doc.text(`Tujuan`, 110, y);
  doc.text(`: ${pengajuan?.destination || "-"}`, 140, y);
  y += 6;
  doc.text(`Tanggal Berangkat`, 20, y);
  doc.text(`: ${formatTanggalIndo(pengajuan?.departure_date)}`, 55, y);
  doc.text(`Tanggal Kembali`, 110, y);
  doc.text(`: ${formatTanggalIndo(pengajuan?.return_date)}`, 140, y);
  y += 6;
  doc.text(`Peserta`, 20, y);
  doc.text(`: ${pengajuan?.participants || "-"}`, 55, y);
  if (pengajuan?.status) {
    doc.text(`Status`, 110, y);
    doc.text(`: ${pengajuan.status}`, 140, y);
  }
  y += 10;

  // Tabel Item: Tujuan, Durasi, Harga
  doc.setFontSize(11);
  doc.setFillColor(0, 0, 0);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");

  // Header tabel dengan garis
  doc.rect(15, y, 180, 8, "F");
  doc.text("Tujuan", 25, y + 6);
  doc.text("Durasi (hari)", 105, y + 6, { align: "center" });
  doc.text("Harga", 190, y + 6, { align: "right" });
  y += 10;

  // Garis pemisah header dan konten
  // doc.setDrawColor(200,200,200);
  // doc.line(15, y, 195, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  // Data item dengan garis
  const tujuan = pengajuan?.destination || "-";
  const durasi = hitungDurasiHari(
    pengajuan?.departure_date,
    pengajuan?.return_date,
  );
  const harga =
    invoice?.total !== undefined
      ? `Rp ${invoice.total.toLocaleString("id-ID", { minimumFractionDigits: 2 })}`
      : "-";

  // Konten tabel
  doc.text(tujuan, 25, y);
  doc.text(String(durasi), 105, y, { align: "center" });
  doc.text(harga, 190, y, { align: "right" });
  y += 10;

  // Garis pemisah konten dan total
  // doc.line(15, y, 195, y);
  // y += 1;

  // Total dengan garis
  doc.setFont("helvetica", "bold");
  doc.text("Total", 140, y, { align: "center" });
  doc.text(harga, 190, y, { align: "right" });
  y += 10;

  // Ucapan terima kasih abu-abu di kiri bawah
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Terima kasih telah menggunakan layanan Travel Agent Indonesia.",
    15,
    y,
  );
  y += 5;
  doc.text("Struk ini sah tanpa tanda tangan.", 15, y);
  doc.setTextColor(0, 0, 0);

  // Return a data URL for preview
  return doc.output("dataurlstring");
}

export function downloadPdfFromDataUrl(dataUrl, filename = "pengajuan.pdf") {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportPengajuanPdf({ pengajuan, invoice }) {
  const dataUrl = generatePengajuanPdfDataUrl({ pengajuan, invoice });
  downloadPdfFromDataUrl(dataUrl, `pengajuan_${pengajuan.id}.pdf`);
}
