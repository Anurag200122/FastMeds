import {
    ASSIGN_DELIVERY_REQUEST,
    ASSIGN_DELIVERY_SUCCESS,
    ASSIGN_DELIVERY_FAIL,
    UPDATE_DELIVERY_STATUS_SUCCESS,
    FETCH_DELIVERY_SUCCESS,
    DELIVERY_FAIL
  } from './ActionType';
  
  const initialState = {
    delivery: null,
    loading: false,
    error: null
  };
  
  export const deliveryReducer = (state = initialState, action) => {
    switch (action.type) {
      case ASSIGN_DELIVERY_REQUEST:
        return { ...state, loading: true, error: null };
      case ASSIGN_DELIVERY_SUCCESS:
        return { ...state, loading: false, delivery: action.payload };
      case ASSIGN_DELIVERY_FAIL:
      case DELIVERY_FAIL:
        return { ...state, loading: false, error: action.payload };
      case UPDATE_DELIVERY_STATUS_SUCCESS:
        return { ...state, delivery: action.payload };
      case FETCH_DELIVERY_SUCCESS:
        return { ...state, delivery: action.payload };
      default:
        return state;
    }
  };
  