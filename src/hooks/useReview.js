import useSWR from "swr";
import axios from "@/lib/axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const useReview = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    data: reviews,
    mutate,
    isLoading,
  } = useSWR("/api/reviews", () =>
    axios
      .get("/api/reviews")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response?.status === 401) {
          router.push("/login");
          return [];
        }
        setError("Failed to fetch reviews");
        console.error("Error fetching reviews:", error);
        return [];
      }),
  );

  // Add a new review
  const addReview = async (reviewData) => {
    try {
      const response = await axios.post("/api/reviews", reviewData);
      setSuccess("Review added successfully");
      mutate();
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login");
        return null;
      }
      setError(error.response?.data?.message || "Failed to add review");
      return null;
    }
  };

  // Update an existing review
  const updateReview = async (id, reviewData) => {
    try {
      const response = await axios.put(`/api/reviews/${id}`, reviewData);
      setSuccess("Review updated successfully");
      mutate();
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login");
        return null;
      }
      setError(error.response?.data?.message || "Failed to update review");
      return null;
    }
  };

  // Delete a review
  const deleteReview = async (id) => {
    try {
      await axios.delete(`/api/reviews/${id}`);
      setSuccess("Review deleted successfully");
      mutate();
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login");
        return false;
      }
      setError(error.response?.data?.message || "Failed to delete review");
      return false;
    }
  };

  // Get a single review by ID
  const getReviewById = async (id) => {
    try {
      const response = await axios.get(`/api/reviews/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login");
        return null;
      }
      setError("Failed to fetch review details");
      console.error("Error fetching review details:", error);
      return null;
    }
  };

  // Clear messages
  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return {
    reviews,
    loading: isLoading,
    error,
    success,
    addReview,
    updateReview,
    deleteReview,
    getReviewById,
    clearMessages,
  };
};
