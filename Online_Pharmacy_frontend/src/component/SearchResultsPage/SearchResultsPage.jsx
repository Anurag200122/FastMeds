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
import MenuCard from '../Pharmacy/MenuCard';

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

  const handleMedicineClick = (medicineItem) => {
    navigate(`/search?medicine=${encodeURIComponent(medicineItem.name)}`);
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
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={`pharmacy-${item.id}`}>
            <PharmacyCard item={item} />
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
        {items.map((item) => (
          <Grid item xs={12} key={`medicine-${item.id}`}>
            <MenuCard 
              item={item} 
              onClick={() => handleMedicineClick(item)}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  if (loading || pharmaciesLoading || medicinesLoading || filteredLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || pharmaciesError || medicinesError || filteredError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography color="error">
          {error?.message || pharmaciesError || medicinesError || filteredError}
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
          <Typography variant="h5" sx={{ mb: 2, mt: hasPharmacies ? 4 : 0, display: 'flex', alignItems: 'center' }}>
            <MedicineIcon color="secondary" sx={{ mr: 1 }} />
            Medicines
          </Typography>
          {renderMedicineResults(displayResults.filter(item => item.type === 'medicine'))}
        </>
      )}

      {!hasPharmacies && !hasMedicines && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography variant="body1">No results found</Typography>
        </Box>
      )}
    </Box>
  );
};

export default SearchResultsPage;