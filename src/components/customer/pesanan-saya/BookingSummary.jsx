import { ClipboardList, BadgeCheck, CreditCard } from "lucide-react";

export default function BookingSummary({ bookings, bookingdes, pengajuans }) {
    // Hitung total pengeluaran
    const totalPengeluaran = [...bookings, ...bookingdes].reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
    return (
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col h-full border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-lg flex items-center gap-2 text-black">
                    <ClipboardList className="w-5 h-5 text-black" /> Ringkasan Pesanan
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <BadgeCheck className="w-6 h-6 text-black" />
                    <div>
                        <div className="text-lg font-bold text-black">{bookings.length}</div>
                        <div className="text-gray-600 text-sm">Booking Paket</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <BadgeCheck className="w-6 h-6 text-black" />
                    <div>
                        <div className="text-lg font-bold text-black">{bookingdes.length}</div>
                        <div className="text-gray-600 text-sm">Booking Destinasi</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <ClipboardList className="w-6 h-6 text-black" />
                    <div>
                        <div className="text-lg font-bold text-black">{pengajuans?.length || 0}</div>
                        <div className="text-gray-600 text-sm">Pengajuan</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-black" />
                    <div>
                        <div className="text-lg font-bold text-black">Rp {totalPengeluaran.toLocaleString("id-ID")}</div>
                        <div className="text-gray-600 text-sm">Total Pengeluaran</div>
                    </div>
                </div>
            </div>
        </div>
    );
} 