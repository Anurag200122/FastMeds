import { 
  Box, Card, CardHeader, TableCell, TableBody, TableRow, 
  Table, TableHead, Paper, TableContainer, AvatarGroup, 
  Avatar, Chip, MenuItem, Button, Menu, Typography, Snackbar, Alert,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Tooltip
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPharmacyOrder, updateOrderStatus } from '../../component/State/PharmacyOrder/Action';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { api } from "../../component/config/api";
import PrescriptionManagement from "../Admin/PrescriptionMangement";

export const OrderTable = ({ filterStatus }) => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { pharmacy, pharmacyOrder } = useSelector(store => store);
  const [anchorElMap, setAnchorElMap] = useState({});
  const [prescriptionAnchorElMap, setPrescriptionAnchorElMap] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [selectedOrderForPrescription, setSelectedOrderForPrescription] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [openPrescriptionDialog, setOpenPrescriptionDialog] = useState(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);

  const handleClick = (event, orderId) => {
    setAnchorElMap({...anchorElMap, [orderId]: event.currentTarget});
  };

  const handlePrescriptionClick = (prescriptionId) => {
    setSelectedPrescriptionId(prescriptionId);
    setOpenPrescriptionDialog(true);
  };

  const handleClose = (orderId) => {
    setAnchorElMap({...anchorElMap, [orderId]: null});
  };

  const handlePrescriptionClose = (prescriptionId) => {
    setPrescriptionAnchorElMap({...prescriptionAnchorElMap, [prescriptionId]: null});
  };

  useEffect(() => {
    if (pharmacy.usersPharmacy?.id) {
      dispatch(fetchPharmacyOrder({
        jwt,
        pharmacyId: pharmacy.usersPharmacy.id,
      }));
    }
  }, [dispatch, jwt, pharmacy.usersPharmacy?.id]);

  const handleUpdateOrder = (orderId, orderStatus) => {
    // Optimistically update the local state first
    const updatedOrders = pharmacyOrder.orders.map(order => 
      order.id === orderId ? { ...order, orderStatus } : order
    );
    
    dispatch({
      type: 'UPDATE_PHARMACY_ORDER_STATUS',
      payload: { orders: updatedOrders }
    });

    dispatch(updateOrderStatus({orderId, orderStatus, jwt}))
      .then(() => {
        setSnackbar({
          open: true,
          message: `Order status updated to ${orderStatus.replace(/_/g, ' ')} successfully!`,
          severity: "success"
        });
      })
      .catch(() => {
        // Revert the optimistic update if the API call fails
        dispatch(fetchPharmacyOrder({
          jwt,
          pharmacyId: pharmacy.usersPharmacy?.id,
        }));
        setSnackbar({
          open: true,
          message: "Failed to update order status",
          severity: "error"
        });
      });
    handleClose(orderId);
  };

  const handleUpdatePrescriptionStatus = async (prescriptionId, status) => {
    try {
      // Optimistically update the local state first
      const updatedOrders = pharmacyOrder.orders.map(order => {
        if (order.prescription?.id === prescriptionId) {
          return {
            ...order,
            prescription: {
              ...order.prescription,
              status
            }
          };
        }
        return order;
      });
      
      dispatch({
        type: 'UPDATE_PHARMACY_ORDER_STATUS',
        payload: { orders: updatedOrders }
      });

      await api.put(`/api/prescription/${prescriptionId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      
      setSnackbar({
        open: true,
        message: `Prescription status updated to ${status.toLowerCase()} successfully`,
        severity: "success"
      });
    } catch (error) {
      // Revert the optimistic update if the API call fails
      dispatch(fetchPharmacyOrder({
        jwt,
        pharmacyId: pharmacy.usersPharmacy?.id,
      }));
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update prescription status",
        severity: "error"
      });
    } finally {
      handlePrescriptionClose(prescriptionId);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewPrescription = async (order) => {
    if (order.prescription) {
      try {
        const fileExt = order.prescription.fileName.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png'].includes(fileExt)) {
          const response = await api.get(`/api/prescription/view/${order.prescription.id}`, {
            responseType: 'blob',
            headers: {
              Authorization: `Bearer ${jwt}`
            }
          });
          const imageUrl = URL.createObjectURL(response.data);
          setPreviewImage(imageUrl);
        }
        setSelectedOrderForPrescription(order);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to load prescription preview",
          severity: "error"
        });
      }
    }
  };

  const handleDownloadPrescription = async (prescriptionId, fileName) => {
    try {
      const response = await api.get(`/api/prescription/download/${prescriptionId}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'prescription.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      setSnackbar({
        open: true,
        message: "Download started successfully",
        severity: "success"
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to download prescription",
        severity: "error"
      });
    }
  };

  const statusColors = {
    PENDING: { bg: "#FFD700", text: "#000" },
    PACKING: { bg: "#4CAF50", text: "#FFF" },
    READY_FOR_PICKUP: { bg: "#2196F3", text: "#FFF" },
    DELIVERED: { bg: "#9C27B0", text: "#FFF" }
  };

  const prescriptionStatusColors = {
    PENDING: { bg: "#FFD700", text: "#000" },
    APPROVED: { bg: "#4CAF50", text: "#FFF" },
    REJECTED: { bg: "#F44336", text: "#FFF" }
  };

  const filteredOrders = filterStatus === "ALL" 
    ? pharmacyOrder.orders || [] 
    : (pharmacyOrder.orders || []).filter(order => order.orderStatus === filterStatus);

  return (
    <Box className="px-5">
      <Card sx={{ 
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <CardHeader 
          title={
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Orders ({filteredOrders.length})
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
              Filtered by: {filterStatus === "ALL" ? "All Orders" : filterStatus}
            </Typography>
          }
          sx={{
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid rgba(0,0,0,0.12)',
            py: 2
          }}
        />
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table sx={{ minWidth: 650 }} aria-label="orders table">
            <TableHead sx={{ backgroundColor: '#fafafa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Prescription</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow 
                  key={order.id}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'rgba(63, 81, 181, 0.04)' 
                    },
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>{order.id}</TableCell>
                  <TableCell>
                    <AvatarGroup max={3} spacing="small">
                      {order.items?.map((item, idx) => (
                        <Avatar 
                          key={idx}
                          src={item.medicine?.images?.[0]}
                          alt={item.medicine?.name}
                          sx={{ 
                            width: 32, 
                            height: 32,
                            border: '2px solid white'
                          }}
                        />
                      ))}
                    </AvatarGroup>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {order.customer?.fullName}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    ${order.totalPrice?.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.orderStatus}
                      sx={{
                        backgroundColor: statusColors[order.orderStatus]?.bg || "#F44336",
                        color: statusColors[order.orderStatus]?.text || "#FFF",
                        fontWeight: 600,
                        minWidth: "120px",
                        borderRadius: '4px',
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {order.prescription ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip title="View Prescription">
                          <IconButton 
                            onClick={() => handleViewPrescription(order)}
                            color="primary"
                            size="small"
                          >
                            <DescriptionIcon />
                          </IconButton>
                        </Tooltip>
                        <Chip
                          label={order.prescription.status}
                          sx={{
                            backgroundColor: prescriptionStatusColors[order.prescription.status]?.bg || "#F44336",
                            color: prescriptionStatusColors[order.prescription.status]?.text || "#FFF",
                            fontWeight: 600,
                            minWidth: "100px",
                            borderRadius: '4px',
                            textTransform: 'capitalize'
                          }}
                        />
                        <Button
                          aria-controls={`prescription-menu-${order.prescription.id}`}
                          aria-haspopup="true"
                          onClick={() => handlePrescriptionClick(order.prescription.id)}
                          variant="outlined"
                          size="small"
                          sx={{
                            textTransform: 'capitalize',
                            fontWeight: 500,
                            borderRadius: '6px',
                            borderWidth: '2px',
                            '&:hover': {
                              borderWidth: '2px'
                            }
                          }}
                        >
                          Manage
                        </Button>
                        {selectedPrescriptionId && (
                          <Dialog 
                            open={openPrescriptionDialog} 
                            onClose={() => setOpenPrescriptionDialog(false)}
                            fullWidth
                            maxWidth="md"
                            BackdropProps={{
                              style: {
                                backgroundColor: 'transparent'
                              }
                            }}
                          >
                            <PrescriptionManagement 
                              orderId={selectedPrescriptionId} 
                              onClose={() => setOpenPrescriptionDialog(false)}
                            />
                          </Dialog>
                        )}

                        <Menu
                          id={`prescription-menu-${order.prescription.id}`}
                          anchorEl={prescriptionAnchorElMap[order.prescription.id]}
                          open={Boolean(prescriptionAnchorElMap[order.prescription.id])}
                          onClose={() => handlePrescriptionClose(order.prescription.id)}
                          PaperProps={{
                            sx: {
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                              minWidth: '160px'
                            }
                          }}
                        >
                          {Object.entries(prescriptionStatusColors).map(([status, _]) => (
                            <MenuItem 
                              key={status}
                              onClick={() => handleUpdatePrescriptionStatus(order.prescription.id, status)}
                              sx={{
                                textTransform: 'capitalize',
                                fontWeight: 500,
                                '&:hover': {
                                  backgroundColor: 'rgba(63, 81, 181, 0.08)'
                                }
                              }}
                            >
                              {status.replace(/_/g, ' ')}
                            </MenuItem>
                          ))}
                        </Menu>
                        <Tooltip title="Download Prescription">
                          <IconButton 
                            onClick={() => handleDownloadPrescription(order.prescription.id, order.prescription.fileName)}
                            color="secondary"
                            size="small"
                          >
                            <CloudDownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No prescription
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      aria-controls={`order-menu-${order.id}`}
                      aria-haspopup="true"
                      onClick={(e) => handleClick(e, order.id)}
                      variant="outlined"
                      size="small"
                      sx={{
                        textTransform: 'capitalize',
                        fontWeight: 500,
                        borderRadius: '6px',
                        borderWidth: '2px',
                        '&:hover': {
                          borderWidth: '2px'
                        }
                      }}
                    >
                      Update
                    </Button>
                    <Menu
                      id={`order-menu-${order.id}`}
                      anchorEl={anchorElMap[order.id]}
                      open={Boolean(anchorElMap[order.id])}
                      onClose={() => handleClose(order.id)}
                      PaperProps={{
                        sx: {
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          minWidth: '160px'
                        }
                      }}
                    >
                      {Object.entries(statusColors).map(([status, _]) => (
                        <MenuItem 
                          key={status}
                          onClick={() => handleUpdateOrder(order.id, status)}
                          sx={{
                            textTransform: 'capitalize',
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: 'rgba(63, 81, 181, 0.08)'
                            }
                          }}
                        >
                          {status.replace(/_/g, ' ')}
                        </MenuItem>
                      ))}
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Prescription Management Dialog */}
      <Dialog
        open={Boolean(selectedOrderForPrescription)}
        onClose={() => {
          setSelectedOrderForPrescription(null);
          if (previewImage) {
            URL.revokeObjectURL(previewImage);
            setPreviewImage(null);
          }
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Prescription for Order #{selectedOrderForPrescription?.id}
            </Typography>
            <IconButton onClick={() => {
              setSelectedOrderForPrescription(null);
              if (previewImage) {
                URL.revokeObjectURL(previewImage);
                setPreviewImage(null);
              }
            }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {previewImage ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <img 
                src={previewImage} 
                alt="Prescription preview" 
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} 
              />
            </Box>
          ) : selectedOrderForPrescription && (
            <PrescriptionManagement 
              orderId={selectedOrderForPrescription.id} 
              prescription={selectedOrderForPrescription.prescription}
              jwt={jwt}
            />
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};