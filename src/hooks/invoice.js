import useSWR from "swr";
import axios from "@/lib/axios";

export const useInvoice = (pengajuanId) => {
  const shouldFetch = !!pengajuanId;
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/invoice/by-pengajuan/${pengajuanId}` : null,
    async (url) => {
      const res = await axios.get(url);
      // Handle kemungkinan struktur data
      if (res.data?.invoice) return res.data.invoice;
      if (res.data?.data) return res.data.data;
      return res.data;
    }
  );

  return {
    invoice: data,
    loading: isLoading,
    error,
    mutate,
  };
};
