import { Button, Card, CardContent, CardHeader, Grid } from "@mui/material";
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePharmacyStatus } from "../../component/State/Pharmacy/Action";

export const PharmacyDetails = () => {
    const { pharmacy } = useSelector((store) => store)
    const dispatch = useDispatch()
    
    const handlePharmacyStatus = () => {
        dispatch(updatePharmacyStatus({
            pharmacyId: pharmacy.usersPharmacy.id,
            jwt: localStorage.getItem("jwt")
        }))
    }

    return (
        <div className="lg:px-20 px-5 pb-10 bg-gray-50">
            <div className="py-8 flex flex-col md:flex-row justify-center items-center gap-5">
                <h1 className="text-3xl lg:text-4xl text-center font-bold text-gray-800">
                    {pharmacy.usersPharmacy.name}
                </h1>
                <Button 
                    color={!pharmacy.usersPharmacy.open ? "primary" : "error"} 
                    className="py-3 px-6 min-w-[120px]" 
                    variant="contained" 
                    onClick={handlePharmacyStatus} 
                    size="large"
                    sx={{
                        borderRadius: '8px',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        '&:hover': {
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                        }
                    }}
                >
                    {pharmacy.usersPharmacy.open ? "Close Pharmacy" : "Open Pharmacy"}
                </Button>
            </div>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                        <CardHeader 
                            title={<span className="text-xl font-semibold text-gray-700">Pharmacy Information</span>}
                            sx={{ borderBottom: '1px solid rgba(0,0,0,0.12)' }}
                        />
                        <CardContent>
                            <div className="space-y-5">

                                <div className="flex items-center">
                                    <p className="w-48 font-medium text-gray-600">Owner</p>
                                    <p className="text-gray-800">
                                        <span className="pr-4">-</span>
                                        {pharmacy.usersPharmacy?.owner.fullName}
                                    </p>
                                </div>

                                <div className="flex items-center">
                                    <p className="w-48 font-medium text-gray-600">Pharmacy Name</p>
                                    <p className="text-gray-800">
                                        <span className="pr-4">-</span>
                                        {pharmacy.usersPharmacy?.name}
                                    </p>
                                </div>

                                <div className="flex items-center">
                                    <p className="w-48 font-medium text-gray-600">Opening Hours</p>
                                    <p className="text-gray-800">
                                        <span className="pr-4">-</span>
                                        {pharmacy.usersPharmacy?.openingHours}
                                    </p>
                                </div>

                                <div className="flex items-center">
                                    <p className="w-48 font-medium text-gray-600">Status</p>
                                    <p className="text-gray-800">
                                        <span className="pr-4">-</span>
                                        {pharmacy.usersPharmacy?.open ? 
                                            <span className="px-4 py-1 rounded-full bg-green-100 text-green-800 font-medium">Open</span> : 
                                            <span className="px-4 py-1 rounded-full bg-red-100 text-red-800 font-medium">Closed</span>}
                                    </p>
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                        <CardHeader 
                            title={<span className="text-xl font-semibold text-gray-700">Address</span>}
                            sx={{ borderBottom: '1px solid rgba(0,0,0,0.12)' }}
                        />
                        <CardContent>
                            <div className="space-y-5">

                                <div className="flex items-center">
                                    <p className="w-48 font-medium text-gray-600">Country</p>
                                    <p className="text-gray-800">
                                        <span className="pr-4">-</span>
                                        {pharmacy.usersPharmacy?.address?.country}
                                    </p>
                                </div>

                                <div className="flex items-center">
                                    <p className="w-48 font-medium text-gray-600">City</p>
                                    <p className="text-gray-800">
                                        <span className="pr-4">-</span>
                                        {pharmacy.usersPharmacy?.address?.city}
                                    </p>
                                </div>

                                <div className="flex items-center">
                                    <p className="w-48 font-medium text-gray-600">Postal Code</p>
                                    <p className="text-gray-800">
                                        <span className="pr-4">-</span>
                                        {pharmacy.usersPharmacy?.address?.postalCode}
                                    </p>
                                </div>

                                <div className="flex items-center">
                                    <p className="w-48 font-medium text-gray-600">Street Address</p>
                                    <p className="text-gray-800">
                                        <span className="pr-4">-</span>
                                        {pharmacy.usersPharmacy?.address?.streetAddress}
                                    </p>
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                        <CardHeader 
                            title={<span className="text-xl font-semibold text-gray-700">Contact Information</span>}
                            sx={{ borderBottom: '1px solid rgba(0,0,0,0.12)' }}
                        />
                        <CardContent>
                            <div className="space-y-5">

                                <div className="flex items-center">
                                    <p className="w-48 font-medium text-gray-600">Email</p>
                                    <p className="text-gray-800">
                                        <span className="pr-4">-</span>
                                        {pharmacy.usersPharmacy.contactInfo?.email}
                                    </p>
                                </div>

                                <div className="flex items-center">
                                    <p className="w-48 font-medium text-gray-600">Mobile</p>
                                    <p className="text-gray-800">
                                        <span className="pr-4">-</span>
                                        {pharmacy.usersPharmacy.contactInfo?.mobile}
                                    </p>
                                </div>

                                <div className="flex items-center">
                                    <p className="w-48 font-medium text-gray-600">Social</p>
                                    <div className="flex items-center gap-4">
                                        <span className="pr-4">-</span>
                                        <a href={pharmacy.usersPharmacy.contactInfo?.instagram} className="text-blue-600 hover:text-blue-800">
                                            <InstagramIcon sx={{ fontSize: "2rem" }} />
                                        </a>
                                        <a href={pharmacy.usersPharmacy.contactInfo?.twitter} className="text-gray-800 hover:text-gray-600">
                                            <XIcon sx={{ fontSize: "2rem" }} />
                                        </a>
                                        <a href={pharmacy.usersPharmacy.contactInfo?.facebook} className="text-blue-700 hover:text-blue-900">
                                            <FacebookIcon sx={{ fontSize: "2rem" }} />
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}