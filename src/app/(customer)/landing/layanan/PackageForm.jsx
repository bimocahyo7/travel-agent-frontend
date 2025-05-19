"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePackages } from '@/hooks/package';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PackageForm() {
    const router = useRouter();
    const { packages, loading } = usePackages();

    const [formData, setFormData] = useState({
        destination_id: "",
        passengerCount: 1,
    });

    const [packageResults, setPackageResults] = useState([]);
    const [isAvailable, setIsAvailable] = useState(false);
    const [searchResultModalOpen, setSearchResultModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const destination_id = formData.destination_id;
        const passengerCount = formData.passengerCount;

        try {
            const filteredPackages = packages?.filter(pkg => pkg.destination_id == destination_id);
            setIsAvailable(filteredPackages.length > 0);
            setPackageResults(filteredPackages);
            setSearchResultModalOpen(true);
        } catch (err) {
            setError("Terjadi kesalahan saat pencarian.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOrderNow = (packageId) => {
        if (packageId) localStorage.setItem('selectedPackageId', packageId);
        localStorage.setItem('passengerCount', formData.passengerCount);
        router.push("/booking-package");
    };

    return (
        <section className="w-full py-40 px-4">
            <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-cyan-700">
                    Pilih Paket Tiket Perjalanan
                </h2>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSearch}>
                    <div className="flex flex-col gap-1">
                        <select
                            name="destination_id"
                            className="w-full border rounded px-3 py-2"
                            required
                            value={formData.destination_id}
                            onChange={(e) => setFormData({ ...formData, destination_id: e.target.value })}
                        >
                            <option value="">Paket Tujuan Yang Tersedia</option>
                            {packages?.map((pkg) => (
                                <option key={pkg.id} value={pkg.destination_id}>
                                    {pkg.name} - {pkg.destination?.location ?? "Lokasi tidak ditemukan"}
                                </option>
                            ))}
                        </select>

                    </div>

                    <Input
                        placeholder="Jumlah Penumpang"
                        type="number"
                        min="1"
                        name="passenger_count"
                        value={formData.passengerCount}
                        onChange={(e) => setFormData({ ...formData, passengerCount: e.target.value })}
                    />

                    <div className="md:col-span-2">
                        <Button
                            type="submit"
                            className="w-full bg-cyan-700 hover:bg-cyan-600"
                            disabled={isLoading || loading}
                        >
                            {isLoading || loading ? "Mencari..." : "Cari Tiket"}
                        </Button>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                </form>
            </div>

            {searchResultModalOpen && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-lg relative">
                        <h3 className="text-lg font-bold text-cyan-700 mb-4">Ringkasan Pencarian</h3>
                        <ul className="space-y-2 text-sm">
                            <li><strong>Tujuan:</strong> {formData.destination_id}</li>
                            <li><strong>Jumlah Penumpang:</strong> {formData.passengerCount}</li>
                        </ul>

                        <div className="mt-4 space-y-4">
                            {isAvailable ? (
                                <>
                                    <p className="text-green-600 font-semibold">✅ Tiket tersedia!</p>
                                    {packageResults.map((pkg) => (
                                        <div key={pkg.id} className="border p-3 rounded mb-2">
                                            <h4 className="font-semibold">{pkg.name}</h4>
                                            <p className="text-sm">{pkg.duration}</p>
                                            <p className="text-sm">{pkg.description}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="font-bold text-green-700">
                                                    Rp {pkg.price.toLocaleString('id-ID')}
                                                </span>
                                                <Button
                                                    onClick={() => handleOrderNow(pkg.id)}
                                                    className="bg-emerald-600 hover:bg-emerald-500"
                                                    size="sm"
                                                >
                                                    Pesan
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <p className="text-red-600 font-semibold">❌ Tiket tidak ditemukan</p>
                            )}
                        </div>

                        <button
                            type="button"
                            className="absolute top-2 right-3 text-gray-500 hover:text-red-500"
                            onClick={() => setSearchResultModalOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
