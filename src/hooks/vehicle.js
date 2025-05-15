import useSWR from "swr";
import axios from "@/lib/axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const useVehicle = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all vehicles
  const { data: vehicles, mutate } = useSWR("/api/vehicles", () =>
    axios
      .get("/api/vehicles")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response?.status === 401) {
          router.push("/login");
          return [];
        }
        setError("Failed to fetch vehicles");
        console.error("Error fetching vehicles:", error);
        return [];
      })
  );

  // Add a new vehicle
  const addVehicle = async (vehicleData) => {
    try {
      setLoading(true);
      await axios.post("/api/vehicles", vehicleData)
        .then(res => {
          setSuccess(res.data.message || "Vehicle added successfully");
        });
      mutate(); // Refresh the vehicles data
      setLoading(false);
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login");
        return false;
      }
      setError(error.response?.data?.message || "Failed to add vehicle");
      setLoading(false);
      return false;
    }
  };

  // Update an existing vehicle
  const updateVehicle = async (id, vehicleData) => {
    try {
      setLoading(true);
      await axios.put(`/api/vehicles/${id}`, vehicleData)
        .then(res => {
          setSuccess(res.data.message || "Vehicle updated successfully");
        });
      mutate(); // Refresh the vehicles data
      setLoading(false);
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login");
        return false;
      }
      setError(error.response?.data?.message || "Failed to update vehicle");
      setLoading(false);
      return false;
    }
  };

  // Delete a vehicle
  const deleteVehicle = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/vehicles/${id}`)
        .then(res => {
          setSuccess(res.data.message || "Vehicle deleted successfully");
        });
      mutate(); // Refresh the vehicles data
      setLoading(false);
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login");
        return false;
      }
      setError(error.response?.data?.message || "Failed to delete vehicle");
      setLoading(false);
      return false;
    }
  };

  // Get a single vehicle by ID
  const getVehicleById = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/vehicles/${id}`);
      setLoading(false);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login");
        return null;
      }
      setError("Failed to fetch vehicle details");
      console.error("Error fetching vehicle details:", error);
      setLoading(false);
      return null;
    }
  };

  // Clear messages
  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return {
    vehicles,
    loading,
    error,
    success,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicleById,
    clearMessages,
  };
};
