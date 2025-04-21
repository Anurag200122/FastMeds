import React from "react";
import {Route, Routes} from 'react-router-dom';
import { AdmminRoute } from "./AdminRoute";
import CustomerRoute from "./CustomerRoute";


export const Routers=()=>{
    return(
        <div>
            <Routes>
                <Route path='/admin/pharmacy/*' element={<AdmminRoute/>}> </Route>
                <Route path='/*' element={<CustomerRoute/>}> </Route>
            </Routes>
        </div>
    )
 }