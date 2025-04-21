import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsetOrders } from '../State/Order/Action.js';
import OrderCard from './OrderCard.jsx';
import { Typography, Divider } from '@mui/material';

const Orders = () => {
  const { auth, order } = useSelector((store) => store);
  const navigate = useNavigate();
  const jwt = localStorage.getItem('jwt');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsetOrders(jwt));
  }, [auth.jwt]);

  if (!order.orders) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto'>
        <Typography variant='h4' className='text-2xl font-bold text-gray-900 mb-8'>
          Your Orders
          <div>
            
          </div>
        </Typography>
        
        <>
        <div>

        </div>
        </>

        <div className='space-y-6'>
          {order.orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
       
      </div>
    </div>
  );
};

export default Orders;