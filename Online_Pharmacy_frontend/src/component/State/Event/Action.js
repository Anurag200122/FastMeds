import { api } from "../../config/api.js";
import {
    CREATE_EVENTS_REQUEST,
    CREATE_EVENTS_SUCCESS,
    CREATE_EVENTS_FAILURE,
    GET_PHARMACY_EVENTS_REQUEST,
    GET_PHARMACY_EVENTS_SUCCESS,
    GET_PHARMACY_EVENTS_FAILURE,
    DELETE_EVENTS_REQUEST,
    DELETE_EVENTS_SUCCESS,
    DELETE_EVENTS_FAILURE,
  } from './ActionType.js';
// Event Actions
export const createEvent = ({ data, jwt }) => {
    return async (dispatch) => {
      dispatch({ type: CREATE_EVENTS_REQUEST });
      try {
        const res = await api.post(`/api/admin/pharmacy/event`, data, {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        dispatch({ type: CREATE_EVENTS_SUCCESS, payload: res.data });
        return res.data; // Return created event for immediate use
      } catch (error) {
        dispatch({ type: CREATE_EVENTS_FAILURE, payload: error.response?.data?.message || error.message });
        throw error;
      }
    };
  };
  
  export const fetchEvents = ({ jwt }) => {
    return async (dispatch) => {
      dispatch({ type: GET_PHARMACY_EVENTS_REQUEST });
      console.log("fetching events requestedd....!")
      try {
        const res = await api.get(`/api/admin/pharmacy/event`, {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        dispatch({ type: GET_PHARMACY_EVENTS_SUCCESS, payload: res.data });
        console.log("fetching events:....!",res.data)
      } catch (error) {
        dispatch({ type: GET_PHARMACY_EVENTS_FAILURE, payload: error.response?.data?.message || error.message });
        console.log("fetching events erorrr....!")
      }
    };
  };
  
  export const deleteEvent = ({ eventId, jwt }) => {
    return async (dispatch) => {
      dispatch({ type: DELETE_EVENTS_REQUEST });
      try {
        await api.delete(`/api/admin/pharmacy/event/${eventId}`, {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        dispatch({ type: DELETE_EVENTS_SUCCESS, payload: eventId });
      } catch (error) {
        dispatch({ type: DELETE_EVENTS_FAILURE, payload: error.response?.data?.message || error.message });
      }
    };
  };