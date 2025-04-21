// src/views/AssignDeliveryView.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assignDelivery } from '../../component/State/Delivery/Action';

const AssignDeliveryView = () => {
  const [orderId, setOrderId] = useState('');
  const [personId, setPersonId] = useState('');
  const dispatch = useDispatch();
  const { delivery, loading, error } = useSelector((state) => state.delivery);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(assignDelivery(orderId, personId));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Assign Delivery</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Order ID</label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Delivery Person ID</label>
          <input
            type="text"
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Assigning...' : 'Assign Delivery'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      {delivery && <p className="text-green-500 mt-2">Delivery Assigned Successfully!</p>}
    </div>
  );
};

export default AssignDeliveryView;
