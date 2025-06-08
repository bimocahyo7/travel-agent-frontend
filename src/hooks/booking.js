import useSWR from "swr";
import axios from "@/lib/axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const useBooking = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: bookings, mutate } = useSWR("/api/bookings", () =>
    axios
      .get("/api/bookings")
      .then((res) => res.data) // Changed this line to directly return res.data
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

  const addBooking = async (data) => {
    try {
      setLoading(true);
      const form = new FormData();
      form.append("user_id", data.user_id);
      form.append("package_id", data.package_id);
      form.append("vehicle_id", data.vehicle_id);
      form.append("booking_date", data.booking_date);
      form.append("jumlah_penumpang", data.jumlah_penumpang);
      form.append("total_price", data.total_price);

      await axios.post("/api/bookings", form, {
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

  const updateBooking = async (id, data) => {
    try {
      setLoading(true);
      await axios.put(`/api/bookings/${id}`, data); // Changed from post to put, simplified data sending
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

  const deleteBooking = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/bookings/${id}`);
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
    bookings,
    loading,
    error,
    success,
    addBooking,
    updateBooking,
    deleteBooking,
    clearMessages,
  };
};