import { api } from "../../config/api.js";
import {SEARCH_FAILURE,SEARCH_SUCCESS,SEARCH_REQUEST,SEARCH_MEDICINES_FAILURE,SEARCH_MEDICINES_REQUEST,SEARCH_MEDICINES_SUCCESS,SEARCH_PHARMACIES_BY_CATEGORY_FAILURE,SEARCH_PHARMACIES_BY_CATEGORY_REQUEST,SEARCH_PHARMACIES_BY_CATEGORY_SUCCESS
,SEARCH_PHARMACIES_BY_MEDICINE_FAILURE,SEARCH_PHARMACIES_BY_MEDICINE_REQUEST,SEARCH_PHARMACIES_BY_MEDICINE_SUCCESS,SEARCH_PHARMACIES_FAILURE,SEARCH_PHARMACIES_REQUEST,SEARCH_PHARMACIES_SUCCESS,FILTERED_SEARCH_FAILURE,FILTERED_SEARCH_REQUEST,FILTERED_SEARCH_SUCCESS,CLEAR_SEARCH} from './ActionType';

// General search across both pharmacies and medicines
export const searchAll = ({ query, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: SEARCH_REQUEST });
    
    try {
      const { data } = await api.get(`/api/search`, {
        params: { query },
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("SEARCH_ALL Response:", data);

      const formattedData = data.map(item => {
        const baseItem = {
          id: item.id,
          name: item.name,
          type: item.type,
          description: item.description || '',
          images: item.images || []
        };

        if (item.type === 'pharmacy') {
          return {
            ...baseItem,
            address: item.address || {},
            open: item.open !== undefined ? item.open : true
          };
        } else if (item.type === 'medicine') {
          return {
            ...baseItem,
            price: item.price || 0,
            category: item.category || 'Unknown',
            available: item.available !== undefined ? item.available : false,
            pharmacy: item.pharmacy || null,
            isVegetarian: item.isVegetarian || false,
            isSeasonal: item.isSeasonal || false,
            manufacturingDate: item.manufacturingDate || null,
            dosage: item.dosage || []
          };
        }
        return baseItem;
      });

      dispatch({
        type: SEARCH_SUCCESS,
        payload: formattedData
      });

    } catch (error) {
      dispatch({
        type: SEARCH_FAILURE,
        payload: {
          message: error.response?.data?.message || 'Search failed',
          status: error.response?.status,
          error: error.message
        }
      });
    }
  };
};

// Search Pharmacies by Name
export const searchPharmaciesByName = ({ name, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: SEARCH_PHARMACIES_REQUEST });
    
    try {
      const { data } = await api.get(`/api/search/pharmacies`, {
        params: { name },
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("SEARCH_PHARMACIES_BY_NAME Response:", data);

      const formattedData = data.map(pharmacy => ({
        id: pharmacy.id,
        name: pharmacy.name,
        address: pharmacy.address || {},
        open: pharmacy.open !== undefined ? pharmacy.open : true,
        images: pharmacy.images || [],
        description: pharmacy.description || ''
      }));

      dispatch({
        type: SEARCH_PHARMACIES_SUCCESS,
        payload: formattedData
      });

    } catch (error) {
      dispatch({
        type: SEARCH_PHARMACIES_FAILURE,
        payload: error.response?.data?.message || 'Pharmacy search failed'
      });
    }
  };
};

// Search Pharmacies by Medicine
export const searchPharmaciesByMedicine = ({ medicineName, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: SEARCH_PHARMACIES_BY_MEDICINE_REQUEST });
    
    try {
      const { data } = await api.get(`/api/search/pharmacies/by-medicine`, {
        params: { medicineName },
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });

      // Transform data to include medicine information
      const pharmaciesWithMedicine = data.map(pharmacy => ({
        ...pharmacy,
        type: 'pharmacy',
        // Add medicine info if available from backend
        medicines: pharmacy.medicines || [],
        highlightText: medicineName
      }));

      dispatch({
        type: SEARCH_PHARMACIES_BY_MEDICINE_SUCCESS,
        payload: pharmaciesWithMedicine
      });

    } catch (error) {
      dispatch({
        type: SEARCH_PHARMACIES_BY_MEDICINE_FAILURE,
        payload: error.response?.data?.message || 
               `No pharmacies found carrying ${medicineName}`
      });
    }
  };
};

