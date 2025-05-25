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
      .then((res) => res.data) // Changed this line to directly return res.data
      .catch((error) => {
        if (error.response?.status === 401) {
          router.push("/login");
          return [];
        }
        setError("Failed to fetch bookings");
        console.error("Error fetching bookings:", error);
        return [];
      }),
  );

  const addBookingdes = async (data) => {
    try {
      setLoading(true);
      const form = new FormData();
      form.append("user_id", data.user_id);
      form.append("destination_id", data.destination_id);
      form.append("vehicle_id", data.vehicle_id);
      form.append("booking_date", data.booking_date);
      form.append("jumlah_penumpang", data.jumlah_penumpang);
      form.append("total_price", data.total_price);

      await axios.post("/api/bookingdes", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      mutate();
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
      await axios.put(`/api/bookingdes/${id}`, data); // Changed from post to put, simplified data sending
      await mutate(); // Make sure to await the mutate
      setSuccess("Booking berhasil diperbarui");
      return true;
    } catch (error) {
      setError(error.response?.data?.message || "Gagal memperbarui booking");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteBookingdes = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/bookingdes/${id}`);
      mutate();
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
    deleteBookingdes,
    clearMessages,
  };
};
