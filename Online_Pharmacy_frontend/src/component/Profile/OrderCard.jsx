import { 
  Card, 
  Chip, 
  Button, 
  Typography, 
  Divider, 
  Box, 
  Avatar,
  Grow,
  Zoom,
  Slide,
  Fade,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const statusColors = {
  PENDING: { bg: "#FFD700", text: "#000", icon: "🕒" },
  COMPLETED: { bg: "#4CAF50", text: "#FFF", icon: "✅" },
  OUT_FOR_DELIVERY: { bg: "#2196F3", text: "#FFF", icon: "🚚" },
  DELIVERED: { bg: "#9C27B0", text: "#FFF", icon: "🎉" },
  CANCELLED: { bg: "#F44336", text: "#FFF", icon: "❌" },
  READY_FOR_PICKUP: { bg: "#FF9800", text: "#FFF", icon: "📦" },
  REFUNDED: { bg: "#4CAF50", text: "#FFF", icon: "💰" }
};

const AnimatedCard = styled(motion.div)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  overflow: 'hidden',
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6]
  }
}));

const GlowButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  position: 'relative',
  overflow: 'hidden',
  '&:after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-60%',
    width: '200%',
    height: '200%',
    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
    transform: 'rotate(30deg)',
    transition: 'all 0.5s ease'
  },
  '&:hover:after': {
    left: '100%'
  }
}));

const PickupButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  background: 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)',
  color: 'white',
  fontWeight: 'bold',
  padding: '8px 16px',
  borderRadius: '20px',
  boxShadow: '0 3px 5px 2px rgba(255, 152, 0, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #FB8C00 30%, #FFA000 90%)',
  }
}));

