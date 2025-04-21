import React from 'react'
import PharmacyCard from '../Pharmacy/PharmacyCard'
import { useSelector } from 'react-redux'

const Favourites = () => {
  const {auth} = useSelector(store => store)
  return (
    <div>
      <h1 className='py-5 text-xl font-semibold text-center'>My Favourites</h1>
      <div className='flex flex-wrap gap-3 justify-center'>
        {auth.favorites.map((item) => (
          <PharmacyCard 
            key={item.id} 
            item={item} 
            showStatus={false}  // This hides the open/closed status
          />
        ))}
      </div>
    </div>
  )
}

export default Favourites