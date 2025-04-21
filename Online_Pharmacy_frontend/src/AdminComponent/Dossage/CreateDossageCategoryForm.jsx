import { Button, TextField, Box, Typography, Snackbar, Alert } from "@mui/material";
import React, { useState } from "react";
import { createDossageCategory } from '../../component/State/Dossage/Action';
import { useDispatch, useSelector } from "react-redux";

const CreateDossageCategoryForm = ({ handleClose }) => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const { pharmacy } = useSelector(store => store);
  
    const [formData, setFormData] = useState({
        name: "",
    });
    const [errors, setErrors] = useState({
        name: false,
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate fields
        const newErrors = {
            name: formData.name.trim() === "",
        };
        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error)) {
            return;
        }

        const data = { 
            name: formData.name, 
            pharmacyId: pharmacy.usersPharmacy.id 
        };
        
        dispatch(createDossageCategory({ data, jwt }));
        
        // Show success message
        setSuccessMessage(`Category "${formData.name}" created successfully!`);
        setOpenSnackbar(true);
        
        // Clear the form
        setFormData({ name: "" });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: false
            });
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ 
                maxWidth: 500,
                mx: 'auto',
                p: 4,
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: 'background.paper'
            }}>
                <Typography 
                    variant="h5" 
                    component="h1" 
                    sx={{ 
                        textAlign: 'center', 
                        color: 'text.secondary',
                        mb: 4,
                        fontWeight: 'medium'
                    }}
                >
                    Create Dossage Category
                </Typography>
                
                <Box 
                    component="form" 
                    onSubmit={handleSubmit}
                    sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3
                    }}
                >
                    <TextField
                        fullWidth
                        required
                        id="name"
                        name="name"
                        label="Category Name"
                        variant="outlined"
                        onChange={handleInputChange}
                        value={formData.name}
                        error={errors.name}
                        helperText={errors.name ? "Category name is required" : ""}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: errors.name ? 'error.main' : 'primary.light',
                                },
                                '&:hover fieldset': {
                                    borderColor: errors.name ? 'error.main' : 'primary.main',
                                },
                            }
                        }}
                    />
                    
                    <Button 
                        variant="contained" 
                        type="submit"
                        fullWidth
                        sx={{
                            py: 1.5,
                            fontWeight: 'bold',
                            letterSpacing: 1,
                            bgcolor: 'primary.main',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                            }
                        }}
                    >
                        Create Category
                    </Button>
                </Box>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity="success" 
                    sx={{ width: '100%' }}
                >
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CreateDossageCategoryForm;