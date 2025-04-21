import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPharmacyAction } from '../State/Pharmacy/Action';
import { motion } from 'framer-motion';
import MultiItemCarousel from './MultiItemCarousel';
import PharmacyCard from '../Pharmacy/PharmacyCard';
import { topCategories, topMedicines } from './TopMeds';
import { Box, Container, Typography, Button, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useNavigate } from 'react-router-dom';


// Styled components for the modernized UI
const StyledBanner = styled(Box)(({ theme }) => ({
  height: '90vh',
  width: '100%',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: 'url("https://images.pexels.com/photos/161449/medical-tablets-pills-drug-161449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(8px)',
    zIndex: 1
  }
}));

const BannerContent = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(3),
  maxWidth: '900px'
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(6),
  
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '60%',
    height: '4px',
    background: 'linear-gradient(90deg, #0d9488, #06b6d4)',
    borderRadius: '2px',
    bottom: '-8px',
    left: '20%'
  }
}));

const FeatureBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  height: '100%',
  
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)'
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px',
  padding: theme.spacing(1.5, 4),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  boxShadow: '0 10px 20px rgba(37, 99, 235, 0.15)',
  transition: 'all 0.3s ease',
  background: 'linear-gradient(90deg, #0d9488, #0891b2)',
  
  '&:hover': {
    boxShadow: '0 15px 25px rgba(37, 99, 235, 0.25)',
    transform: 'translateY(-3px)',
    background: 'linear-gradient(90deg, #0d9488, #0891b2)'
  },
  
  '&:active': {
    transform: 'translateY(0)'
  }
}));

// Framer Motion variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const Home = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { pharmacy } = useSelector(store => store);
  const theme = useTheme();

  useEffect(() => {
    dispatch(getAllPharmacyAction(jwt));
  }, [dispatch, jwt]);


const navigate= useNavigate();
  // Features data
  const features = [
    {
      icon: <InventoryIcon sx={{ fontSize: 48, color: '#0d9488' }} />,
      title: "Wide Selection",
      description: "Browse thousands of medications and healthcare products from trusted brands and manufacturers."
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 48, color: '#0d9488' }} />,
      title: "Fast Delivery",
      description: "Get your essential medications delivered right to your doorstep within hours."
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 48, color: '#0d9488' }} />,
      title: "Expert Support",
      description: "Our licensed pharmacists are available 24/7 to answer your questions and provide guidance."
    }
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Banner Section */}
      <StyledBanner>
        <BannerContent>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography 
              variant="h1" 
              sx={{
                fontWeight: 800,
                fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                background: 'linear-gradient(90deg, #ffffff, #94a3b8)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 5px 25px rgba(0, 0, 0, 0.2)',
                mb: 2
              }}
            >
              FastMeds
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 500, 
                mb: 4,
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                maxWidth: '700px'
              }}
            >
              Your Trusted Pharmacy. Fast, Reliable & Delivered to Your Door.
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <ActionButton 
              variant="contained" 
              color="primary" 
              size="large"
              disableElevation
            >
              Shop Now
            </ActionButton>
          </motion.div>
        </BannerContent>
      </StyledBanner>

      {/* Features Section */}
      <Box sx={{ 
        py: 10, 
        px: { xs: 2, sm: 4 },
        backgroundColor: 'rgba(237, 242, 247, 0.7)',
      }}>
        <Container maxWidth="lg">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <SectionTitle 
              variant="h2" 
              align="center"
              sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}
            >
              Why Choose FastMeds?
            </SectionTitle>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4
            }}>
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  variants={fadeInUp}
                >
                  <FeatureBox>
                    {feature.icon}
                    <Typography 
                      variant="h5" 
                      sx={{ fontWeight: 600, my: 2 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </FeatureBox>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Categories and Medicines Carousel Section */}
      <Box sx={{ 
        py: 10, 
        px: { xs: 2, sm: 4 },
        background: 'linear-gradient(180deg, rgba(237, 242, 247, 0.7) 0%, rgba(255, 255, 255, 1) 100%)'
      }}>
        <Container maxWidth="xl">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <MultiItemCarousel items={topCategories} title="Shop by Category" />
          </motion.div>
          
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <MultiItemCarousel items={topMedicines} title="Popular Medicines" />
          </motion.div>
        </Container>
      </Box>

      {/* Pharmacies Section */}
      <Box sx={{ py: 10, px: { xs: 2, sm: 4 }, backgroundColor: '#f8fafc' }}>
        <Container maxWidth="xl">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionTitle 
              variant="h2" 
              align="center"
              sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}
            >
              Handpicked Pharmacies Just for You
            </SectionTitle>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'center',
              gap: 4
            }}>
              {pharmacy.pharmacies?.map((item, index) => (
                <motion.div 
                  key={index} 
                  variants={fadeInUp}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <PharmacyCard item={item} />
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>
    
      
      
      {/* Call to Action Section */}
      <Box sx={{ 
        py: 10, 
        background: 'linear-gradient(135deg, #0d9488 0%, #155e75 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'url("https://images.pexels.com/photos/161449/medical-tablets-pills-drug-161449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)'
        }} />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{
              textAlign: 'center',
              color: 'white'
            }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' }
                }}
              >
                Ready to experience better pharmacy service?
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 400, 
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: '700px',
                  mx: 'auto',
                  fontSize: { xs: '1rem', sm: '1.1rem' }
                }}
              >
                Join thousands of satisfied customers who trust FastMeds for all their medication needs. Sign up today and get 20% off your first order!
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button onClick={()=>navigate("/account/register")}
                    variant="contained" 
                    sx={{
                      bgcolor: 'white',
                      color: '#0d9488',
                      borderRadius: '50px',
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                      }
                    }}
                  >
                    Sign Up Now
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
      
      {/* Footer Section */}
      <Box sx={{ 
        bgcolor: '#0f172a', 
        color: 'white',
        py: 6,
        px: { xs: 2, sm: 4 }
      }}>
        <Container maxWidth="lg">
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            textAlign: { xs: 'center', md: 'left' },
            gap: 4
          }}>
            </Box>
          
          <Box sx={{
            mt: 6,
            pt: 3,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center'
          }}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              © {new Date().getFullYear()} FastMeds. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;