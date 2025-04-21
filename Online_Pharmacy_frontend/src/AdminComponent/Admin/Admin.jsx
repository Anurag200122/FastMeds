import React, { useEffect } from "react";
import AdminSideBar  from "./AdminSideBar";
import { Routes, Route } from "react-router-dom";
import { PharmacyDashboard } from "../Dashboard/PharmacyDashboard";
import { Orders } from "../Orders/Orders";
import { Menu } from "../Menu/Menu";
import { MedicineCategory } from "../MedicineCategory/MedicineCategory";
import { Dossage } from "../Dossage/Dossage";
import Event from '../Event/Event'; // Changed from named import to default import
import { PharmacyDetails } from "./PharmacyDetails";
import CreateMenuForm from "../Menu/CreateMenuForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchPharmacyOrder } from '../../component/State/PharmacyOrder/Action';
import { getPharmacyCategory } from "../../component/State/Pharmacy/Action";


export const Admin = () => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const { pharmacy } = useSelector(store => store);
    
    const handleClose = (e) => {
        e?.preventDefault();
    };
    
    useEffect(() => {
        if (pharmacy.usersPharmacy?.id) {
            dispatch(getPharmacyCategory({ jwt, pharmacyId: pharmacy.usersPharmacy?.id }));
            dispatch(fetchPharmacyOrder({ jwt, pharmacyId: pharmacy.usersPharmacy?.id }));
        }
    }, [dispatch, jwt, pharmacy.usersPharmacy?.id]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 fixed h-full shadow-lg z-10">
                <AdminSideBar handleClose={handleClose} />
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64 p-6">
                <div className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-3rem)]">
                    <Routes>
                        <Route path='/' element={<PharmacyDashboard />} />
                        <Route path='/orders' element={<Orders />} />
                        <Route path='/menu' element={<Menu />} />
                        <Route path='/category' element={<MedicineCategory />} />
                        <Route path='/dossage' element={<Dossage />} />
                        <Route path='/event' element={<Event />} />
                        <Route path='/details' element={<PharmacyDetails />} />
                        <Route path='/add-menu' element={<CreateMenuForm />} />

                    </Routes>
                </div>
            </div>
        </div>
    );
};