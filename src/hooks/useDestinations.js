import useSWR from "swr";
import axios from "@/lib/axios";

export function useDestinations() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/destinations/",
    (url) => axios.get(url).then((res) => res.data.destinations),
  );

  const createDestination = async (payload) => {
    try {
      await axios.post("/api/destinations/", payload);
      mutate();
    } catch (error) {
      console.log("Create Error:", error);
      throw error;
    }
  };

  const updateDestination = async (id, payload) => {
    try {
      await axios.post(`/api/destinations/${id}?_method=PUT`, payload);
      mutate();
    } catch (error) {
      console.log("Update Error:", error);
      throw error;
    }
  };

  const deleteDestination = async (id) => {
    try {
      await axios.delete(`/api/destinations/${id}`);
      mutate();
    } catch (error) {
      console.log("Delete Error:", error);
      throw error;
    }
  };

  return {
    destinations: data,
    isLoading,
    isError: error,
    mutate,
    createDestination,
    updateDestination,
    deleteDestination,
  };
}
