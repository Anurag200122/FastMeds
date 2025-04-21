import { api } from "../../config/api.js";
import {
    CREATE_MENU_ITEM_FAILURE,
    CREATE_MENU_ITEM_REQUEST,
    CREATE_MENU_ITEM_SUCCESS,
    DELETE_MENU_ITEM_FAILURE,
    DELETE_MENU_ITEM_REQUEST,
    DELETE_MENU_ITEM_SUCCESS,
    GET_MENU_ITEMS_BY_PHARMACY_ID_FAILURE,
    GET_MENU_ITEMS_BY_PHARMACY_ID_REQUEST,
    GET_MENU_ITEMS_BY_PHARMACY_ID_SUCCESS,
    SEARCH_MENU_ITEM_FAILURE,
    SEARCH_MENU_ITEM_REQUEST,
    SEARCH_MENU_ITEM_SUCCESS,
    UPDATE_MENU_ITEM_AVAILABILITY_FAILURE,
    UPDATE_MENU_ITEM_AVAILABILITY_REQUEST,
    UPDATE_MENU_ITEM_AVAILABILITY_SUCCESS,
} from "./ActionType.js";

export const createMenuItem = ({ menu, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_MENU_ITEM_REQUEST });
        try {
            const { data } = await api.post(`/api/admin/medicine`, menu, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("created menu", data);
            dispatch({ type: CREATE_MENU_ITEM_SUCCESS, payload: data });
        } catch (error) {
            console.log("catch error", error);
            dispatch({ type: CREATE_MENU_ITEM_FAILURE, payload: error });
        }
    };
};

export const getMenuItemsByPharmacyId = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: GET_MENU_ITEMS_BY_PHARMACY_ID_REQUEST });

        try {
            // Ensure default values are provided
            const params = {
                vegetarian: reqData.vegetarian || false,
                seasonal: reqData.seasonal || false,
                medicine_category: reqData.medicineCategory || ''
            };

            const { data } = await api.get(
                `/api/medicine/pharmacy/${reqData.pharmacyId}`,
                {
                    params,
                    headers: {
                        Authorization: `Bearer ${reqData.jwt}`,
                    },
                }
            );
            dispatch({ type: GET_MENU_ITEMS_BY_PHARMACY_ID_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: GET_MENU_ITEMS_BY_PHARMACY_ID_FAILURE, payload: error.message });
        }
    };
};

export const searchMenuItem = ({ keyword, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: SEARCH_MENU_ITEM_REQUEST });
        try {
            const { data } = await api.get(`/api/medicine/search?name=${keyword}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("search data", data);
            dispatch({ type: SEARCH_MENU_ITEM_SUCCESS, payload: data });
        } catch (error) {
            console.log("catch error", error);
            dispatch({ type: SEARCH_MENU_ITEM_FAILURE, payload: error });
        }
    };
};

export const updateMenuItemAvailability = ({ medicineId, jwt, availability }) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_MENU_ITEM_AVAILABILITY_REQUEST });
        try {
            const { data } = await api.put(
                `/api/admin/medicine/${medicineId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            console.log("update menu item by pharmacy", data);
            dispatch({ type: UPDATE_MENU_ITEM_AVAILABILITY_SUCCESS, payload: data });
        } catch (error) {
            console.log("catch error", error);
            dispatch({ type: UPDATE_MENU_ITEM_AVAILABILITY_FAILURE, payload: error });
        }
    };
};

export const deleteMenuItem = ({ medicineId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: DELETE_MENU_ITEM_REQUEST });
        try {
            const { data } = await api.delete(`/api/admin/medicine/${medicineId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("delete medicine", data);
            dispatch({ type: DELETE_MENU_ITEM_SUCCESS, payload: data });
        } catch (error) {
            console.log("catch error", error);
            dispatch({ type: DELETE_MENU_ITEM_FAILURE, payload: error });
        }
    };
};