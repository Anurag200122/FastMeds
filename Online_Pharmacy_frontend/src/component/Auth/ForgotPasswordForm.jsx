import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Button, 
  TextField, 
  Typography, 
  Box, 
  Alert,
  Collapse,
  IconButton 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { forgotPassword } from '../State/Authentication/Action';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      'Invalid email format'
    )
});

const ForgotPasswordForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' // 'success' | 'error'
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const result = await dispatch(forgotPassword(values.email));
    
    if (result.success) {
      setAlert({
        open: true,
        message: result.data.message || 'Password reset link has been sent to your email',
        severity: 'success'
      });
      resetForm();
      if (onSuccess) onSuccess();
    } else {
      setAlert({
        open: true,
        message: result.error.message || 'Failed to send reset link',
        severity: 'error'
      });
    }
    setSubmitting(false);
  };

  return (
    <Box sx={{ 
      maxWidth: 400, 
      mx: 'auto', 
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
      <Typography variant="h5" gutterBottom align="center">
        Reset Password
      </Typography>
      
      <Collapse in={alert.open}>
        <Alert
          severity={alert.severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlert({ ...alert, open: false });
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alert.message}
        </Alert>
      </Collapse>

      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Field
              as={TextField}
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              margin="normal"
              variant="outlined"
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ mt: 2, py: 1.5 }}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ForgotPasswordForm;