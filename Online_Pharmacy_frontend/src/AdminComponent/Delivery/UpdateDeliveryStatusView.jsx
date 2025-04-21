// src/views/UpdateDeliveryStatusView.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDeliveryStatus } from '../../component/State/Delivery/Action';

const UpdateDeliveryStatusView = () => {
  const [id, setId] = useState('');
  const [status, setStatus] = useState('');
  const dispatch = useDispatch();
  const { delivery, error } = useSelector((state) => state.delivery);

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateDeliveryStatus(id, status));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Update Delivery Status</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Delivery ID</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
          Update Status
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      {delivery && <p className="text-green-500 mt-2">Status Updated!</p>}
    </div>
  );
};

export default UpdateDeliveryStatusView;
