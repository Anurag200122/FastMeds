import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  Typography, 
  LinearProgress, 
  Box,
  Snackbar,
  Alert,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  DialogContent
} from '@mui/material';
import { 
  CloudUpload, 
  Description, 
  CheckCircle, 
  Close, 
  Download,
  Delete,
  Visibility
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { uploadPrescription, getPrescriptionByOrderId, deletePrescription, downloadPrescription, viewPrescription } from '../State/Prescription/Action';
import { useNavigate } from 'react-router-dom';

const PrescriptionUpload = ({ orderId }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);  // Add this state

// Update Redux state destructuring
const { 
  prescription, 
  downloading, 
  viewLoading,  // Add this
  viewUrl,      // Add this
  error: downloadError 
} = useSelector(store => store.prescription);

  useEffect(() => {
    // Fetch existing prescription when component mounts
    dispatch(getPrescriptionByOrderId({ orderId, jwt }));
  }, [orderId, jwt, dispatch]);

  useEffect(() => {
    if (downloadError) {
      setSnackbar({
        open: true,
        message: downloadError,
        severity: "error"
      });
    }
  }, [downloadError]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(selectedFile.type)) {
        setSnackbar({
          open: true,
          message: "Please upload a PDF, JPEG, or PNG file",
          severity: "error"
        });
        return;
      }
      
      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: "File size exceeds 5MB limit",
          severity: "error"
        });
        return;
      }
      
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setSnackbar({
        open: true,
        message: "Please select a file first",
        severity: "error"
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress (in a real app, you'd use axios interceptors)
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      await dispatch(uploadPrescription({ 
        orderId, 
        formData, 
        jwt 
      }));

      clearInterval(interval);
      setUploadProgress(100);

      setSnackbar({
        open: true,
        message: "Prescription uploaded successfully!",
        severity: "success"
      });
      
      // Reset form
      setFile(null);
      setFileName("");
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to upload prescription",
        severity: "error"
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDownload = async () => {
    try {
      await dispatch(downloadPrescription({ 
        prescriptionId: prescription.id, 
        jwt 
      }));
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to download prescription",
        severity: "error"
      });
    }
  };


  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this prescription?")) return;
    
    try {
      await dispatch(deletePrescription({ prescriptionId: prescription.id, jwt }));
      setSnackbar({
        open: true,
        message: "Prescription deleted successfully",
        severity: "success"
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete prescription",
        severity: "error"
      });
    }
  };

  const [previewUrl, setPreviewUrl] = useState(null);

  const handlePreview = async () => {
    try {
      const url = await dispatch(viewPrescription({ 
        prescriptionId: prescription.id, 
        jwt 
      }));
      setPreviewUrl(url.payload); // Access the payload directly
      setPreviewOpen(true);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to preview prescription",
        severity: "error"
      });
    }
  };
  
  // Add this cleanup effect
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // const getFileIcon = () => {
  //   if (!prescription?.fileName) return <Description />;
    
  //   const ext = prescription.fileName.split('.').pop().toLowerCase();
  //   if (ext === 'pdf') return <Description color="error" />;
  //   if (['jpg', 'jpeg', 'png'].includes(ext)) return <Avatar src={prescription.filePath} variant="square" />;
  //   return <Description />;
  // };
  const getFileIcon = () => {
  if (!prescription?.fileName) return <Description />;
  
  const ext = prescription.fileName.split('.').pop().toLowerCase();
  if (ext === 'pdf') return <Description color="error" />;
  if (['jpg', 'jpeg', 'png'].includes(ext)) {
    return <Avatar 
      src={`/api/prescription/view/${prescription.id}`}  // Updated this line
      variant="square" 
      sx={{ width: 56, height: 56 }}
    />;
  }
  return <Description />;
};

  return (
    <Card sx={{ p: 3, mb: 3, borderRadius: 2, maxWidth: 600, mx: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <Description sx={{ mr: 1 }} /> Prescription
        </Typography>
        <IconButton onClick={() => navigate('/my-profile/orders')}>
          <Close />
        </IconButton>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {prescription ? 
          "Your uploaded prescription for this order" : 
          `Please upload your doctor's prescription for Order #${orderId}`
        }
      </Typography>

      {prescription ? (
        <Box sx={{ mb: 3, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            {getFileIcon()}
            <Box flexGrow={1}>
              <Typography noWrap>{prescription.fileName}</Typography>
              <Typography variant="caption" color="text.secondary">
                Uploaded on: {new Date(prescription.uploadedAt).toLocaleString()}
              </Typography>
            </Box>
            <Chip 
              label={prescription.status} 
              size="small" 
              color={
                prescription.status === 'APPROVED' ? 'success' : 
                prescription.status === 'REJECTED' ? 'error' : 'warning'
              }
            />
          </Box>
          
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={handlePreview}
              size="small"
              disabled={viewLoading}  // Add this
            >
              {viewLoading ? 'Loading...' : 'Preview'}  // Updated this
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleDownload}
              size="small"
              disabled={downloading}
            >
              {downloading ? 'Downloading...' : 'Download'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Delete />}
              onClick={handleDelete}
              size="small"
              color="error"
            >
              Delete
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              disabled={isUploading}
              sx={{ flexShrink: 0 }}
            >
              Select File
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </Button>
            
            {fileName && (
              <Typography variant="body1" noWrap sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {fileName}
              </Typography>
            )}
          </Box>

          {isUploading && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'right' }}>
                {uploadProgress}%
              </Typography>
            </Box>
          )}
        </>
      )}

      <Box display="flex" gap={2}>
        <Button
          variant="outlined"
          onClick={() => navigate('/my-profile/orders')}
          fullWidth
          sx={{ mt: 1 }}
        >
          Back to Orders
        </Button>
        {!prescription && (
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!file || isUploading}
            fullWidth
            sx={{ mt: 1 }}
            startIcon={uploadProgress === 100 ? <CheckCircle /> : null}
          >
            {uploadProgress === 100 ? 'Uploaded' : 'Upload Prescription'}
          </Button>
        )}
      </Box>

      <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
        Accepted formats: PDF, JPG, PNG (Max 5MB)
      </Typography>

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
          iconMapping={{
            success: <CheckCircle fontSize="inherit" />
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogContent>
          {viewUrl && (
            prescription.fileName.endsWith('.pdf') ? (
              <embed 
                src={viewUrl} 
                type="application/pdf" 
                width="100%" 
                height="600px" 
              />
            ) : (
              <img 
                src={viewUrl} 
                alt="Prescription" 
                style={{ maxWidth: '100%', height: 'auto' }} 
              />
            )
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PrescriptionUpload;