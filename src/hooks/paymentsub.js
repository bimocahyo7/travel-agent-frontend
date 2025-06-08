import { useState, useEffect } from "react";
import axios from "@/lib/axios";

export function usePaymentsub() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const { data } = await axios.get("/api/notifications/paymentsub");
    setNotifications(data);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const deleteNotification = async (id) => {
    await axios.delete(`/api/paymentsub/${id}`);
    fetchNotifications(); // refresh data dari server
  };

  return { notifications, deleteNotification, fetchNotifications };
}