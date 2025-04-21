import { extractFilenameFromHeaders } from "../../Util/finenameExtractor.js";
import { api } from "../../config/api.js";
import {
  UPLOAD_PRESCRIPTION_REQUEST,
  UPLOAD_PRESCRIPTION_SUCCESS,
  UPLOAD_PRESCRIPTION_FAILURE,
  UPDATE_PRESCRIPTION_STATUS_REQUEST,
  UPDATE_PRESCRIPTION_STATUS_SUCCESS,
  UPDATE_PRESCRIPTION_STATUS_FAILURE,
  GET_PRESCRIPTION_FAILURE,
  GET_PRESCRIPTION_REQUEST,
  GET_PRESCRIPTION_SUCCESS, 
  DELETE_PRESCRIPTION_FAILURE,
  DELETE_PRESCRIPTION_SUCCESS,
  DELETE_PRESCRIPTION_REQUEST,
  DOWNLOAD_PRESCRIPTION_REQUEST,
  DOWNLOAD_PRESCRIPTION_SUCCESS,
  DOWNLOAD_PRESCRIPTION_FAILURE,
  VIEW_PRESCRIPTION_REQUEST,
  VIEW_PRESCRIPTION_SUCCESS,
  VIEW_PRESCRIPTION_FAILURE

} from "./ActionType.js";

//import { extractFilenameFromHeaders } from "../../Util/filenameExtractor";



export const uploadPrescription = ({ orderId, formData, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: UPLOAD_PRESCRIPTION_REQUEST });
    try {
      const { data } = await api.post(
        `/api/prescription/upload/${orderId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch({ type: UPLOAD_PRESCRIPTION_SUCCESS, payload: data });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({ type: UPLOAD_PRESCRIPTION_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};

export const getPrescriptionByOrderId = ({ orderId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: GET_PRESCRIPTION_REQUEST });
    try {
      const { data } = await api.get(`/api/prescription/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({ type: GET_PRESCRIPTION_SUCCESS, payload: data });
    } catch (error) {
      // Don't treat 404 as error since prescription might not exist yet
      if (error.response?.status !== 404) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch({ type: GET_PRESCRIPTION_FAILURE, payload: errorMessage });
      }
    }
  };
};

export const updatePrescriptionStatus = ({ prescriptionId, status, jwt, notes }) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_PRESCRIPTION_STATUS_REQUEST });
    try {
      const { data } = await api.put(
        `/api/prescription/${prescriptionId}/status`,
        { status, notes },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      dispatch({ type: UPDATE_PRESCRIPTION_STATUS_SUCCESS, payload: data });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({ type: UPDATE_PRESCRIPTION_STATUS_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};

export const deletePrescription = ({ prescriptionId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_PRESCRIPTION_REQUEST });
    try {
      await api.delete(`/api/prescription/${prescriptionId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({ type: DELETE_PRESCRIPTION_SUCCESS, payload: prescriptionId });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({ type: DELETE_PRESCRIPTION_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};

// export const downloadPrescription = ({ prescriptionId, jwt }) => {
//   return async (dispatch) => {
//     dispatch({ type: DOWNLOAD_PRESCRIPTION_REQUEST });
//     try {
//       const response = await api.get(`/api/prescription/download/${prescriptionId}`, {
//         headers: {
//           Authorization: `Bearer ${jwt}`,
//         },
//         responseType: 'blob' // Important for file downloads
//       });
      
//       // Create download link
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
      
//       // Extract filename from headers
//       const contentDisposition = response.headers['content-disposition'];
//       let filename = `prescription_${prescriptionId}`;
//       if (contentDisposition) {
//         const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
//         if (filenameMatch && filenameMatch[1]) {
//           filename = filenameMatch[1];
//         }
//       }
      
//       link.setAttribute('download', filename);
//       document.body.appendChild(link);
//       link.click();
//       link.parentNode.removeChild(link);
      
//       dispatch({ type: DOWNLOAD_PRESCRIPTION_SUCCESS });
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message;
//       dispatch({ type: DOWNLOAD_PRESCRIPTION_FAILURE, payload: errorMessage });
//       throw error;
//     }
//   };
// };

export const downloadPrescription = ({ prescriptionId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: DOWNLOAD_PRESCRIPTION_REQUEST });
    try {
      const response = await api.get(`/api/prescription/download/${prescriptionId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        responseType: 'blob'
      });
      
      // Extract filename from headers
      const filename = extractFilenameFromHeaders(response.headers) || `prescription_${prescriptionId}`;
      //let filename = `prescription_${prescriptionId}`;
      const disposition = response.headers['content-disposition'];
      
      if (disposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      dispatch({ type: DOWNLOAD_PRESCRIPTION_SUCCESS });
    } catch (error) {
      dispatch({ 
        type: DOWNLOAD_PRESCRIPTION_FAILURE, 
        payload: error.response?.data?.message || error.message 
      });
      throw error;
    }
  };
};

export const viewPrescription = ({ prescriptionId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: VIEW_PRESCRIPTION_REQUEST });
    try {
      const response = await api.get(`/api/prescription/view/${prescriptionId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        responseType: 'blob'
      });
      
      // Create object URL from the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      dispatch({ type: VIEW_PRESCRIPTION_SUCCESS, payload: url });
      return url;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || "Failed to load prescription";
      dispatch({ type: VIEW_PRESCRIPTION_FAILURE, payload: errorMessage });
      throw error;
    }
  };
};