import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  CircularProgress,
  Modal,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import HomeIcon from '@mui/icons-material/Home';
import { motion } from 'framer-motion';
import { Field, Form, Formik } from 'formik';

// Modal style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  outline: 'none',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

// Form initial values
const initialValues = {
  streetAddress: "",
  city: "",
  state: "",
  postalCode: ""
};

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

// Simulated action for adding a new address
// In a real app, you would import this from your actions file
const addNewAddress = (data) => {
  return async (dispatch) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Normally this would be the response from your API
    const newAddress = {
      id: Date.now().toString(), // Generate a temporary ID
      ...data.address
    };
    
    // Dispatch action to update Redux state
    dispatch({
      type: 'ADD_USER_ADDRESS',
      payload: newAddress
    });
    
    return newAddress;
  };
};

const Address = () => {
  const { auth } = useSelector(store => store);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  useEffect(() => {
    // Initialize addresses from auth.user.address
    if (auth.user?.address) {
      setAddresses(auth.user.address);
    }
  }, [auth.user?.address]);
  
  // Get valid, unique addresses
  const validAddresses = getUniqueAddresses(
    addresses.filter(address => 
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
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmitAddress = async (values, { resetForm }) => {
    setLoading(true);
    try {
      // Prepare data for the action
      const data = {
        jwt: localStorage.getItem("jwt"),
        address: values
      };
      
      // Dispatch the action to add the address
      const newAddress = await dispatch(addNewAddress(data));
      
      // Add the new address to our local state to display it immediately
      setAddresses(prevAddresses => [...prevAddresses, newAddress]);
      
      // Close the modal and reset the form
      setModalOpen(false);
      resetForm();
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Address added successfully!',
        severity: 'success'
      });
      
      console.log("Address added:", newAddress);
    } catch (error) {
      console.error("Error adding address:", error);
      setSnackbar({
        open: true,
        message: 'Failed to add address. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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

        {/* Address Form Modal */}
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="add-address-modal"
          aria-describedby="modal-to-add-new-address"
        >
          <Box sx={modalStyle}>
            <Typography
              variant="h6"
              component="h2"
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                color: "#0d9488" 
              }}
            >
              Add New Address
            </Typography>
            
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmitAddress}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        name="streetAddress"
                        label="Street Address"
                        fullWidth
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        name="city"
                        label="City"
                        fullWidth
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        name="state"
                        label="State"
                        fullWidth
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        name="postalCode"
                        label="Zip Code"
                        fullWidth
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isSubmitting || loading}
                        sx={{
                          bgcolor: "#0d9488",
                          "&:hover": {
                            bgcolor: "#0f766e"
                          },
                          py: 1.2
                        }}
                      >
                        {isSubmitting || loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Save Address"
                        )}
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleCloseModal}
                        sx={{
                          borderColor: "#0d9488",
                          color: "#0d9488",
                          "&:hover": {
                            borderColor: "#0f766e",
                            backgroundColor: "rgba(13, 148, 136, 0.05)"
                          }
                        }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Modal>
        {/* Success/Error Snackbar */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Fade>
  );
};

export default Address;