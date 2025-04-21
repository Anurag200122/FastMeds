import React from 'react';
import { Button, Card, Typography, Box, Chip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';

const addressIcons = {
  home: <HomeIcon color="primary" />,
  work: <WorkIcon color="primary" />,
  other: <OtherHousesIcon color="primary" />,
};

const AddressCard = ({ item, showButton, handleSelectAddress, selected }) => {
  const addressType = item?.addressType?.toLowerCase() || 'home';
  const IconComponent = addressIcons[addressType] || <LocationOnIcon color="primary" />;

  return (
    <Card sx={{
      width: 264,
      p: 2,
      border: selected ? '2px solid #e91e63' : '1px solid #e0e0e0',
      cursor: 'pointer',
      '&:hover': {
        borderColor: '#e91e63'
      }
    }}>
      <Box display="flex" alignItems="center" mb={2}>
        {IconComponent}
        <Typography variant="h6" ml={1} sx={{ textTransform: 'capitalize' }}>
          {item?.addressType || 'Home'}
        </Typography>
      </Box>
      
      <Typography variant="body1" mb={1}>
        {item?.streetAddress || 'No address specified'}
      </Typography>
      <Typography variant="body1" mb={1}>
        {item?.city}, {item?.state} {item?.postalCode}
      </Typography>
      <Typography variant="body1" mb={2}>
        {item?.country || 'USA'}
      </Typography>

      {item?.default && (
        <Chip 
          label="Default" 
          size="small" 
          color="primary" 
          sx={{ mb: 2 }}
        />
      )}
      
      {showButton && (
        <Button 
          variant={selected ? 'contained' : 'outlined'} 
          fullWidth 
          onClick={() => handleSelectAddress(item)}
          color={selected ? 'primary' : 'inherit'}
          sx={{
            backgroundColor: selected ? '#e91e63' : '',
            '&:hover': {
              backgroundColor: selected ? '#c2185b' : ''
            }
          }}
        >
          {selected ? 'Selected' : 'Select'}
        </Button>
      )}
    </Card>
  );
};

export default AddressCard;