import React from 'react'
import Navbar from '../component/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from '../component/Home/Home'
import PharmacyDetails from '../component/Pharmacy/PharmacyDetails'
import Cart from '../component/Cart/Cart'
import Profile from '../component/Profile/Profile'
import { Auth } from '../component/Auth/Auth'
import { PaymentSuccess } from '../component/PaymentSuccess/PaymentSucess'
import SearchResultsPage from '../component/SearchResultsPage/SearchResultsPage'
import RefundPage from '../component/RefundPage/RefundPage'

const CustomerRoute = () => {
  return (
    <div>
        <Navbar/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/account/:register' element={<Home/>}/>
            <Route path='/pharmacy/:city/:title/:id' element={<PharmacyDetails/>}/>
            <Route path='/cart' element={<Cart />}/>
            <Route path='/my-profile/*' element={<Profile />}/>
            <Route path='/payment/success/:id' element={<PaymentSuccess />}/>
            <Route path='/search' element={<SearchResultsPage />}/>
            <Route path="/orders/:orderId/refund" element={<RefundPage />} />
        </Routes>
        <Auth/>
    </div>
  )
}

export default CustomerRoute