import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AddressCard from '../Cart/AddressCard';
import { 
  Box, 
  Button, 
  Card, 
  Container, 
  Typography, 
  Divider, 
  Grid, 
  Paper, 
  useTheme, 
  useMediaQuery, 
  Fade, 
  CircularProgress 
} from '@mui/material';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import HomeIcon from '@mui/icons-material/Home';
import { motion } from 'framer-motion';

// Utility function to normalize address strings
const normalizeAddressString = (str) => {
  return str.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^\w\s]/g, '');
};

// Function to filter out duplicate addresses
const getUniqueAddresses = (addresses) => {
  const uniqueAddresses = [];
  const seen = new Set();
  
  addresses.forEach(address => {
    const street = normalizeAddressString(address.streetAddress || '');
    const city = normalizeAddressString(address.city || '');
    const zip = normalizeAddressString(address.postalCode || '');
    
    const addressKey = `${street}-${city}-${zip}`;
    
    if (!seen.has(addressKey)) {
      seen.add(addressKey);
      uniqueAddresses.push(address);
    }
  });
  
  return uniqueAddresses;
};

const Address = () => {
  const { auth } = useSelector(store => store);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Get valid, unique addresses
  const validAddresses = getUniqueAddresses(
    auth.user?.address?.filter(address => 
      address.streetAddress && address.city && address.postalCode
    ) || []
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12
      }
    }
  };

  const handleAddAddress = () => {
    setLoading(true);
    // Simulate loading and action
    setTimeout(() => {
      setLoading(false);
      console.log("Add new address clicked");
      // You can add navigation to address form here
    }, 600);
  };

  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                position: "relative",
                display: "inline-block",
                mb: 1,
                background: 'linear-gradient(90deg, #0d9488, #0891b2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                "&::after": {
                  content: '""',
                  position: "absolute",
                  width: "40%",
                  height: "4px",
                  background: 'linear-gradient(90deg, #0d9488, #0891b2)',
                  borderRadius: "2px",
                  bottom: "-10px",
                  left: "30%"
                }
              }}
            >
              My Addresses
            </Typography>
          </motion.div>
          
          <Box sx={{ mt: 4, mb: 2 }}>
            <Divider>
              <Paper
                elevation={2}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1.5,
                  borderRadius: "50%",
                  bgcolor: "primary.light",
                  color: "white"
                }}
              >
                <HomeIcon />
              </Paper>
            </Divider>
          </Box>
          
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: "600px", mx: "auto", mt: 2 }}
          >
            Manage your delivery locations and quickly select them during checkout.
          </Typography>
        </Box>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3} justifyContent="center">
            {validAddresses.map((address, index) => (
              <Grid item xs={12} sm={6} md={4} key={address.id || index}>
                <motion.div variants={itemVariants}>
                  <Box sx={{ height: "100%" }}>
                    <AddressCard 
                      item={address}
                      showButton={true}
                      elevation={3}
                    />
                  </Box>
                </motion.div>
              </Grid>
            ))}
            
            <Grid item xs={12} sm={6} md={4}>
              <motion.div variants={itemVariants}>
                <Card
                  component={motion.div}
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 20px 30px rgba(0, 0, 0, 0.1)",
                    transition: { duration: 0.3 }
                  }}
                  sx={{
                    height: "100%",
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                    bgcolor: "background.paper",
                    border: "2px dashed rgba(13, 148, 136, 0.3)",
                    minHeight: isMobile ? "180px" : "240px"
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      bgcolor: "rgba(13, 148, 136, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3
                    }}
                  >
                    <AddLocationIcon sx={{ fontSize: 32, color: "#0d9488" }} />
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 2,
                      color: "text.primary"
                    }}
                  >
                    Add New Address
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3, textAlign: "center" }}
                  >
                    Save a new delivery location to speed up checkout
                  </Typography>
                  
                  <Button 
                    variant='contained'
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    size="large"
                    disableElevation
                    onClick={handleAddAddress}
                    disabled={loading}
                    sx={{
                      borderRadius: "8px",
                      px: 3,
                      py: 1.2,
                      bgcolor: "#0d9488",
                      "&:hover": {
                        bgcolor: "#0f766e"
                      },
                      transition: "all 0.3s ease"
                    }}
                  >
                    {loading ? "Adding..." : "Add Address"}
                  </Button>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
        
        {validAddresses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Box 
              sx={{ 
                textAlign: "center", 
                mt: 8, 
                p: 4, 
                borderRadius: 2,
                bgcolor: "rgba(13, 148, 136, 0.05)",
                border: "1px dashed rgba(13, 148, 136, 0.2)"
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                No addresses saved yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add your first delivery address to get started
              </Typography>
            </Box>
          </motion.div>
        )}
      </Container>
    </Fade>
  );
};

export default Address;