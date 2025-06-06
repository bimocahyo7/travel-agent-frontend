import useSWR from "swr";
import axios from "@/lib/axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const useBookingdes = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: bookingdes, mutate } = useSWR("/api/bookingdes", () =>
    axios
      .get("/api/bookingdes")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response?.status === 401) {
          router.push("/login");
          return [];
        }
        setError("Failed to fetch bookings");
        console.error("Error fetching bookings:", error);
        return [];
      })
  );

  const addBookingdes = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/bookingdes", {
        user_id: data.user_id,
        destination_id: data.destination_id,
        vehicle_id: data.vehicle_id,
        booking_date: data.booking_date,
        jumlah_penumpang: data.jumlah_penumpang,
        total_price: data.total_price,
      });

      await mutate();
      setSuccess("Booking berhasil ditambahkan");
      return true;
    } catch (error) {
      setError(error.response?.data?.message || "Gagal menambahkan booking");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateBookingdes = async (id, data) => {
    try {
      setLoading(true);
      await axios.put(`/api/bookingdes/${id}`, {
        user_id: data.user_id,
        destination_id: data.destination_id,
        vehicle_id: data.vehicle_id,
        booking_date: data.booking_date,
        jumlah_penumpang: data.jumlah_penumpang,
        total_price: data.total_price,
        status: data.status, // Added status field for admin
      });
      await mutate();
      setSuccess("Booking berhasil diperbarui");
      return true;
    } catch (error) {
      setError(error.response?.data?.message || "Gagal memperbarui booking");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      setLoading(true);
      const currentBooking = bookingdes.find((booking) => booking.id === id);
      if (!currentBooking) throw new Error("Booking tidak ditemukan");

      await axios.put(`/api/bookingdes/${id}`, {
        ...currentBooking,
        status: status,
      });
      await mutate();
      setSuccess(`Status booking berhasil diubah menjadi ${status}`);
      return true;
    } catch (error) {
      setError(
        error.response?.data?.message || "Gagal mengubah status booking"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getBookingById = async (id) => {
    try {
      const response = await axios.get(`/api/bookingdes/${id}`);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Gagal mendapatkan detail booking");
      return null;
    }
  };

  const deleteBookingdes = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/bookingdes/${id}`);
      await mutate();
      setSuccess("Booking berhasil dihapus");
      return true;
    } catch (error) {
      setError(error.response?.data?.message || "Gagal menghapus booking");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return {
    bookingdes,
    loading,
    error,
    success,
    addBookingdes,
    updateBookingdes,
    updateBookingStatus,
    getBookingById,
    deleteBookingdes,
    clearMessages,
  };
};
