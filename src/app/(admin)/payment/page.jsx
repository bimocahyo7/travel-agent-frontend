"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { usePayment } from "@/hooks/payment";
import EditPaymentModal from "@/components/payment/EditPaymentModal";

export default function PaymentPage() {
  const router = useRouter();
  const { user } = useAuth({ middleware: 'auth' });
  const { payments, loading, error, success, updatePayment, setError, setSuccess } = usePayment();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPayment, setCurrentPayment] = useState({});
  
  const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Credit Card", "Debit Card", "E-Wallet"];
  const PAYMENT_STATUSES = ["pending", "completed", "failed"];

  const [formData, setFormData] = useState({
    booking_id: "",
    amount: "",
    payment_method: PAYMENT_METHODS[0],
    payment_date: "",
    status: PAYMENT_STATUSES[0],
    transaction_id: "",
    notes: ""
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditPayment = async (e) => {
    e && e.preventDefault();
    const data = { 
      ...formData, 
      amount: parseFloat(formData.amount),
      status: formData.status
    };
    const success = await updatePayment(currentPayment.id, data);
    if (success) {
      setShowEditModal(false);
      resetForm();
    }
  };

  const openEditModal = (payment) => {
    setCurrentPayment(payment);
    setFormData({
      booking_id: payment.booking_id,
      amount: payment.amount,
      payment_method: payment.payment_method,
      payment_date: payment.payment_date,
      status: payment.status === 'completed' ? 'completed' : payment.status,
      transaction_id: payment.transaction_id || "",
      notes: payment.notes || ""
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      booking_id: "",
      amount: "",
      payment_method: PAYMENT_METHODS[0],
      payment_date: "",
      status: PAYMENT_STATUSES[0],
      transaction_id: "",
      notes: ""
    });
  };

  return (
    <div className="ml-64 p-6 space-y-6">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Data Pembayaran</h1>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex justify-between items-center">
                <span>{error}</span>
                <button onClick={() => setError("")} className="ml-4 text-red-500">x</button>
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded flex justify-between items-center">
                <span>{success}</span>
                <button onClick={() => setSuccess("")} className="ml-4 text-green-500">x</button>
              </div>
            )}
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border px-4 py-2">#</th>
                      <th className="border px-4 py-2">No Booking</th>
                      <th className="border px-4 py-2">Total Pembayaran</th>
                      <th className="border px-4 py-2">Metode Pembayaran</th>
                      <th className="border px-4 py-2">Tanggal Pembayaran</th>
                      <th className="border px-4 py-2">Status</th>
                      <th className="border px-4 py-2">ID Transaksi</th>
                      <th className="border px-4 py-2">Catatan</th>
                      <th className="border px-4 py-2">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments && payments.length > 0 ? (
                      payments.map((payment, index) => (
                        <tr key={payment.id}>
                          <td className="border px-4 py-2">{index + 1}</td>
                          <td className="border px-4 py-2">{payment.booking_id}</td>
                          <td className="border px-4 py-2">Rp {payment.amount.toLocaleString()}</td>
                          <td className="border px-4 py-2">{payment.payment_method}</td>
                          <td className="border px-4 py-2">{new Date(payment.payment_date).toLocaleDateString('id-ID')}</td>
                          <td className="border px-4 py-2">
                            <span className={`px-2 py-1 rounded text-sm ${
                              payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {payment.status === 'completed' ? 'completed' : payment.status}
                            </span>
                          </td>
                          <td className="border px-4 py-2">{payment.transaction_id}</td>
                          <td className="border px-4 py-2">{payment.notes}</td>
                          <td className="border px-4 py-2">
                            <button
                              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                              onClick={() => openEditModal(payment)}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center py-4">No payments found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditPaymentModal
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleEditPayment}
          onClose={() => setShowEditModal(false)}
          loading={loading}
          paymentStatuses={PAYMENT_STATUSES}
        />
      )}
    </div>
  );
}