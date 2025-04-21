import { api } from "../../config/api.js";
import { GET_PHARMACY_ORDER_FAILURE, GET_PHARMACY_ORDER_REQUEST, GET_PHARMACY_ORDER_SUCCESS, UPDATE_ORDER_STATUS_FAILURE, UPDATE_ORDER_STATUS_REQUEST, UPDATE_ORDER_STATUS_SUCCESS } from "./ActionType.js";

export const updateOrderStatus=({orderId,orderStatus,jwt})=>{
    return async(dispatch)=>{
        dispatch({type:UPDATE_ORDER_STATUS_REQUEST});
        try{
            const {data}= await api.put(`/api/admin/order/${orderId}/${orderStatus}`,{},{
                headers:{
                    Authorization: `Bearer ${jwt}`,
                },
            });
            const updatedOrder= data;
            console.log("updated order", updatedOrder)
            dispatch({type:UPDATE_ORDER_STATUS_SUCCESS, payload:updatedOrder});
            
        }catch(error){
            console.log("catch error", error)
            dispatch({type:UPDATE_ORDER_STATUS_FAILURE,payload:error,});
        }
    };
};

export const fetchPharmacyOrder=({pharmacyId,orderStatus,jwt})=>{
    return async(dispatch)=>{
        dispatch({type:GET_PHARMACY_ORDER_REQUEST});
        try{
            const {data}= await api.get(`/api/admin/order/pharmacy/${pharmacyId}`,{
                params:{order_status:orderStatus},
                headers:{
                    Authorization: `Bearer ${jwt}`,
                },
            });
            const orders=data;
            console.log("pharmacy order.....", orders);
            dispatch({type:GET_PHARMACY_ORDER_SUCCESS, payload:orders,});
            
        }catch(error){
            console.log("catch error", error)
            dispatch({type:GET_PHARMACY_ORDER_FAILURE,payload:error,});
        }
    };
};
export const rejectPrescription = ({ orderId, reason }) => {
    return async (dispatch) => {
      try {
        const { data } = await api.put(
          `/api/admin/orders/${orderId}/reject-prescription`,
          { reason }
        );
        
        dispatch({
          type: 'UPDATE_ORDER',
          payload: data
        });
        
        return data;
      } catch (error) {
        throw error;
      }
    };
  };
  
  