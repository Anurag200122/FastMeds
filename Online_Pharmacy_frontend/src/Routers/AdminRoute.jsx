import React from "react";
import {Route, Routes} from 'react-router-dom';
import CreatePharmacyForm from "../AdminComponent/CreatePharmacyForm/CreatePharmacyForm";
import { Admin } from "../AdminComponent/Admin/Admin";
import { useSelector } from "react-redux";

export const AdmminRoute=()=>{
    const {pharmacy}=useSelector((store)=>store)
    return(
        <div>
            <Routes>
                <Route path='/*' element={
                    !pharmacy.usersPharmacy ?<CreatePharmacyForm/>: <Admin/>}>

                </Route>
            </Routes>
        </div>
    )
 }