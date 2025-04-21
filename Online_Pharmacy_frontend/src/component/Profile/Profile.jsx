import React, { useState } from 'react'
import ProfileNavigation from './ProfileNavigation'
import { Route, Routes } from 'react-router-dom';
import UserProfile from './UserProfile';
import Orders from './Orders';
import Address from './Address';
import Favourites from './Favourites';
import Events from './Events';
import FloatingProfileMenu from './FloatingProfileMenu';

const Profile = () => {
    const [openSideBar]=useState(false);
  return (
    <div className='lg:flex justify-between'>
        <div className='sticky h-[80vh] lg:w-[20%]'>
             <FloatingProfileMenu open={openSideBar}/>
                
        </div>
        <div className='lg:w-[80%]'>
            <Routes>
                <Route path='/' element={<UserProfile/>}/>
                <Route path='/orders' element={<Orders/>}/>
                <Route path='/address' element={<Address/>}/>
                <Route path='/favourites' element={<Favourites/>}/>
                <Route path='/event' element={<Events/>}/>
            </Routes>
        </div>

    </div>
  )
}

export default Profile