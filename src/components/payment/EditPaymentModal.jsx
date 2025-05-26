import React from "react";

export default function EditPaymentModal({ 
  formData, 
  onChange, 
  onSubmit, 
  onClose, 
  loading,
  paymentStatuses 
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Status Pembayaran</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Booking ID</label>
            <input
              type="text"
              name="booking_id"
              value={formData.booking_id || ''}
              className="w-full p-2 border rounded bg-gray-100"
              readOnly
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount || ''}
              className="w-full p-2 border rounded bg-gray-100"
              readOnly
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Payment Method</label>
            <input
              type="text"
              name="payment_method"
              value={formData.payment_method || ''}
              className="w-full p-2 border rounded bg-gray-100"
              readOnly
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Payment Date</label>
            <input
              type="date"
              name="payment_date"
              value={formData.payment_date || ''}
              className="w-full p-2 border rounded bg-gray-100"
              readOnly
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status || ''}
              onChange={onChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Transaction ID</label>
            <input
              type="text"
              name="transaction_id"
              value={formData.transaction_id || ''}
              className="w-full p-2 border rounded bg-gray-100"
              readOnly
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              className="w-full p-2 border rounded bg-gray-100"
              rows="3"
              readOnly
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={loading}
            >
              {loading ? "Loading..." : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}