export const searchPharmaciesByCategory = ({ categoryName, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: SEARCH_PHARMACIES_BY_CATEGORY_REQUEST });
    
    try {
      const { data } = await api.get(`/api/search/pharmacies/by-category`, {
        params: { categoryName },
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });

      const pharmaciesWithCategory = data.map(pharmacy => ({
        ...pharmacy,
        type: 'pharmacy',
        highlightText: categoryName
      }));

      dispatch({
        type: SEARCH_PHARMACIES_BY_CATEGORY_SUCCESS,
        payload: pharmaciesWithCategory
      });

    } catch (error) {
      dispatch({
        type: SEARCH_PHARMACIES_BY_CATEGORY_FAILURE,
        payload: error.response?.data?.message || 
               `No pharmacies found in category ${categoryName}`
      });
    }
  };
};

// Search Medicines by Name
export const searchMedicinesByName = ({ name, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: SEARCH_MEDICINES_REQUEST });
    
    try {
      const { data } = await api.get(`/api/search/medicines`, {
        params: { name },
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("SEARCH_MEDICINES_BY_NAME Response:", data);

      const formattedData = data.map(medicine => ({
        id: medicine.id,
        name: medicine.name,
        description: medicine.description || '',
        price: medicine.price || 0,
        category: medicine.category || 'Unknown',
        images: medicine.images || [],
        available: medicine.available !== undefined ? medicine.available : false,
        pharmacy: medicine.pharmacy || null,
        isVegetarian: medicine.isVegetarian || false,
        isSeasonal: medicine.isSeasonal || false,
        manufacturingDate: medicine.manufacturingDate || null,
        dosage: medicine.dosage || []
      }));

      dispatch({
        type: SEARCH_MEDICINES_SUCCESS,
        payload: formattedData
      });

    } catch (error) {
      dispatch({
        type: SEARCH_MEDICINES_FAILURE,
        payload: error.response?.data?.message || 'Medicine search failed'
      });
    }
  };
};

// Filtered Search
export const filteredSearch = ({ query, type, medicine, category, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: FILTERED_SEARCH_REQUEST });
    
    try {
      const { data } = await api.get(`/api/search/filtered`, {
        params: { query, type, medicine, category },
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("FILTERED_SEARCH Response:", data);

      const formattedData = data.map(item => {
        const baseItem = {
          id: item.id,
          name: item.name,
          type: item.type,
          description: item.description || '',
          images: item.images || []
        };

        if (item.type === 'pharmacy') {
          return {
            ...baseItem,
            address: item.address || {},
            open: item.open !== undefined ? item.open : true
          };
        } else if (item.type === 'medicine') {
          return {
            ...baseItem,
            price: item.price || 0,
            category: item.category || 'Unknown',
            available: item.available !== undefined ? item.available : false,
            pharmacy: item.pharmacy || null,
            isVegetarian: item.isVegetarian || false,
            isSeasonal: item.isSeasonal || false,
            manufacturingDate: item.manufacturingDate || null,
            dosage: item.dosage || []
          };
        }
        return baseItem;
      });

      dispatch({
        type: FILTERED_SEARCH_SUCCESS,
        payload: formattedData
      });

    } catch (error) {
      dispatch({
        type: FILTERED_SEARCH_FAILURE,
        payload: error.response?.data?.message || 'Filtered search failed'
      });
    }
  };
};

// Clear Search
export const clearSearch = () => ({ type: CLEAR_SEARCH });
