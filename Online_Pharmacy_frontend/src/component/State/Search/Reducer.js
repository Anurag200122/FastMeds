import {SEARCH_FAILURE,SEARCH_SUCCESS,SEARCH_REQUEST,SEARCH_MEDICINES_FAILURE,SEARCH_MEDICINES_REQUEST,SEARCH_MEDICINES_SUCCESS,SEARCH_PHARMACIES_BY_CATEGORY_FAILURE,SEARCH_PHARMACIES_BY_CATEGORY_REQUEST,SEARCH_PHARMACIES_BY_CATEGORY_SUCCESS
    ,SEARCH_PHARMACIES_BY_MEDICINE_FAILURE,SEARCH_PHARMACIES_BY_MEDICINE_REQUEST,SEARCH_PHARMACIES_BY_MEDICINE_SUCCESS,SEARCH_PHARMACIES_FAILURE,SEARCH_PHARMACIES_REQUEST,SEARCH_PHARMACIES_SUCCESS,FILTERED_SEARCH_FAILURE,FILTERED_SEARCH_REQUEST,FILTERED_SEARCH_SUCCESS,CLEAR_SEARCH} from './ActionType';
    

const initialState = {
    // General search
    results: [],
    loading: false,
    error: null,
    
    // Pharmacy searches
    pharmacies: [],
    pharmaciesLoading: false,
    pharmaciesError: null,
    
    // Medicine searches
    medicines: [],
    medicinesLoading: false,
    medicinesError: null,
    
    // Filtered search
    filteredResults: [],
    filteredLoading: false,
    filteredError: null
};

export const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        // General search cases
        case SEARCH_REQUEST:
            return { ...state, loading: true, error: null };
        case SEARCH_SUCCESS:
            return { ...state, loading: false, results: action.payload };
        case SEARCH_FAILURE:
            return { ...state, loading: false, error: action.payload };
            
        // Pharmacy by name cases
        case SEARCH_PHARMACIES_REQUEST:
            return { ...state, pharmaciesLoading: true, pharmaciesError: null };
        case SEARCH_PHARMACIES_SUCCESS:
            return { ...state, pharmaciesLoading: false, pharmacies: action.payload };
        case SEARCH_PHARMACIES_FAILURE:
            return { ...state, pharmaciesLoading: false, pharmaciesError: action.payload };
            
        // Pharmacy by medicine cases
        case SEARCH_PHARMACIES_BY_MEDICINE_REQUEST:
            return { ...state, pharmaciesLoading: true, pharmaciesError: null };
        case SEARCH_PHARMACIES_BY_MEDICINE_SUCCESS:
            return { ...state, pharmaciesLoading: false, pharmacies: action.payload };
        case SEARCH_PHARMACIES_BY_MEDICINE_FAILURE:
            return { ...state, pharmaciesLoading: false, pharmaciesError: action.payload };
            
        // Pharmacy by category cases
        case SEARCH_PHARMACIES_BY_CATEGORY_REQUEST:
            return { ...state, pharmaciesLoading: true, pharmaciesError: null };
        case SEARCH_PHARMACIES_BY_CATEGORY_SUCCESS:
            return { ...state, pharmaciesLoading: false, pharmacies: action.payload };
        case SEARCH_PHARMACIES_BY_CATEGORY_FAILURE:
            return { ...state, pharmaciesLoading: false, pharmaciesError: action.payload };
            
        // Medicine cases
        case SEARCH_MEDICINES_REQUEST:
            return { ...state, medicinesLoading: true, medicinesError: null };
        case SEARCH_MEDICINES_SUCCESS:
            return { ...state, medicinesLoading: false, medicines: action.payload };
        case SEARCH_MEDICINES_FAILURE:
            return { ...state, medicinesLoading: false, medicinesError: action.payload };
            
        // Filtered search cases
        case FILTERED_SEARCH_REQUEST:
            return { ...state, filteredLoading: true, filteredError: null };
        case FILTERED_SEARCH_SUCCESS:
            return { ...state, filteredLoading: false, filteredResults: action.payload };
        case FILTERED_SEARCH_FAILURE:
            return { ...state, filteredLoading: false, filteredError: action.payload };
            
        // Clear search
        case CLEAR_SEARCH:
            return { 
                ...state, 
                results: [],
                pharmacies: [],
                medicines: [],
                filteredResults: [],
                error: null,
                pharmaciesError: null,
                medicinesError: null,
                filteredError: null
            };
            
        default:
            return state;
    }
};