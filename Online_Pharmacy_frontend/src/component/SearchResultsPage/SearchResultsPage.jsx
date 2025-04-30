import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Grid,
  Chip,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  LocalPharmacy as PharmacyIcon,
  MedicalServices as MedicineIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import {
  searchAll,
  searchPharmaciesByName,
  searchPharmaciesByMedicine,
  searchPharmaciesByCategory,
  searchMedicinesByName,
  filteredSearch,
  clearSearch
} from '../State/Search/Action';
import PharmacyCard from '../Pharmacy/PharmacyCard';

const SearchResultsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query');
  const type = searchParams.get('type');
  const medicine = searchParams.get('medicine');
  const category = searchParams.get('category');

  const {
    results,
    loading,
    error,
    pharmacies,
    pharmaciesLoading,
    pharmaciesError,
    medicines,
    medicinesLoading,
    medicinesError,
    filteredResults,
    filteredLoading,
    filteredError
  } = useSelector((state) => state.search);

  useEffect(() => {
    dispatch(clearSearch());

    if (query && !type && !medicine && !category) {
      dispatch(searchAll({ query, jwt: localStorage.getItem('jwt') }));
    } else if (type === 'pharmacy' && query) {
      dispatch(searchPharmaciesByName({ name: query, jwt: localStorage.getItem('jwt') }));
    } else if (type === 'medicine' && query) {
      dispatch(searchMedicinesByName({ name: query, jwt: localStorage.getItem('jwt') }));
    } else if (medicine) {
      dispatch(searchPharmaciesByMedicine({ medicineName: medicine, jwt: localStorage.getItem('jwt') }));
    } else if (category) {
      dispatch(searchPharmaciesByCategory({ categoryName: category, jwt: localStorage.getItem('jwt') }));
    } else if (type || medicine || category) {
      dispatch(filteredSearch({ 
        query,
        type, 
        medicine, 
        category, 
        jwt: localStorage.getItem('jwt') 
      }));
    }
  }, [dispatch, query, type, medicine, category]);

  const handlePharmacyClick = (pharmacy) => {
    navigate(`/pharmacy/${pharmacy.address?.city}/${pharmacy.name}/${pharmacy.id}`);
  };

  const handleMedicineClick = (medicineItem) => {
    if (medicineItem.pharmacy) {
      navigate(`/pharmacy/${medicineItem.pharmacy.address?.city}/${medicineItem.pharmacy.name}/${medicineItem.pharmacy.id}`);
    }
  };

  const renderPharmacyResults = (items) => {
    if (!items || items.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography variant="body1">No pharmacies found</Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {items.map((pharmacy) => (
          <Grid item xs={12} sm={6} md={4} key={`pharmacy-${pharmacy.id}`}>
            <PharmacyCard 
              item={pharmacy} 
              showStatus={true}
              onClick={() => handlePharmacyClick(pharmacy)}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderMedicineResults = (items) => {
    if (!items || items.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography variant="body1">No medicines found</Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {items.map((medicine) => (
          <Grid item xs={12} key={`medicine-${medicine.id}`}>
            <Box 
              sx={{ 
                p: 3,
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                display: 'flex',
                gap: 3,
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                  borderColor: 'primary.main'
                }
              }}
              onClick={() => handleMedicineClick(medicine)}
            >
              {/* Medicine Image */}
              <Box sx={{ 
                width: '120px', 
                height: '120px',
                flexShrink: 0,
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <img 
                  src={medicine.images[0]} 
                  alt={medicine.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover'
                  }}
                />
              </Box>
              
              {/* Medicine Details */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {medicine.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {medicine.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Chip 
                    label={medicine.category} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                  />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    ${medicine.price}
                  </Typography>
                </Box>
              </Box>
              
              {/* Pharmacy Info */}
              <Box sx={{ 
                width: '200px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end'
              }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Available at:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {medicine.pharmacy.name}
                    </Typography>
                    <Box sx={{ 
                      width: '40px', 
                      height: '40px',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src={medicine.pharmacy.images[0]} 
                        alt={medicine.pharmacy.name}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {medicine.pharmacy.address.city}, {medicine.pharmacy.address.stateProvince}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  };

  if (loading || pharmaciesLoading || medicinesLoading || filteredLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || pharmaciesError || medicinesError || filteredError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography color="error">
          {error?.message || pharmaciesError?.message || medicinesError?.message || filteredError?.message || 'An error occurred'}
        </Typography>
      </Box>
    );
  }

  const getDisplayResults = () => {
    if (type === 'pharmacy') return pharmacies || [];
    if (type === 'medicine') return medicines || [];
    if (medicine) return pharmacies || [];
    if (category) return pharmacies || [];
    return results || [];
  };

  const displayResults = getDisplayResults();
  const hasPharmacies = displayResults.some(item => item.type === 'pharmacy');
  const hasMedicines = displayResults.some(item => item.type === 'medicine');

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate('/')}
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Typography color="text.primary">
          {medicine ? `Pharmacies with ${medicine}` : 
           category ? `${category} Pharmacies` : 
           `Search Results`}
        </Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom>
        Search Results
      </Typography>
      
      {query && !medicine && !category && (
        <Typography variant="subtitle1" gutterBottom>
          Showing results for: <strong>{query}</strong>
        </Typography>
      )}
      
      {medicine && (
        <Typography variant="subtitle1" gutterBottom>
          Pharmacies carrying: <strong>{medicine}</strong>
        </Typography>
      )}
      
      {category && (
        <Typography variant="subtitle1" gutterBottom>
          Pharmacies in category: <strong>{category}</strong>
        </Typography>
      )}
      
      <Divider sx={{ my: 3 }} />

      {hasPharmacies && (
        <>
          <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <PharmacyIcon color="primary" sx={{ mr: 1 }} />
            Pharmacies
            {medicine && <Chip label="Filtered by medicine" size="small" sx={{ ml: 2 }} />}
            {category && <Chip label="Filtered by category" size="small" sx={{ ml: 2 }} />}
          </Typography>
          {renderPharmacyResults(displayResults.filter(item => item.type === 'pharmacy'))}
        </>
      )}

      {hasMedicines && (
        <>
          <Typography variant="h5" sx={{ 
            mb: 2, 
            mt: hasPharmacies ? 4 : 0, 
            display: 'flex', 
            alignItems: 'center' 
          }}>
            <MedicineIcon color="secondary" sx={{ mr: 1 }} />
            Medicines
          </Typography>
          {renderMedicineResults(displayResults.filter(item => item.type === 'medicine'))}
        </>
      )}

      {!hasPharmacies && !hasMedicines && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '300px'
        }}>
          <Typography variant="h6" color="text.secondary">
            No results found for your search
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SearchResultsPage;