import { API_URL ,api } from "../../config/api.js";
import {ADD_TO_FAVORITE_FAILURE, ADD_TO_FAVORITE_REQUEST, ADD_TO_FAVORITE_SUCCESS, GET_USER_REQUEST, GET_USER_FAILURE, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGESTER_FAILURE, REGESTER_REQUEST, REGESTER_SUCCESS} from "./ActionType.js"
import { CLEAR_CART_SUCCESS } from "../Cart/ActionType.js";
import { findCart } from "../Cart/Action.js";
import axios from "axios";

export const registerUser=(reqData)=>async(dispatch)=>{
    dispatch({type:REGESTER_REQUEST})
    try{

        const {data}=await axios.post(`${API_URL}/auth/signup`,reqData.userData)
        if(data.jwt)localStorage.setItem("jwt",data.jwt);
        if(data.role==="ROLE_PHARMACIST"){
            reqData.navigate("/admin/pharmacy")
        }else{
            reqData.navigate("/")
        }
        dispatch({type:REGESTER_SUCCESS,payload:data.jwt})
        console.log("Registration success", data)
    }catch (error){
        dispatch({type:REGESTER_FAILURE,payload:error})
        console.log("error:", error)
    }
};

export const loginUser = (reqData) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      const { data } = await axios.post(`${API_URL}/auth/signin`, reqData.userData);
      if (data.jwt) localStorage.setItem("jwt", data.jwt);
  
      // Fetch user profile and cart items
      dispatch({ type: LOGIN_SUCCESS, payload: data.jwt });
      dispatch(getUser(data.jwt));
      dispatch(findCart(data.jwt)); // Fetch cart items
  
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
export const getUser=(jwt)=>async(dispatch)=>{
    dispatch({type:GET_USER_REQUEST})
    try{
        const {data}=await api.get('/api/users/profile',{
            headers:{
                Authorization: `Bearer ${jwt}`
            }
            })
        dispatch({type:GET_USER_SUCCESS,payload:data})
        console.log("user profile", data)

    }catch (error){
        dispatch({type:GET_USER_FAILURE,payload:error})
        console.log("error:", error)
    }
};

export const addToFavorites=({jwt,pharmacyId})=>async(dispatch)=>{
   dispatch({type:ADD_TO_FAVORITE_REQUEST})
    try{
        const {data}=await api.put( `/api/pharmacy/${pharmacyId}/add-favorites`,{},{
            headers:{
                Authorization: `Bearer ${jwt}`
            }
            })
        dispatch({type:ADD_TO_FAVORITE_SUCCESS,payload:data})
        console.log("ADD To favorite success", data)

    }catch (error){
        dispatch({type:ADD_TO_FAVORITE_FAILURE,payload:error})
        console.log("error:", error)
    }
};

export const logout = () => async (dispatch) => {
    dispatch({ type: LOGOUT });
    try {
      localStorage.clear(); // Clear localStorage
      dispatch({ type: LOGOUT });
      dispatch({ type: CLEAR_CART_SUCCESS }); // Clear cart state
      console.log("LOGOUT Success");
    } catch (error) {
      console.log("error:", error);
    }
  };