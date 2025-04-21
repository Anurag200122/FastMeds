import { api } from "../../config/api.js";
import { 
  ADD_ITEM_TO_CART_FAILURE, 
  ADD_ITEM_TO_CART_REQUEST, 
  ADD_ITEM_TO_CART_SUCCESS, 
  CLEAR_CART_FAILURE, 
  CLEAR_CART_REQUEST, 
  CLEAR_CART_SUCCESS, 
  FIND_CART_FAILURE, 
  FIND_CART_REQUEST, 
  FIND_CART_SUCCESS, 
  GET_ALL_CART_ITEMS_FAILURE, 
  GET_ALL_CART_ITEMS_REQUEST, 
  GET_ALL_CART_ITEMS_SUCCESS, 
  REMOVE_CARTITEM_FAILURE, 
  REMOVE_CARTITEM_REQUEST, 
  REMOVE_CARTITEM_SUCCESS, 
  UPDATE_CARTITEM_FAILURE, 
  UPDATE_CARTITEM_REQUEST, 
  UPDATE_CARTITEM_SUCCESS 
} from "./ActionType.js";

export const findCart = (token) => {
  return async (dispatch) => {
    dispatch({ type: FIND_CART_REQUEST });
    try {
      const response = await api.get(`api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: FIND_CART_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FIND_CART_FAILURE, payload: error.message });
    }
  };
};

export const getAllCartItems = (reqData) => {
  return async (dispatch) => {
    dispatch({ type: GET_ALL_CART_ITEMS_REQUEST });
    try {
      const response = await api.get(`api/cart/${reqData.cartId}/items`, {
        headers: {
          Authorization: `Bearer ${reqData.token}`,
        },
      });
      dispatch({ type: GET_ALL_CART_ITEMS_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: GET_ALL_CART_ITEMS_FAILURE, payload: error.message });
    }
  };
};

export const updateCartItem = (reqData) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_CARTITEM_REQUEST });
    try {
      const { data } = await api.put(`api/cart-item/update`, reqData.data, {
        headers: {
          Authorization: `Bearer ${reqData.jwt}`,
        },
      });
      dispatch({ type: UPDATE_CARTITEM_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: UPDATE_CARTITEM_FAILURE, payload: error.message });
    }
  };
};

export const removeCartItem = ({ cartItemId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: REMOVE_CARTITEM_REQUEST });
    try {
      const { data } = await api.delete(`api/cart-item/${cartItemId}/remove`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({ type: REMOVE_CARTITEM_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: REMOVE_CARTITEM_FAILURE, payload: error.message });
    }
  };
};

export const addItemToCart = (reqData) => {
  return async (dispatch) => {
    dispatch({ type: ADD_ITEM_TO_CART_REQUEST });
    try {
      const { data } = await api.put('/api/cart/add', reqData.cartItem, {
        headers: { Authorization: `Bearer ${reqData.token}` }
      });
      dispatch({ type: ADD_ITEM_TO_CART_SUCCESS, payload: data });
      return data; // ✅ Resolve with success data
    } catch (error) {
      let errorMessage = 'Failed to add item to cart';

      if (error.response) {
        if (typeof error.response.data === 'string') {
          if (error.response.data.includes('Cannot mix items from different pharmacies')) {
            errorMessage = 'Please complete or clear your current order before adding items from another pharmacy';
          } else {
            errorMessage = error.response.data;
          }
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.statusText) {
          errorMessage = error.response.statusText;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch({
        type: ADD_ITEM_TO_CART_FAILURE,
        payload: errorMessage
      });

      throw new Error(errorMessage); // ✅ Reject with parsed error
    }
  };
};


export const clearCartAction = () => {
  return async (dispatch) => {
    dispatch({ type: CLEAR_CART_REQUEST });
    try {
      const { data } = await api.put('/api/cart/clear', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
      });
      dispatch({ type: CLEAR_CART_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: CLEAR_CART_FAILURE, payload: error.message });
    }
  };
};