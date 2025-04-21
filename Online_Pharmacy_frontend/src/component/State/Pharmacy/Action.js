

import { api } from "../../config/api.js";
import { CREATE_CATEGORY_FAILURE, CREATE_CATEGORY_REQUEST, CREATE_CATEGORY_SUCCESS, CREATE_PHARMACY_FAILURE, CREATE_PHARMACY_REQUEST, CREATE_PHARMACY_SUCCESS,  DELETE_PHARMACY_FAILURE, DELETE_PHARMACY_REQUEST, DELETE_PHARMACY_SUCCESS, GET_ALL_PHARMACY_FAILURE, GET_ALL_PHARMACY_SUCCESS, GET_PHARMACY_BY_ID_FAILURE, GET_PHARMACY_BY_ID_REQUEST, GET_PHARMACY_BY_ID_SUCCESS, GET_PHARMACY_BY_USER_ID_FAILURE, GET_PHARMACY_BY_USER_ID_REQUEST, GET_PHARMACY_BY_USER_ID_SUCCESS, GET_PHARMACY_CATEGORY_FAILURE, GET_PHARMACY_CATEGORY_REQUEST, GET_PHARMACY_CATEGORY_SUCCESS, UPDATE_PHARMACY_FAILURE, UPDATE_PHARMACY_REQUEST, UPDATE_PHARMACY_STATUS_FAILURE, UPDATE_PHARMACY_STATUS_REQUEST, UPDATE_PHARMACY_STATUS_SUCCESS, UPDATE_PHARMACY_SUCCESS } from "./ActionTypes.js";


export const getAllPharmacyAction=(token)=>{
    return async (dispatch)=>{
        dispatch({type:GET_ALL_PHARMACY_FAILURE});
        try{
            const{data}= await api.get(`/api/pharmacy`,{
                headers:{
                    Authorization: `Bearer ${token}`,
            
                },
            });
            dispatch({type:GET_ALL_PHARMACY_SUCCESS, payload:data});
            console.log("All pharmacy", data);
        }catch(error){
            console.log("catch error", error)
            dispatch({type:GET_ALL_PHARMACY_FAILURE,payload:error});
        }
    };
};

export const getPharmacyById=(reqData)=>{
    return async (dispatch)=>{
        dispatch({type:GET_PHARMACY_BY_ID_REQUEST});
        try{
            const response= await api.get(`/api/pharmacy/${reqData.pharmacyId}`,{
                headers:{
                    Authorization: `Bearer ${reqData.jwt}`,
                },
            });
            dispatch({type:GET_PHARMACY_BY_ID_SUCCESS, payload:response.data});
        }catch(error){
            console.log("catch error", error)
            dispatch({type:GET_PHARMACY_BY_ID_FAILURE,payload:error});
        }
    };
};

export const getPharmacyByUserId=(jwt)=>{
    return async (dispatch)=>{
        dispatch({type:GET_PHARMACY_BY_USER_ID_REQUEST});
        try{
            const {data}= await api.get(`/api/admin/pharmacy/user`,{
                headers:{
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("get pharmacy by user id", data);
            dispatch({type:GET_PHARMACY_BY_USER_ID_SUCCESS, payload:data});
        }catch(error){
            console.log("catch error", error)
            dispatch({type:GET_PHARMACY_BY_USER_ID_FAILURE,payload:error.message,});
        }
    };
};

export const createPharmacy=(reqData)=>{
    console.log("token-----------", reqData.token);
    return async (dispatch)=>{
        dispatch({type:CREATE_PHARMACY_REQUEST});
        try{
            const {data}= await api.post(`/api/admin/pharmacy`,reqData.data,{
                headers:{
                    Authorization: `Bearer ${reqData.token}`,
                },
            });
            dispatch({type:CREATE_PHARMACY_SUCCESS, payload:data});
            console.log("create pharmacy", data);
        }catch(error){
            console.log("catch error", error)
            dispatch({type:CREATE_PHARMACY_FAILURE,payload:error,});
        }
    };
};

export const updatePharmacy=({pharmacyId, pharmacyData, jwt})=>{
    return async (dispatch)=>{
        dispatch({type:UPDATE_PHARMACY_REQUEST});
        try{
            const res= await api.put(`/api/admin/pharmacy/${pharmacyId}`,pharmacyData,{
                headers:{
                    Authorization: `Bearer ${jwt}`,
                },
            });
            dispatch({type:UPDATE_PHARMACY_SUCCESS, payload:res.data});
            
        }catch(error){
            console.log("catch error", error)
            dispatch({type:UPDATE_PHARMACY_FAILURE,payload:error,});
        }
    };
};

export const deletePharmacy=({pharmacyId, jwt})=>{
    return async (dispatch)=>{
        dispatch({type:DELETE_PHARMACY_REQUEST});
        try{
            const res= await api.delete(`/api/admin/pharmacy/${pharmacyId}`,{
                headers:{
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("delete pharmacy",res.data);
            dispatch({type:DELETE_PHARMACY_SUCCESS, payload:pharmacyId});
            
        }catch(error){
            console.log("catch error", error)
            dispatch({type:DELETE_PHARMACY_FAILURE,payload:error,});
        }
    };
};

export const updatePharmacyStatus=({pharmacyId, jwt})=>{
    return async (dispatch)=>{
        dispatch({type:UPDATE_PHARMACY_STATUS_REQUEST});
        try{
            const res= await api.put(`/api/admin/pharmacy/${pharmacyId}/status`,{},{
                headers:{
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("resssss",res.data);
            dispatch({type:UPDATE_PHARMACY_STATUS_SUCCESS, payload:res.data});
            
        }catch(error){
            console.log("catch error", error)
            dispatch({type:UPDATE_PHARMACY_STATUS_FAILURE,payload:error,});
        }
    };
    
};


export const createCategoryAction=({reqData, jwt})=>{
    return async (dispatch)=>{
        dispatch({type:CREATE_CATEGORY_REQUEST});
        try{
            const res= await api.post(`/api/admin/category`,reqData,{
                headers:{
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("create category action",res.data)
            dispatch({type:CREATE_CATEGORY_SUCCESS, payload:res.data});
            
        }catch(error){
            console.log("catch error", error)
            dispatch({type:CREATE_CATEGORY_FAILURE,payload:error,});
        }
    };
};

export const getPharmacyCategory=({jwt, pharmacyId})=>{
    return async (dispatch)=>{
        dispatch({type:GET_PHARMACY_CATEGORY_REQUEST});
        try{
            const res= await api.get(`/api/category/pharmacy/${pharmacyId}`,{
                headers:{
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("get pharmacy category",res.data)
            dispatch({type:GET_PHARMACY_CATEGORY_SUCCESS, payload:res.data});
            
        }catch(error){
            console.log("catch error", error)
            dispatch({type:GET_PHARMACY_CATEGORY_FAILURE,payload:error,});
        }
    };
};


