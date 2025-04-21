import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styled } from '@mui/system';
import { Typography, Box } from '@mui/material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import MedicationIcon from '@mui/icons-material/Medication';

const ItemContainer = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1.5),
  cursor: 'pointer',
  position: 'relative',
  transition: 'all 0.3s ease'
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '50%',
  overflow: 'hidden',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
  border: '4px solid white',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',

  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(13, 148, 136, 0.2), rgba(49, 46, 129, 0.2))',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },

  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
    border: '4px solid rgba(13, 148, 136, 0.7)',

    '&::after': {
      opacity: 1
    }
  }
}));

const ItemIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: 'white',
  borderRadius: '50%',
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  zIndex: 10
}));

const ItemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginTop: theme.spacing(2.5),
  textAlign: 'center',
  transition: 'all 0.3s ease',
  position: 'relative',

  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0',
    height: '2px',
    backgroundColor: '#0d9488',
    transition: 'width 0.3s ease'
  }
}));

const CarouselItem = ({ image, title, isMedicine }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isMedicine) {
      navigate(`/search?medicine=${encodeURIComponent(title)}`);
      //search?medicine=${encodeURIComponent(title)})
    } else {
      navigate(`/search?category=${encodeURIComponent(title)}`);
      //search?category=${encodeURIComponent(title)}
    }
  };

  return (
    <ItemContainer
      onClick={handleClick}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ImageContainer>
        <img
          style={{
            width: isMedicine ? '11rem' : '12rem',
            height: isMedicine ? '11rem' : '12rem',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
          src={image}
          alt={title}
        />
        <ItemIcon>
          {isMedicine ? (
            <MedicationIcon sx={{ fontSize: '16px', color: '#0d9488' }} />
          ) : (
            <LocalPharmacyIcon sx={{ fontSize: '16px', color: '#1d4ed8' }} />
          )}
        </ItemIcon>
      </ImageContainer>

      <motion.div
        whileHover={{
          scale: 1.05
        }}
      >
        <ItemTitle 
          variant="subtitle1"
          sx={(theme) => ({
            fontSize: { xs: '0.95rem', sm: '1.1rem' },
            color: theme.palette.text.primary,
            '&:hover': {
              color: '#0d9488',
              '&::after': {
                width: '70%'
              }
            }
          })}
        >
          {title}
        </ItemTitle>
      </motion.div>
    </ItemContainer>
  );
};

export default CarouselItem;