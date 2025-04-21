// src/pages/RefundPage.jsx
import { Box, Typography, Card, Chip, Divider, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../config/api';

const RefundPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const { data } = await api.get(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <Typography>Loading refund details...</Typography>;
  if (!order) return <Typography>Order not found</Typography>;

  return (
    <Box className="p-4 max-w-3xl mx-auto">
      <Typography variant="h4" className="mb-6">
        Refund Details for Order #{order.id}
      </Typography>
      
      <Card className="p-4 mb-4">
        <Box className="flex justify-between items-center mb-3">
          <Typography variant="h6">Order Summary</Typography>
          <Chip 
            label={order.refundProcessed ? "Refund Completed" : "Refund Pending"} 
            color={order.refundProcessed ? "success" : "warning"} 
          />
        </Box>
        
        <Divider className="my-2" />
        
        <Box className="grid grid-cols-2 gap-4 my-4">
          <div>
            <Typography variant="body2" color="textSecondary">Order Date</Typography>
            <Typography>{new Date(order.createdAt).toLocaleDateString()}</Typography>
          </div>
          <div>
            <Typography variant="body2" color="textSecondary">Total Amount</Typography>
            <Typography>${order.totalPrice.toFixed(2)}</Typography>
          </div>
          {order.refundProcessed && (
            <div>
              <Typography variant="body2" color="textSecondary">Refund Date</Typography>
              <Typography>{new Date(order.refundProcessedAt).toLocaleDateString()}</Typography>
            </div>
          )}
        </Box>

        {order.prescription?.status === 'REJECTED' && (
          <Box className="mt-4 p-3 bg-red-50 rounded-lg">
            <Typography variant="subtitle1" className="font-bold text-red-700">
              Prescription Rejected
            </Typography>
            <Typography variant="body2" className="text-red-600">
              Reason: {order.rejectionReason}
            </Typography>
          </Box>
        )}
      </Card>

      <Box className="mt-6">
        <Typography variant="h6" className="mb-2">
          Refund Status
        </Typography>
        {order.refundProcessed ? (
          <Typography>
            Your refund of ${order.totalPrice.toFixed(2)} was processed on {new Date(order.refundProcessedAt).toLocaleDateString()}.
            It may take 3-5 business days to appear in your account.
          </Typography>
        ) : (
          <Typography>
            Your refund is being processed. Please allow 3-5 business days for the amount to be credited back to your original payment method.
          </Typography>
        )}
      </Box>

      <Button 
        variant="contained" 
        color="primary" 
        className="mt-6"
        onClick={() => navigate('/orders')}
      >
        Back to Orders
      </Button>
    </Box>
  );
};

export default RefundPage;