const OrderCard = ({ order, index }) => {
  const navigate = useNavigate();
  const currentStatus = order.orderStatus || "PENDING";
  const statusConfig = statusColors[currentStatus] || statusColors.PENDING;
  
  // Format order date
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleViewMenuClick = () => {
    const pharmacy = order.items[0]?.medicine?.pharmacy;
    if (pharmacy) {
      navigate(`/pharmacy/${pharmacy.address?.city}/${pharmacy.name}/${pharmacy.id}`);
    }
  };

  const handlePickupClick = () => {
    const pharmacy = order.items[0]?.medicine?.pharmacy;
    if (pharmacy?.googleMaps) {
      window.open(pharmacy.googleMaps, '_blank');
    }
  };

  return (
    <Grow in={true} timeout={index * 300}>
      <AnimatedCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className='rounded-lg overflow-hidden border border-gray-100'>
          {/* Pharmacy Header with Image */}
          <Box 
            className='p-4 bg-gradient-to-r from-blue-50 to-purple-50 flex items-start gap-4'
            sx={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}
          >
            <Zoom in={true} style={{ transitionDelay: '100ms' }}>
              <Avatar
                src={order.items[0]?.medicine?.pharmacy?.images?.[0]}
                alt={order.items[0]?.medicine?.pharmacy?.name}
                sx={{ 
                  width: 56, 
                  height: 56,
                  boxShadow: 3,
                  border: '2px solid white'
                }}
                variant='rounded'
                onError={(e) => {
                  e.target.src = '/default-pharmacy.jpg';
                }}
              />
            </Zoom>
            
            <Box className='flex-1'>
              <Box className='flex justify-between items-start'>
                <Box>
                  <Typography 
                    variant='h6' 
                    className='font-bold text-lg text-gray-800'
                    sx={{
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                  >
                    {order.items[0]?.medicine?.pharmacy?.name || 'Unknown Pharmacy'}
                  </Typography>
                  <Typography 
                    variant='body2' 
                    className='text-gray-600'
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <span>📍</span>
                    {order.items[0]?.medicine?.pharmacy?.address?.street}, {order.items[0]?.medicine?.pharmacy?.address?.city}
                  </Typography>
                </Box>
                {currentStatus === 'READY_FOR_PICKUP' ? (
                  <PickupButton 
                    variant='contained'
                    onClick={handlePickupClick}
                  >
                    Your order is ready for pickup
                  </PickupButton>
                ) : (
                  <GlowButton 
                    variant='contained' 
                    color='primary'
                    onClick={handleViewMenuClick}
                    sx={{ 
                      borderRadius: '20px',
                      px: 2,
                      py: 1
                    }}
                  >
                    View menu ▶
                  </GlowButton>
                )}
              </Box>
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)' }} />

          {/* Order Items with Medicine Images */}
          <Box className='p-4 bg-white'>
            {order.items.map((item, itemIndex) => (
              <Fade in={true} key={item.id} timeout={itemIndex * 200}>
                <Box 
                  className='mb-3 last:mb-0 flex gap-3 items-center'
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      transform: 'translateX(5px)'
                    }
                  }}
                >
                  <Slide direction="left" in={true} timeout={itemIndex * 200}>
                    <Avatar
                      src={item.medicine?.images?.[0]}
                      alt={item.medicine?.name}
                      sx={{ 
                        width: 48, 
                        height: 48,
                        border: '2px solid #f5f5f5',
                        boxShadow: 1
                      }}
                      variant='rounded'
                      onError={(e) => {
                        e.target.src = '/default-medicine.jpg';
                      }}
                    />
                  </Slide>
                  
                  <Box className='flex-1'>
                    <Box className='flex justify-between'>
                      <Typography className='font-medium text-gray-800'>
                        {item.quantity} x {item.medicine?.name}
                      </Typography>
                      <Typography className='text-gray-600 font-bold'>
                        ${item.totalPrice?.toFixed(2)}
                      </Typography>
                    </Box>
                    
                    {item.dossage?.length > 0 && (
                      <Typography 
                        variant='body2' 
                        className='text-gray-500 flex items-center gap-1'
                      >
                        💊 Dosage: {item.dossage.join(', ')}
                      </Typography>
                    )}
                    
                    {item.medicine?.medicineCategory && (
                      <Typography 
                        variant='body2' 
                        className='text-gray-500 flex items-center gap-1'
                      >
                        🏷️ Category: {item.medicine.medicineCategory.name}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Fade>
            ))}
          </Box>

          <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)' }} />

          {/* Order Summary */}
          <Box 
            className='p-4'
            sx={{
              background: 'linear-gradient(to right, #f9f9f9, #ffffff)'
            }}
          >
            {/* Prescription Rejection Alert */}
            {order.prescription?.status === 'REJECTED' && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  Prescription Rejected: {order.rejectionReason}
                </Typography>
                <Typography variant="body2">
                  {order.refundProcessed 
                    ? `Refund processed on ${new Date(order.refundProcessedAt).toLocaleDateString()}`
                    : 'Your refund will be processed within 3-5 business days'}
                </Typography>
              </Alert>
            )}

            

            <Box className='flex justify-between items-center mb-2'>
              <Typography 
                variant='body2' 
                className='text-gray-600 flex items-center gap-1'
              >
                <span>📅</span> 
                Order placed on {orderDate}
              </Typography>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Chip
                  icon={<span>{statusConfig.icon}</span>}
                  label={currentStatus.replace(/_/g, ' ')}
                  sx={{
                    backgroundColor: statusConfig.bg,
                    color: statusConfig.text,
                    fontWeight: 'bold',
                    minWidth: '120px',
                    fontSize: '0.875rem',
                    padding: '8px 12px',
                    boxShadow: 1
                  }}
                />
              </motion.div>
            </Box>
            
            <Box className='flex justify-between items-center'>
              <Typography 
                variant='body2' 
                className='text-gray-600 flex items-center gap-1'
              >
                <span>🏠</span>
                Ordered from: {order.deliveryAddress?.streetAddress}, {order.deliveryAddress?.city}
              </Typography>
              
              <Typography 
                variant='body1' 
                className='font-semibold text-lg text-purple-700'
                sx={{
                  background: 'linear-gradient(to right, #6a11cb, #2575fc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold'
                }}
              >
                Total: ${order.totalPrice.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Card>
      </AnimatedCard>
    </Grow>
  );
};

export default OrderCard;