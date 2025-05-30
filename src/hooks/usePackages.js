import useSWR from "swr";
import axios from "@/lib/axios";

export function usePackages() {
  const { data, error, isLoading, mutate } = useSWR("/api/packages/", (url) =>
    axios.get(url).then((res) => res.data.packages),
  );

  const createPackage = async (payload) => {
    try {
      await axios.post("/api/packages/", payload);
      mutate();
    } catch (error) {
      console.log("Create Error:", error);
      throw error;
    }
  };

  const updatePackage = async (id, payload) => {
    try {
      await axios.post(`/api/packages/${id}?_method=PUT`, payload);
      mutate();
    } catch (error) {
      console.log("Update Error:", error);
      throw error;
    }
  };

  const deletePackage = async (id) => {
    try {
      await axios.delete(`/api/packages/${id}`);
      mutate();
    } catch (error) {
      console.log("Delete Error:", error);
      throw error;
    }
  };

  return {
    packages: data,
    isLoading,
    isError: error,
    mutate,
    createPackage,
    updatePackage,
    deletePackage,
  };
}
