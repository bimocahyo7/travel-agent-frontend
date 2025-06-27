import { z } from "zod";

export const requestFormSchema = z.object({
  institution: z
    .string()
    .min(15, "Nama institusi harus minimal 12 karakter")
    .max(100, "Nama institusi tidak boleh lebih dari 100 karakter"),
  applicant: z
    .string()
    .min(10, "Nama pemohon harus minimal 10 karakter")
    .max(50, "Nama pemohon tidak boleh lebih dari 50 karakter")
    .regex(/^[a-zA-Z\s]*$/, "Nama pemohon hanya boleh berisi huruf dan spasi"),
  email: z
    .string()
    .email("Format email tidak valid")
    .min(1, "Email wajib diisi"),
  destination: z.string().min(1, "Silakan pilih tujuan perjalanan"),
  vehicle: z.string().min(1, "Silakan pilih jenis kendaraan"),
  departureDate: z.string().min(1, "Silakan pilih tanggal keberangkatan"),
  returnDate: z.string().min(1, "Silakan pilih tanggal kepulangan"),
  participants: z
    .string()
    .min(1, "Jumlah peserta wajib diisi")
    .refine((val) => parseInt(val) > 0, "Jumlah peserta minimal 1")
    .refine((val) => parseInt(val) <= 50, "Jumlah peserta maksimal 50"),
  notes: z
    .string()
    .max(500, "Keterangan tidak boleh lebih dari 500 karakter")
    .optional(),
});
