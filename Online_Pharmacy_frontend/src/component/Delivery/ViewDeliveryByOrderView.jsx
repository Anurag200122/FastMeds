// src/views/ViewDeliveryByOrderView.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeliveryByOrderId } from '../State/Delivery/Action';

const ViewDeliveryByOrderView = () => {
  const [orderId, setOrderId] = useState('');
  const dispatch = useDispatch();
  const { delivery, error } = useSelector((state) => state.delivery);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchDeliveryByOrderId(orderId));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">View Delivery by Order ID</h2>
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Order ID</label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <button type="submit" className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600">
          Fetch Delivery
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      {delivery && (
        <div className="mt-4 text-sm text-gray-700">
          <p><strong>ID:</strong> {delivery.id}</p>
          <p><strong>Status:</strong> {delivery.status}</p>
          <p><strong>Assigned To:</strong> {delivery.deliveryPerson?.name || 'N/A'}</p>
        </div>
      )}
    </div>
  );
};

export default ViewDeliveryByOrderView;
