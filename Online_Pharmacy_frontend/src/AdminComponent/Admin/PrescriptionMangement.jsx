import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Divider, 
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress
} from '@mui/material';
import { 
  CheckCircle, 
  Cancel, 
  PendingActions,
  Download,
  Refresh,
  Edit,
  Delete
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getPrescriptionByOrderId, 
  updatePrescriptionStatus,
  deletePrescription
} from '../../component/State/Prescription/Action';

const PrescriptionManagement = ({ orderId }) => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { prescription, loading, error } = useSelector(state => state.prescription);
  
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
 // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchPrescription();
  }, [orderId]);

  const fetchPrescription = () => {
    dispatch(getPrescriptionByOrderId({ orderId, jwt }));
  };

  const handleStatusUpdate = async () => {
    try {
      await dispatch(updatePrescriptionStatus({ 
        prescriptionId: prescription.id, 
        status: newStatus,
        jwt,
        notes
      }));
      
      setSnackbar({
        open: true,
        message: 'Prescription status updated successfully',
        severity: 'success'
      });
      setStatusDialogOpen(false);
      fetchPrescription();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update status',
        severity: 'error'
      });
    }
  };

  // const handleDelete = async () => {
  //   try {
  //     await dispatch(deletePrescription({ 
  //       prescriptionId: prescription.id, 
  //       jwt 
  //     }));
      
  //     setSnackbar({
  //       open: true,
  //       message: 'Prescription deleted successfully',
  //       severity: 'success'
  //     });
  //     setDeleteDialogOpen(false);
  //     fetchPrescription();
  //   } catch (error) {
  //     setSnackbar({
  //       open: true,
  //       message: error.message || 'Failed to delete prescription',
  //       severity: 'error'
  //     });
  //   }
  // };

  // const handleDownload = () => {
  //   // In a real app, this would download the file from your backend
  //   window.open(prescription.filePath, '_blank');
  // };

  const getStatusChip = () => {
    switch(prescription?.status) {
      case 'APPROVED':
        return <Chip icon={<CheckCircle />} label="Approved" color="success" />;
      case 'REJECTED':
        return <Chip icon={<Cancel />} label="Rejected" color="error" />;
      case 'PENDING':
        return <Chip icon={<PendingActions />} label="Pending" color="warning" />;
      default:
        return <Chip label="Unknown" />;
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!prescription) {
    return (
      <Box textAlign="center" p={4}>
        <Typography variant="h6">No prescription found for this order</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Prescription Details</Typography>
            <Button 
              variant="outlined" 
              startIcon={<Refresh />}
              onClick={fetchPrescription}
            >
              Refresh
            </Button>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell><strong>File Name</strong></TableCell>
                  <TableCell>{prescription.fileName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getStatusChip()}
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setNewStatus(prescription.status);
                          setNotes(prescription.notes || '');
                          setStatusDialogOpen(true);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Uploaded At</strong></TableCell>
                  <TableCell>{new Date(prescription.uploadedAt).toLocaleString()}</TableCell>
                </TableRow>
                {prescription.notes && (
                  <TableRow>
                    <TableCell><strong>Notes</strong></TableCell>
                    <TableCell>{prescription.notes}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={3} display="flex" gap={2}>
            {/* <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleDownload}
            >
              Download Prescription
            </Button> */}
            {/* <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Prescription
            </Button> */}
          </Box>
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update Prescription Status</DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="subtitle1" gutterBottom>
              Current Status: {prescription.status}
            </Typography>
          </Box>
          
          <TextField
            select
            fullWidth
            label="New Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            SelectProps={{
              native: true,
            }}
            variant="outlined"
            sx={{ mb: 2 }}
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </TextField>
          
          <TextField
            multiline
            rows={4}
            fullWidth
            label="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleStatusUpdate} 
            variant="contained"
            color="primary"
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {/* <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this prescription? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDelete} 
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog> */}

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

export default PrescriptionManagement;