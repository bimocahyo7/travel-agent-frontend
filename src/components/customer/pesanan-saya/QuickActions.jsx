import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Package as PackageIcon, Map as MapIcon, ClipboardList } from "lucide-react";

export default function QuickActions() {
    return (
        <div id="quick-actions-section" className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3 h-full border border-gray-200">
            <div className="font-semibold text-lg flex items-center gap-2 mb-4 text-black">
                <BookOpen className="w-5 h-5 text-black" /> Quick Actions
            </div>
            <Link href="/pesanan-saya/booking-package" passHref legacyBehavior>
                <Button
                    asChild
                    className="font-semibold text-base flex items-center gap-2 w-full bg-black text-white border border-gray-300 hover:bg-gray-900"
                    size="lg"
                >
                    <span><PackageIcon className="w-5 h-5" /> Booking Package</span>
                </Button>
            </Link>
            <Link href="/pesanan-saya/booking-destination" passHref legacyBehavior>
                <Button
                    asChild
                    className="font-semibold text-base flex items-center gap-2 w-full bg-black text-white border border-gray-300 hover:bg-gray-900"
                    size="lg"
                >
                    <span><MapIcon className="w-5 h-5" /> Booking Destination</span>
                </Button>
            </Link>
            <Link href="/pesanan-saya/pengajuan" passHref legacyBehavior>
                <Button
                    asChild
                    className="font-semibold text-base flex items-center gap-2 w-full bg-black text-white border border-gray-300 hover:bg-gray-900"
                    size="lg"
                >
                    <span><ClipboardList className="w-5 h-5" /> Pengajuan</span>
                </Button>
            </Link>
        </div>
    );
} 