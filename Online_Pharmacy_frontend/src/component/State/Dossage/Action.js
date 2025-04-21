import { api } from "../../config/api.js";
import { CREATE_DOSSAGE_CATEGORY_SUCCESS, CREATE_DOSSAGE_SUCCESS, GET_DOSSAGE, GET_DOSSAGE_CATEGORY_SUCCESS, UPDATE_STOCK } from "./ActionType.js";

export const getDossageOfPharmacy=({id, jwt})=>{
return async(dispatch)=>{
    try{
        const response=await api.get( `/api/admin/dossage/pharmacy/${id}`,{
            headers:{
                Authorization: `Bearer ${jwt}`
            },
            });
            console.log("get all Dossages", response.data)
        dispatch({type:GET_DOSSAGE,payload:response.data});
    }catch (error){
        console.log("error:", error)
    }
}
};

export const createDossage=({data, jwt})=>{
    return async(dispatch)=>{
        try{
            const response=await api.post( `/api/admin/dossage`,data,{
                headers:{
                    Authorization: `Bearer ${jwt}`
                },
                });
                console.log("create Dossages", response.data)
            dispatch({type:CREATE_DOSSAGE_SUCCESS,payload:response.data});
        }catch (error){
            console.log("error:", error)
        }
    };
    };

export const createDossageCategory=({data, jwt})=>{
    console.log("data",data,"jwt",jwt);
        return async(dispatch)=>{
            try{
                const response=await api.
                post( `/api/admin/dossage/category`,data,{
                    headers:{
                        Authorization: `Bearer ${jwt}`
                    },
                    });
                    console.log("create Dossages category", response.data)
                dispatch({type:CREATE_DOSSAGE_CATEGORY_SUCCESS,payload:response.data});
            }catch (error){
                console.log("error:", error)
            }
        }
        };

export const getDossageCategory=({id, jwt})=>{
                return async(dispatch)=>{
                    try{
                        const response=await api.
                        get( `/api/admin/dossage/pharmacy/${id}/category`,{
                            headers:{
                                Authorization: `Bearer ${jwt}`
                            },
                            });
                            console.log("get Dossages category", response.data)
                        dispatch({type:GET_DOSSAGE_CATEGORY_SUCCESS,payload:response.data});
                    }catch (error){
                        console.log("error:", error)
                    }
                }
};
export const updateStockOfDossages=({id, jwt})=>{
                        return async(dispatch)=>{
                            try{
                                const {data}=await api.
                                put( `/api/admin/dossage/${id}/stock`,{},{
                                    headers:{
                                        Authorization: `Bearer ${jwt}`
                                    },
                                    });
                                dispatch({type:UPDATE_STOCK,payload:data});
                                console.log("updated stock", data)
                            }catch (error){
                                console.log("error:", error)
                            }
                        }
};