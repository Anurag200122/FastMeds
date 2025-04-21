import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Box, Typography, Snackbar, Alert } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDossage } from "../../component/State/Dossage/Action";

const CreateDossageForm = () => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const { pharmacy, dossage } = useSelector(store => store);
  
    const [formData, setFormData] = useState({
        name: "",
        categoryId: "",
    });
    const [errors, setErrors] = useState({
        name: false,
        categoryId: false,
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate fields
        const newErrors = {
            name: formData.name.trim() === "",
            categoryId: formData.categoryId === "",
        };
        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error)) {
            return;
        }

        const data = {
            ...formData,
            pharmacyId: pharmacy.usersPharmacy.id
        };
        
        dispatch(createDossage({ data, jwt }));
        
        // Show success message
        const categoryName = dossage.category.find(c => c.id === formData.categoryId)?.name || "";
        setSuccessMessage(`Dossage "${formData.name}" (${categoryName}) created successfully!`);
        setOpenSnackbar(true);
        
        // Clear the form
        setFormData({ name: "", categoryId: "" });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error when user starts typing/selecting
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
                    Create Dossage
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
                        label="Name"
                        variant="outlined"
                        onChange={handleInputChange}
                        value={formData.name}
                        error={errors.name}
                        helperText={errors.name ? "Name is required" : ""}
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

                    <FormControl fullWidth error={errors.categoryId}>
                        <InputLabel id="dossage-category-label" required>Dossage Category</InputLabel>
                        <Select
                            labelId="dossage-category-label"
                            id="categoryId"
                            value={formData.categoryId}
                            label="Dossage Category"
                            onChange={handleInputChange}
                            name="categoryId"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: errors.categoryId ? 'error.main' : 'primary.light',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: errors.categoryId ? 'error.main' : 'primary.main',
                                    },
                                }
                            }}
                        >
                            {dossage.category.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.categoryId && (
                            <Typography variant="caption" color="error">
                                Category selection is required
                            </Typography>
                        )}
                    </FormControl>
                    
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
                        Create Dossage
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

export default CreateDossageForm;