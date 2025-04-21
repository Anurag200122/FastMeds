import axios from 'axios';
import {
  ASSIGN_DELIVERY_REQUEST,
  ASSIGN_DELIVERY_SUCCESS,
  ASSIGN_DELIVERY_FAIL,
  UPDATE_DELIVERY_STATUS_SUCCESS,
  FETCH_DELIVERY_SUCCESS,
  DELIVERY_FAIL
} from './ActionType';

const API_URL = '/api/deliveries';

export const assignDelivery = (orderId, personId) => async (dispatch) => {
  dispatch({ type: ASSIGN_DELIVERY_REQUEST });
  try {
    const { data } = await axios.post(`${API_URL}/assign`, null, {
      params: { orderId, personId }
    });
    dispatch({ type: ASSIGN_DELIVERY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ASSIGN_DELIVERY_FAIL, payload: error.response?.data || error.message });
  }
};

export const updateDeliveryStatus = (id, status) => async (dispatch) => {
  try {
    const { data } = await axios.put(`${API_URL}/${id}/status`, null, {
      params: { status }
    });
    dispatch({ type: UPDATE_DELIVERY_STATUS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: DELIVERY_FAIL, payload: error.response?.data || error.message });
  }
};

export const fetchDeliveryByOrderId = (orderId) => async (dispatch) => {
  try {
    const { data } = await axios.get(`${API_URL}/order/${orderId}`);
    dispatch({ type: FETCH_DELIVERY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: DELIVERY_FAIL, payload: error.response?.data || error.message });
  }
};
