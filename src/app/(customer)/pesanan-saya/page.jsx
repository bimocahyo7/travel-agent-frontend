"use client";

import { useState } from "react";
import { useBooking } from "@/hooks/booking";
import { useBookingdes } from "@/hooks/bookingdes";
import { usePengajuan } from "@/hooks/pengajuan";
import PengajuanItem from "@/components/customer/pengajuan/PengajuanItem";
import { Button } from "@/components/ui/button";
import {
  Package as PackageIcon,
  Map as MapIcon,
  ClipboardList,
  Wallet,
  BadgeCheck,
  CalendarCheck2,
  Users,
  FileText,
  CreditCard,
  Plane,
  Hotel,
  Car,
  File,
  Bell,
  Info,
  Sparkles,
  User as UserIcon,
  MapPin,
  Star,
  ArrowRight,
  BookOpen,
  LifeBuoy,
} from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { useDestination } from "@/hooks/destination";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import HeaderPersonal from "@/components/customer/pesanan-saya/HeaderPersonal";
import BookingSummary from "@/components/customer/pesanan-saya/BookingSummary";
import QuickActions from "@/components/customer/pesanan-saya/QuickActions";

const STATUS_LABELS = {
    pending: "Menunggu Konfirmasi",
    confirmed: "Dikonfirmasi",
    completed: "Selesai",
    cancelled: "Dibatalkan",
    menunggu_konfirmasi: "Menunggu Konfirmasi",
    menunggu_persetujuan: "Menunggu Persetujuan",
    disetujui: "Disetujui",
    dalam_perjalanan: "Dalam Perjalanan",
    menunggu_pembayaran: "Menunggu Pembayaran",
    lunas: "Lunas",
    ditolak: "Ditolak",
};

const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    confirmed: "bg-blue-100 text-blue-700 border-blue-300",
    completed: "bg-green-100 text-green-700 border-green-300",
    cancelled: "bg-red-100 text-red-700 border-red-300",
    menunggu_konfirmasi: "bg-gray-100 text-gray-600 border-gray-300",
    menunggu_persetujuan: "bg-yellow-100 text-yellow-700 border-yellow-300",
    disetujui: "bg-green-100 text-green-700 border-green-300",
    dalam_perjalanan: "bg-blue-100 text-blue-700 border-blue-300",
    menunggu_pembayaran: "bg-orange-100 text-orange-700 border-orange-300",
    lunas: "bg-green-200 text-green-800 border-green-400",
    ditolak: "bg-red-100 text-red-700 border-red-300",
};

const CARD_GRADIENTS = [
    "from-cyan-500 to-blue-500",
    "from-amber-400 to-orange-500",
    "from-violet-500 to-fuchsia-500",
    "from-green-400 to-emerald-500",
];

const CARD_ICONS = [
    <PackageIcon className="w-7 h-7" />, // Booking Package
    <MapIcon className="w-7 h-7" />, // Booking Destination
    <ClipboardList className="w-7 h-7" />, // Pengajuan
    <Wallet className="w-7 h-7" />, // Pengeluaran
];

function getImageUrl(obj, type) {
    // type: 'package' | 'destination'
    if (type === "package") {
        if (obj.package?.image)
            return (
                obj.package.image_url ||
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/images/${obj.package.image}`
            );
    }
    if (type === "destination") {
        if (obj.destination?.image)
            return (
                obj.destination.image_url ||
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/images/${obj.destination.image}`
            );
    }
    return "/images/default.jpg";
}

