import * as actionTypes from "./ActionTypes.js"

const initialState={
    pharmacies:[],
    usersPharmacy:null,
    pharmacy:null,
    loading:false,
    error:null,
    categories:[],
};

const pharmacyReducer=(state= initialState, action)=>{
    switch(action.type){
        case actionTypes.CREATE_PHARMACY_REQUEST:
        case actionTypes.GET_ALL_PHARMACY_REQUEST:
        case actionTypes.DELETE_PHARMACY_REQUEST:
        case actionTypes.UPDATE_PHARMACY_REQUEST:
        case actionTypes.GET_PHARMACY_BY_ID_REQUEST:
        case actionTypes.CREATE_CATEGORY_REQUEST:
        case actionTypes.GET_PHARMACY_CATEGORY_REQUEST:
            return{
                ...state,
                loading: true,
                error: null,
            };
        case actionTypes.CREATE_PHARMACY_SUCCESS:
            return{
                ...state,
                loading: false,
                usersPharmacy:action.payload
            }
        case actionTypes.GET_ALL_PHARMACY_SUCCESS:
            return{
                ...state,
                loading:false,
                pharmacies:action.payload,
            };
        case actionTypes.GET_PHARMACY_BY_ID_SUCCESS:
            return{
                ...state,
                loading:false,
                pharmacy:action.payload,
            };
        case actionTypes.GET_PHARMACY_BY_USER_ID_SUCCESS:
        case actionTypes.UPDATE_PHARMACY_STATUS_SUCCESS:
        case actionTypes.UPDATE_PHARMACY_SUCCESS:
            return{
                ...state,
                loading:false,
                usersPharmacy:action.payload,
            };
        case actionTypes.DELETE_PHARMACY_SUCCESS:
            return{
                ...state,
                loading:false,
                error:null,
                pharmacies:state.pharmacies.filter(
                    (item)=> item.id !==action.payload
                ),
                usersPharmacy:state.usersPharmacy.filter(
                    (item)=> item.id !==action.payload
                ),
            };
        
        case actionTypes.CREATE_CATEGORY_SUCCESS:
            return{
                ...state,
                loading:false,
                categories:[...state.categories,action.payload],
            };
        case actionTypes.GET_PHARMACY_CATEGORY_SUCCESS:
            return{
                ...state,
                loading:false,
                categories: action.payload,
            };

        case actionTypes.CREATE_PHARMACY_FAILURE:
        case actionTypes.GET_ALL_PHARMACY_FAILURE:
        case actionTypes.DELETE_PHARMACY_FAILURE:
        case actionTypes.UPDATE_PHARMACY_FAILURE:
        case actionTypes.GET_PHARMACY_BY_ID_FAILURE:
        case actionTypes.CREATE_CATEGORY_FAILURE:
        case actionTypes.GET_PHARMACY_CATEGORY_FAILURE:
            return{
                ...state,
                loading:false,
                error:action.payload,
            };
        default:
            return state;
    }
};

export default pharmacyReducer;