import { Button, TextField, Paper, Typography, Box, Snackbar, Alert } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategoryAction } from "../../component/State/Pharmacy/Action";

const CreateMedicineCategoryForm = () => {
    const { pharmacy } = useSelector((store) => store);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        categoryName: "", pharmacyID: ""
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleSubmit = (e) => {
        e?.preventDefault();
        const data = {
            name: formData.categoryName,
            pharmacyID: {
                id: 1,
            },
        };
        dispatch(createCategoryAction({ reqData: data, jwt: localStorage.getItem("jwt") }));
        
        // Show success message
        setSuccessMessage(`Category "${formData.categoryName}" created successfully!`);
        setOpenSnackbar(true);
        
        // Clear the form
        setFormData({
            categoryName: "",
            pharmacyID: ""
        });
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData, [name]: value
        });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };
    
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100%",
                p: 2
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: "100%",
                    maxWidth: 500,
                    p: 4,
                    borderRadius: 2,
                    bgcolor: "background.paper"
                }}
            >
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                        textAlign: "center",
                        color: "text.secondary",
                        mb: 4,
                        fontWeight: "medium",
                        letterSpacing: 1
                    }}
                >
                    Create Medicine Category
                </Typography>
                
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3
                    }}
                >
                    <TextField
                        fullWidth
                        id="categoryName"
                        name="categoryName"
                        label="Medicine Category"
                        variant="outlined"
                        onChange={handleInputChange}
                        value={formData.categoryName}
                        required
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "primary.light",
                                },
                                "&:hover fieldset": {
                                    borderColor: "primary.main",
                                },
                            }
                        }}
                    />
                    
                    <Button
                        variant="contained"
                        type="submit"
                        size="large"
                        sx={{
                            mt: 2,
                            py: 1.5,
                            fontWeight: "bold",
                            letterSpacing: 1,
                            bgcolor: "primary.main",
                            "&:hover": {
                                bgcolor: "primary.dark",
                            }
                        }}
                    >
                        Create Category
                    </Button>
                </Box>
            </Paper>

            {/* Success notification */}
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

export default CreateMedicineCategoryForm;