export default function PesananSayaPage() {
    const [activeTab, setActiveTab] = useState("package");
    const [search, setSearch] = useState("");
    const [pagePackage, setPagePackage] = useState(1);
    const [pageDestination, setPageDestination] = useState(1);
    const [pagePengajuan, setPagePengajuan] = useState(1);
    const itemsPerPage = 5;

    const { bookings = [], loading: loadingPackage } = useBooking();
    const { bookingdes = [], loading: loadingDestination } = useBookingdes();
    const { pengajuans = [], loading: loadingPengajuan } = usePengajuan();
    const { user, error: userError } = useAuth({ middleware: "auth" });
    const { destinations = [], loading: loadingDest } = useDestination();

    // Gabungkan bookings dan bookingdes, filter yang status aktif dan tanggal >= hari ini
    const today = new Date();
    const allBookings = [
        ...bookings.map(b => ({
            ...b,
            type: "package",
            name: b.package?.name,
            date: b.booking_date,
            status: b.status,
        })),
        ...bookingdes.map(b => ({
            ...b,
            type: "destination",
            name: b.destination?.name,
            date: b.booking_date,
            status: b.status,
        })),
    ];
    const upcoming = allBookings
        .filter(b => b.status === "confirmed" && new Date(b.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    const nextTrip = upcoming[0];

    // Filter & Pagination
    const filteredBookings = bookings.filter(
        (booking) =>
            booking.package?.name?.toLowerCase().includes(search.toLowerCase()) ||
            booking.status?.toLowerCase().includes(search.toLowerCase())
    );
    const totalPagesPackage = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = filteredBookings.slice(
        (pagePackage - 1) * itemsPerPage,
        pagePackage * itemsPerPage
    );

    const filteredBookingdes = bookingdes.filter(
        (booking) =>
            booking.destination?.name?.toLowerCase().includes(search.toLowerCase()) ||
            booking.status?.toLowerCase().includes(search.toLowerCase())
    );
    const totalPagesDestination = Math.ceil(filteredBookingdes.length / itemsPerPage);
    const paginatedBookingdes = filteredBookingdes.slice(
        (pageDestination - 1) * itemsPerPage,
        pageDestination * itemsPerPage
    );

    const filteredPengajuans = pengajuans.filter(
        (pengajuan) =>
            (pengajuan.destination || "").toLowerCase().includes(search.toLowerCase()) ||
            (pengajuan.status || "").toLowerCase().includes(search.toLowerCase())
    );
    const totalPagesPengajuan = Math.ceil(filteredPengajuans.length / itemsPerPage);
    const paginatedPengajuans = filteredPengajuans.slice(
        (pagePengajuan - 1) * itemsPerPage,
        pagePengajuan * itemsPerPage
    );

    // Reset page ke 1 untuk tab aktif jika search berubah
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        if (activeTab === "package") setPagePackage(1);
        if (activeTab === "destination") setPageDestination(1);
        if (activeTab === "pengajuan") setPagePengajuan(1);
    };

    // Saat ganti tab, page tetap diingat
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Payment handler (dummy)
    const handlePayment = (type, bookingId) => {
        alert(`Fitur payment untuk booking ${type} dengan ID ${bookingId} belum tersedia.`);
    };

    // --- Notifikasi ---
    // Reminder pembayaran: booking status 'confirmed' (package/destination)
    const paymentReminders = [
        ...bookings.filter((b) => b.status === "confirmed"),
        ...bookingdes.filter((b) => b.status === "confirmed"),
    ];
    // Status update: pengajuan yang baru disetujui/ditolak
    const statusUpdates = pengajuans.filter((p) => ["disetujui", "ditolak"].includes(p.status));

    // --- Rekomendasi Destinasi ---
    // Ambil destinasi yang pernah dibooking user (dari bookingdes), urutkan berdasarkan jumlah booking
    const userHistoryDestIds = bookingdes.map((b) => b.destination?.id).filter(Boolean);
    const destCount = userHistoryDestIds.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
    }, {});
    // Urutkan id destinasi berdasarkan frekuensi booking
    const sortedDestIds = Object.entries(destCount)
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => Number(id));
    // Ambil destinasi rekomendasi dari histori, jika tidak ada, ambil destinasi populer
    let recommendedDest = [];
    if (sortedDestIds.length > 0) {
        recommendedDest = sortedDestIds
            .map((id) => destinations.find((d) => d.id === id))
            .filter(Boolean)
            .slice(0, 3);
    }
    if (recommendedDest.length < 3) {
        // Tambah destinasi populer jika rekomendasi kurang dari 3
        const popular = destinations
            .filter((d) => !recommendedDest.some((r) => r.id === d.id))
            .slice(0, 3 - recommendedDest.length);
        recommendedDest = [...recommendedDest, ...popular];
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            {/* Header Personal */}
            <div className="mb-8">
                <HeaderPersonal user={user} />
            </div>
            {/* 2 Column Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* Booking Summary */}
                <BookingSummary bookings={bookings} bookingdes={bookingdes} pengajuans={pengajuans} />
                {/* Quick Actions */}
                <QuickActions />
            </div>
            {/* Section Anchor for Quick Actions */}
            <div id="pesanan-saya-section" />
        </div>
    );
}