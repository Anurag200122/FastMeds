import { API_URL, api } from "../../config/api.js";
import {
  ADD_TO_FAVORITE_FAILURE,
  ADD_TO_FAVORITE_REQUEST,
  ADD_TO_FAVORITE_SUCCESS,
  GET_USER_REQUEST,
  GET_USER_FAILURE,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE
} from "./ActionType.js";
import { CLEAR_CART_SUCCESS } from "../Cart/ActionType.js";
import { findCart } from "../Cart/Action.js";
import axios from "axios";

export const registerUser = (reqData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const { data } = await axios.post(`${API_URL}/auth/signup`, reqData.userData);
    if (data.jwt) localStorage.setItem("jwt", data.jwt);
    if (data.role === "ROLE_PHARMACIST") {
      reqData.navigate("/admin/pharmacy");
    } else {
      reqData.navigate("/");
    }
    dispatch({ type: REGISTER_SUCCESS, payload: data.jwt });
    console.log("Registration success", data);
  } catch (error) {
    dispatch({ type: REGISTER_FAILURE, payload: error });
    console.log("error:", error);
  }
};

export const loginUser = (reqData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { data } = await axios.post(`${API_URL}/auth/signin`, reqData.userData);
    if (data.jwt) localStorage.setItem("jwt", data.jwt);

    dispatch({ type: LOGIN_SUCCESS, payload: data.jwt });
    dispatch(getUser(data.jwt));
    dispatch(findCart(data.jwt));

    if (data.role === "ROLE_PHARMACIST") {
      reqData.navigate("/admin/pharmacy");
    } else {
      reqData.navigate("/");
    }
    console.log("Login success", data);
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error });
    console.log("error:", error);
  }
};

export const forgotPassword = (email, navigate) => async (dispatch) => {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });
    
    try {
      console.log('Sending forgot password request for:', email); // Debug log
      
      const { data } = await axios.post(`${API_URL}/auth/forgot-password`, { email }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });
  
      console.log('Forgot password response:', data); // Debug log
      
      if (!data.message) {
        throw new Error('Invalid response from server');
      }
  
      dispatch({ 
        type: FORGOT_PASSWORD_SUCCESS, 
        payload: { 
          message: data.message,
          timestamp: new Date().toISOString() 
        }
      });
  
      // Optional: Navigate to login with success state
      if (navigate) {
        navigate('/account/login', { 
          state: { 
            resetSuccess: true,
            message: data.message 
          } 
        });
      }
  
      return {
        success: true,
        data
      };
  
    } catch (error) {
      console.error('Forgot password error:', error); // Detailed error logging
      
      let errorMessage = 'Failed to send reset link';
      let statusCode = null;
      let serverMessage = null;
  
      if (error.response) {
        // The request was made and the server responded with a status code
        statusCode = error.response.status;
        serverMessage = error.response.data?.message;
        
        errorMessage = serverMessage || 
                      `Server responded with status ${statusCode}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request
        errorMessage = error.message || 'Request setup failed';
      }
  
      dispatch({ 
        type: FORGOT_PASSWORD_FAILURE, 
        payload: {
          message: errorMessage,
          statusCode,
          serverMessage,
          timestamp: new Date().toISOString()
        }
      });
  
      // Return error details for component handling
      return {
        success: false,
        error: {
          message: errorMessage,
          statusCode,
          serverMessage,
          originalError: error
        }
      };
    }
  };

export const resetPassword = (resetData, navigate) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });
  try {
    const { data } = await axios.post(`${API_URL}/auth/reset-password`, resetData);
    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.message });
    console.log("Password reset successful", data);
    navigate("/account/login"); // Redirect to login after successful reset
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to reset password";
    dispatch({ type: RESET_PASSWORD_FAILURE, payload: errorMessage });
    console.log("Reset password error:", error);
    return { success: false, error: errorMessage };
  }
};

export const getUser = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });
  try {
    const { data } = await api.get('/api/users/profile', {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    dispatch({ type: GET_USER_SUCCESS, payload: data });
    console.log("User profile", data);
  } catch (error) {
    dispatch({ type: GET_USER_FAILURE, payload: error });
    console.log("error:", error);
  }
};

export const addToFavorites = ({ jwt, pharmacyId }) => async (dispatch) => {
  dispatch({ type: ADD_TO_FAVORITE_REQUEST });
  try {
    const { data } = await api.put(
      `/api/pharmacy/${pharmacyId}/add-favorites`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    dispatch({ type: ADD_TO_FAVORITE_SUCCESS, payload: data });
    console.log("Add to favorite success", data);
  } catch (error) {
    dispatch({ type: ADD_TO_FAVORITE_FAILURE, payload: error });
    console.log("error:", error);
  }
};

export const logout = () => async (dispatch) => {
  dispatch({ type: LOGOUT });
  try {
    localStorage.clear();
    dispatch({ type: CLEAR_CART_SUCCESS });
    console.log("Logout success");
  } catch (error) {
    console.log("Logout error:", error);
  }
};