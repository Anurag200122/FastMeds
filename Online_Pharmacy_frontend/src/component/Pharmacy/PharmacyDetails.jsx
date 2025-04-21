import { Divider, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography, Box, Fade, Container, Paper, Chip, Card, CardContent, CardActionArea, Avatar, Skeleton, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MenuCard from './MenuCard';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPharmacyById, getPharmacyCategory } from '../State/Pharmacy/Action.js';
import { getMenuItemsByPharmacyId } from '../State/Menu/Action.js'
import { motion } from 'framer-motion';

// Animation variants for elements
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const medicineTypes = [
    { label: "All Medicines", value: "all", icon: "💊" },
    { label: "Vegetarian Only", value: "vegetarian", icon: "🌱" },
    { label: "Seasonal Only", value: "seasonal", icon: "🍂" },
]

// Custom animated radio component
const AnimatedRadio = ({ label, value, currentValue, onChange, icon }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        variant="outlined" 
        className={`mb-3 cursor-pointer transition-all duration-300 ${currentValue === value ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}
        onClick={() => onChange({ target: { value } })}
        elevation={currentValue === value ? 3 : 0}
      >
        <CardActionArea>
          <CardContent className="flex items-center gap-3 py-3">
            <Radio 
              checked={currentValue === value} 
              value={value} 
              color="primary" 
              sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
            />
            <Typography variant="body1" className="flex-1">
              {icon && <span className="mr-2">{icon}</span>}
              {label}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </motion.div>
  );
};

const PharmacyDetails = () => {
    const [medicineType, setMedicineType] = useState("all")
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const { auth, pharmacy, menu } = useSelector(store => store);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showHeader, setShowHeader] = useState(false);

    const { id, city } = useParams();

    const handleFilter = (e) => {
        setMedicineType(e.target.value)
    }

    const handleFilterCategory = (e, value) => {
        setSelectedCategory(value || e.target.value)
    }

    useEffect(() => {
        setLoading(true);
        dispatch(getPharmacyById({ jwt, pharmacyId: id }))
        dispatch(getPharmacyCategory({ jwt, pharmacyId: id }))
        
        // Simulate loading for smooth transition
        const timer = setTimeout(() => {
          setLoading(false);
          setTimeout(() => setShowHeader(true), 300);
        }, 600);
        
        return () => clearTimeout(timer);
    }, [id, jwt, dispatch]);

    useEffect(() => {
        dispatch(getMenuItemsByPharmacyId({
            jwt,
            pharmacyId: id,
            vegetarian: medicineType === "vegetarian",
            seasonal: medicineType === "seasonal",
            medicineCategory: selectedCategory,
        }));
    }, [selectedCategory, medicineType, id, jwt, dispatch])

    // Create gallery array from pharmacy images
    const galleryImages = pharmacy.pharmacy?.images 
        ? [pharmacy.pharmacy.images[0], 
           "https://img.p.mapq.st/?url=https://s3-media0.fl.yelpcdn.com/bphoto/sEzet3K6KMjAuVgdvd1udQ/l.jpg?w=3840&q=75",
           "https://www.modernretail.co/wp-content/uploads/sites/5/2019/06/cvs.jpg?w=1278&h=600&crop=1"]
        : [];

    return (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="min-h-screen bg-gray-50"
        >
            <Container maxWidth="xl" className="pt-6 pb-12">
                {loading ? (
                    <Box className="space-y-6">
                        <Skeleton variant="rectangular" height={400} className="rounded-lg" />
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Skeleton variant="rectangular" height={300} className="rounded-lg" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Skeleton variant="rectangular" height={300} className="rounded-lg" />
                            </Grid>
                        </Grid>
                        <Skeleton variant="text" height={60} width="60%" />
                        <Skeleton variant="text" height={100} />
                    </Box>
                ) : (
                    <>
                        <Fade in={showHeader} timeout={800}>
                            <section className="mb-8">
                                <Box className="relative h-[60vh] mb-4 overflow-hidden rounded-xl shadow-lg">
                                    {galleryImages.length > 0 && (
                                        <img 
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                                            src={galleryImages[0]} 
                                            alt={pharmacy.pharmacy?.name} 
                                        />
                                    )}
                                    <Box className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <Box className="absolute bottom-0 left-0 p-8 w-full">
                                        <Typography variant="h3" component="h1" className="text-white font-bold mb-2">
                                            {pharmacy.pharmacy?.name}
                                        </Typography>
                                        <Box className="flex flex-wrap gap-3 mb-4">
                                            {pharmacy.categories?.slice(0, 3).map((category) => (
                                                <Chip 
                                                    key={category.name}
                                                    label={category.name}
                                                    color="primary"
                                                    size="small"
                                                    className="bg-white/20 backdrop-blur-sm"
                                                />
                                            ))}
                                        </Box>
                                        <Box className="flex gap-4 text-white/90">
                                            <Box className="flex items-center gap-1">
                                                <LocationOnIcon fontSize="small" />
                                                <Typography variant="body2">
                                                    {pharmacy.pharmacy?.address.streetAddress}
                                                </Typography>
                                            </Box>
                                            <Box className="flex items-center gap-1">
                                                <AccessTimeIcon fontSize="small" />
                                                <Typography variant="body2">
                                                    {pharmacy.pharmacy?.openingHours}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>

                                <Grid container spacing={2} className="mb-6">
                                    {galleryImages.slice(1).map((image, index) => (
                                        <Grid item xs={12} md={6} key={index}>
                                            <motion.div 
                                                whileHover={{ y: -5 }}
                                                className="overflow-hidden rounded-lg shadow-md h-[40vh]"
                                            >
                                                <img 
                                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                                                    src={image} 
                                                    alt={`Pharmacy view ${index + 1}`} 
                                                />
                                            </motion.div>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Paper elevation={0} className="p-6 rounded-xl bg-white/80 backdrop-blur-sm">
                                    <Typography variant="body1" className="text-gray-700 leading-relaxed">
                                        {pharmacy.pharmacy?.description}
                                    </Typography>
                                </Paper>
                            </section>
                        </Fade>

                        <Divider className="my-8" />

                        <motion.section 
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="pt-4"
                        >
                            <Grid container spacing={4}>
                                <Grid item xs={12} lg={3}>
                                    <Box className="sticky top-24">
                                        <Paper elevation={3} className="p-5 rounded-xl mb-6 bg-white">
                                            <Typography variant="h6" className="font-bold mb-4 flex items-center">
                                                <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center mr-2">💊</span>
                                                Medicine Type
                                            </Typography>
                                            <FormControl component="fieldset" className="w-full">
                                                {medicineTypes.map((item) => (
                                                    <AnimatedRadio
                                                        key={item.value}
                                                        label={item.label}
                                                        value={item.value}
                                                        icon={item.icon}
                                                        currentValue={medicineType}
                                                        onChange={handleFilter}
                                                    />
                                                ))}
                                            </FormControl>
                                        </Paper>

                                        <Paper elevation={3} className="p-5 rounded-xl bg-white">
                                            <Typography variant="h6" className="font-bold mb-4 flex items-center">
                                                <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center mr-2">🔍</span>
                                                Categories
                                            </Typography>
                                            <FormControl component="fieldset" className="w-full">
                                                <Box className="space-y-2">
                                                    <AnimatedRadio
                                                        label="All Categories"
                                                        value=""
                                                        currentValue={selectedCategory}
                                                        onChange={handleFilterCategory}
                                                    />
                                                    {pharmacy.categories?.map((item) => (
                                                        <AnimatedRadio
                                                            key={item.name}
                                                            label={item.name}
                                                            value={item.name}
                                                            currentValue={selectedCategory}
                                                            onChange={handleFilterCategory}
                                                        />
                                                    ))}
                                                </Box>
                                            </FormControl>
                                        </Paper>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} lg={9}>
                                    <motion.div variants={staggerContainer} className="mb-6">
                                        <Typography variant="h5" className="font-bold mb-4">
                                            Available Medicines
                                            {selectedCategory && <span className="text-primary-600 ml-2">• {selectedCategory}</span>}
                                            {medicineType !== "all" && (
                                                <Chip 
                                                    size="small" 
                                                    label={medicineTypes.find(t => t.value === medicineType)?.label} 
                                                    color="primary" 
                                                    onDelete={() => setMedicineType("all")}
                                                    className="ml-2"
                                                />
                                            )}
                                        </Typography>
                                        
                                        {menu.menuItems && menu.menuItems.length === 0 ? (
                                            <Paper className="p-12 text-center rounded-xl">
                                                <Typography variant="h6" className="text-gray-500">
                                                    No medicines found matching your filters
                                                </Typography>
                                                <Button 
                                                    variant="outlined" 
                                                    onClick={() => {
                                                        setMedicineType("all");
                                                        setSelectedCategory("");
                                                    }}
                                                    className="mt-4"
                                                >
                                                    Reset Filters
                                                </Button>
                                            </Paper>
                                        ) : (
                                            <Grid container spacing={3}>
                                                {menu.menuItems?.map((item, index) => (
                                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                                        <motion.div
                                                            variants={fadeInUp}
                                                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                                        >
                                                            <MenuCard item={item} />
                                                        </motion.div>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        )}
                                    </motion.div>
                                </Grid>
                            </Grid>
                        </motion.section>
                    </>
                )}
            </Container>
        </motion.div>
    )
}

export default PharmacyDetails