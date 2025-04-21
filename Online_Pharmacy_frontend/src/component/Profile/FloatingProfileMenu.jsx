import React from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Favorite,
  Home,
  AccountBalanceWallet,
  Event,
  Logout,
  Person
} from '@mui/icons-material';
import { Tooltip, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../State/Authentication/Action';

const FloatingProfileMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { title: "Profile", icon: <Person />, path: "/my-profile" },
    { title: "Orders", icon: <ShoppingBag />, path: "/my-profile/orders" },
    { title: "Favourites", icon: <Favorite />, path: "/my-profile/favourites" },
    { title: "Address", icon: <Home />, path: "/my-profile/address" },
    { title: "Payments", icon: <AccountBalanceWallet />, path: "/my-profile/payments" },
    { title: "Events", icon: <Event />, path: "/my-profile/events" },
    { 
      title: "Logout", 
      icon: <Logout />, 
      action: () => {
        dispatch(logout());
        navigate("/");
      }
    }
  ];

  const handleItemClick = (item) => {
    if (item.action) {
      item.action();
    } else {
      navigate(item.path);
    }
  };

  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-50">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-4"
        style={{
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}
      >
        {menuItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <Tooltip title={item.title} placement="right" arrow>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton
                  onClick={() => handleItemClick(item)}
                  sx={{
                    color: isActive(item.path) ? '#ffffff' : '#6366f1',
                    backgroundColor: isActive(item.path) 
                      ? 'rgba(99, 102, 241, 1)' 
                      : 'rgba(99, 102, 241, 0.1)',
                    '&:hover': {
                      backgroundColor: isActive(item.path)
                        ? 'rgba(99, 102, 241, 0.9)'
                        : 'rgba(99, 102, 241, 0.2)'
                    }
                  }}
                >
                  {item.icon}
                </IconButton>
              </motion.div>
            </Tooltip>
            
            {/* Active indicator */}
            {isActive(item.path) && (
              <span className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-indigo-500 rounded-full"></span>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FloatingProfileMenu;