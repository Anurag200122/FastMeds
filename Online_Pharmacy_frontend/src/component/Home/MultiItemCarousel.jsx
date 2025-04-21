import React, { useRef } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CarouselItem from './CarouselItem';
import { motion } from 'framer-motion';
import { Box, Typography, IconButton, styled } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(1),
  
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '40%',
    height: '3px',
    background: 'linear-gradient(90deg, #0d9488, #06b6d4)',
    borderRadius: '2px',
    bottom: '-8px',
    left: 0
  }
}));

const SliderArrowButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'white',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  zIndex: 10,
  opacity: 0.8,
  transition: 'all 0.3s ease',
  
  '&:hover': {
    backgroundColor: 'white',
    opacity: 1,
    transform: 'translateY(-50%) scale(1.1)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
  }
}));

const MultiItemCarousel = ({ items, title }) => {
  const sliderRef = useRef(null);
  
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 5,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 4, slidesToScroll: 2 }
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 1 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 }
      }
    ]
  };
  
  const handlePrev = () => {
    sliderRef.current.slickPrev();
  };
  
  const handleNext = () => {
    sliderRef.current.slickNext();
  };

  return (
    <motion.div 
      className='carousel-container'
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.3 }}
      style={{ marginBottom: '4rem', position: 'relative' }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4
      }}>
        <Box>
          <SectionTitle variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem' } }}>
            {title}
          </SectionTitle>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: 2, maxWidth: '600px' }}
          >
            {title.includes("Category") ? 
              "Browse our curated collection of medical categories to find exactly what you need." : 
              "Discover the most popular medications trusted by thousands of customers."}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <SliderArrowButton
            onClick={handlePrev}
            size="small"
          >
            <ArrowBackIosNewIcon fontSize="small" sx={{ color: '#0d9488' }} />
          </SliderArrowButton>
          <SliderArrowButton
            onClick={handleNext}
            size="small"
          >
            <ArrowForwardIosIcon fontSize="small" sx={{ color: '#0d9488' }} />
          </SliderArrowButton>
        </Box>
      </Box>
      
      <Box sx={{ 
        mx: -2, // Compensate for item padding
        overflow: 'hidden',
        '.slick-track': {
          display: 'flex',
          gap: 2
        }
      }}>
        <Slider ref={sliderRef} {...settings}>
          {items.map((item, index) => (
            <Box key={`${item.title}-${index}`} sx={{ px: 2 }}>
              <CarouselItem 
                image={item.image}
                title={item.title}
                isMedicine={item.medicine}
              />
            </Box>
          ))}
        </Slider>
      </Box>
    </motion.div>
  );
};

export default MultiItemCarousel;