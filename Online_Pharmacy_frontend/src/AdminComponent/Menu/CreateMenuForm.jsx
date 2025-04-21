import { useFormik } from 'formik';
import React, { useState } from 'react';
import { 
  CircularProgress, Grid, IconButton, TextField, Button, 
  FormControl, InputLabel, Select, OutlinedInput, Box, 
  Chip, MenuItem, Paper, Typography, Snackbar, Alert,
  FormHelperText 
} from '@mui/material';
import { AddPhotoAlternate } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { uploadImageToCloudinary } from '../util/UploadtoCloudinary';
import { useSelector, useDispatch } from 'react-redux';
import { createMenuItem } from '../../component/State/Menu/Action';
import { useEffect } from 'react';
import { getDossageOfPharmacy } from '../../component/State/Dossage/Action';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Medicine name is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  category: Yup.object().required('Category is required'),
  dossage: Yup.array().min(1, 'At least one dosage is required'),
  images: Yup.array().min(1, 'At least one image is required')
});

const initialValues = {
    name: "",
    description: "",
    price: "",
    category: "",
    pharmacyId: '',
    vegetarian: true,
    seasonal: false,
    dossage: [],
    images: []
}

const CreateMenuForm = () => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const { pharmacy, dossage } = useSelector(store => store);
    const [uploadImage, setUploadImage] = useState(false);
    const [successSnackbar, setSuccessSnackbar] = useState(false);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            values.pharmacyId = pharmacy.usersPharmacy.id;
            dispatch(createMenuItem({ menu: values, jwt }))
                .then(() => {
                    setSuccessSnackbar(true);
                    resetForm();
                });
        }
    });

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setUploadImage(true);
        try {
            const image = await uploadImageToCloudinary(file);
            formik.setFieldValue("images", [...formik.values.images, image]);
        } catch (error) {
            console.error("Image upload failed:", error);
        } finally {
            setUploadImage(false);
        }
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...formik.values.images];
        updatedImages.splice(index, 1);
        formik.setFieldValue("images", updatedImages);
    };

    useEffect(() => {
        dispatch(getDossageOfPharmacy({ jwt, id: pharmacy.usersPharmacy.id }));
    }, []);

    const handleCloseSnackbar = () => {
        setSuccessSnackbar(false);
    };

    const hasError = (field) => {
        return formik.touched[field] && Boolean(formik.errors[field]);
    };

    const getHelperText = (field) => {
        return formik.touched[field] && formik.errors[field];
    };

    return (
        <Box className="py-10 px-5 flex items-center justify-center min-h-screen bg-gray-50">
            <Paper elevation={3} className="lg:max-w-4xl w-full p-8 rounded-xl">
                <Typography variant="h4" className="font-bold text-center py-4 text-gray-800">
                    Add New Medicine
                </Typography>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <Grid container spacing={3}>
                        <Grid className="flex flex-wrap gap-4" item xs={12}>
                            <input
                                accept="image/*"
                                id="fileInput"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                                type="file"
                            />

                            <label className="relative" htmlFor="fileInput">
                                <Box className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                                    <AddPhotoAlternate className="text-blue-500" />
                                </Box>
                                {uploadImage && (
                                    <Box className="absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center bg-black bg-opacity-20 rounded-lg">
                                        <CircularProgress size={24} />
                                    </Box>
                                )}
                            </label>

                            <Box className="flex flex-wrap gap-3">
                                {formik.values.images.map((image, index) => (
                                    <Box key={index} className="relative group">
                                        <img
                                            className="w-24 h-24 object-cover rounded-lg shadow-sm"
                                            src={image}
                                            alt="Medicine preview"
                                        />
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                backgroundColor: 'rgba(255,255,255,0.8)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255,1)'
                                                }
                                            }}
                                            onClick={() => handleRemoveImage(index)}
                                        >
                                            <CloseIcon sx={{ fontSize: "1rem", color: "error.main" }} />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                            {hasError('images') && (
                                <FormHelperText error className="w-full">
                                    {getHelperText('images')}
                                </FormHelperText>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                label="Medicine Name"
                                variant="outlined"
                                size="small"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                                error={hasError('name')}
                                helperText={getHelperText('name')}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        ...(hasError('name') && {
                                            '& fieldset': {
                                                borderColor: 'red',
                                            },
                                        }),
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="description"
                                name="description"
                                label="Description"
                                variant="outlined"
                                size="small"
                                multiline
                                rows={3}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.description}
                                error={hasError('description')}
                                helperText={getHelperText('description')}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        ...(hasError('description') && {
                                            '& fieldset': {
                                                borderColor: 'red',
                                            },
                                        }),
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} lg={6}>
                            <TextField
                                fullWidth
                                id="price"
                                name="price"
                                label="Price"
                                variant="outlined"
                                size="small"
                                type="number"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.price}
                                error={hasError('price')}
                                helperText={getHelperText('price')}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        ...(hasError('price') && {
                                            '& fieldset': {
                                                borderColor: 'red',
                                            },
                                        }),
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} lg={6}>
                            <FormControl 
                                fullWidth 
                                size="small"
                                error={hasError('category')}
                            >
                                <InputLabel id="category-label">Category</InputLabel>
                                <Select
                                    labelId="category-label"
                                    id="category"
                                    value={formik.values.category}
                                    label="Category"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    name="category"
                                    sx={{
                                        borderRadius: '8px',
                                        ...(hasError('category') && {
                                            '& fieldset': {
                                                borderColor: 'red',
                                            },
                                        }),
                                    }}
                                >
                                    {pharmacy.categories?.map((item) => (
                                        <MenuItem key={item.id} value={item}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {hasError('category') && (
                                    <FormHelperText error>
                                        {getHelperText('category')}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl 
                                fullWidth 
                                size="small"
                                error={hasError('dossage')}
                            >
                                <InputLabel id="dossage-label">Dosage</InputLabel>
                                <Select
                                    labelId="dossage-label"
                                    id="dossage"
                                    name="dossage"
                                    multiple
                                    value={formik.values.dossage}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    input={<OutlinedInput id="select-dossage" label="Dosage" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value.id} label={value.name} sx={{ backgroundColor: '#e3f2fd', color: 'primary.main' }} />
                                            ))}
                                        </Box>
                                    )}
                                    sx={{
                                        borderRadius: '8px',
                                        ...(hasError('dossage') && {
                                            '& fieldset': {
                                                borderColor: 'red',
                                            },
                                        }),
                                    }}
                                >
                                    {dossage.dossage?.map((item) => (
                                        <MenuItem key={item.id} value={item}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {hasError('dossage') && (
                                    <FormHelperText error>
                                        {getHelperText('dossage')}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} lg={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="seasonal-label">Seasonal</InputLabel>
                                <Select
                                    labelId="seasonal-label"
                                    id="seasonal"
                                    value={formik.values.seasonal}
                                    label="Seasonal"
                                    onChange={formik.handleChange}
                                    name="seasonal"
                                    sx={{
                                        borderRadius: '8px',
                                    }}
                                >
                                    <MenuItem value={true}>Yes</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} lg={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="vegetarian-label">Vegetarian</InputLabel>
                                <Select
                                    labelId="vegetarian-label"
                                    id="vegetarian"
                                    value={formik.values.vegetarian}
                                    label="Vegetarian"
                                    onChange={formik.handleChange}
                                    name="vegetarian"
                                    sx={{
                                        borderRadius: '8px',
                                    }}
                                >
                                    <MenuItem value={true}>Yes</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} className="flex justify-center pt-4">
                            <Button
                                variant="contained"
                                type="submit"
                                sx={{
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    padding: '10px 24px',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                                    }
                                }}
                            >
                                Add Medicine
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Snackbar
                open={successSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Medicine added successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CreateMenuForm;