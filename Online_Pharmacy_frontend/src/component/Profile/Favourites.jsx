import React from 'react'
import PharmacyCard from '../Pharmacy/PharmacyCard'
import { useSelector } from 'react-redux'

const Favourites = () => {
  const { auth } = useSelector(store => store)
  
  return (
    <div className="px-4 py-6">
      <h1 className='text-2xl font-bold text-center mb-8 text-gray-800'>My Favourites</h1>
      {auth.favorites.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">You haven't added any favorites yet</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {auth.favorites.map((item) => (
            <PharmacyCard 
              key={item.id} 
              item={item} 
              showStatus={false}  // This hides all open/closed status elements
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Favourites