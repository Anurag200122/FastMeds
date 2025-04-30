import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../component/State/Authentication/Action';

// Import icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShopTwoIcon from '@mui/icons-material/ShopTwo';
import CategoryIcon from '@mui/icons-material/Category';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import EventIcon from '@mui/icons-material/Event';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';

const AdminSideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", icon: <DashboardIcon />, path: "/admin/pharmacy/" },
    { title: "Orders", icon: <ShoppingBagIcon />, path: "/admin/pharmacy/orders" },
    { title: "Medicine", icon: <ShopTwoIcon />, path: "/admin/pharmacy/menu" },
    { title: "MedicineCategory", icon: <CategoryIcon />, path: "/admin/pharmacy/category" },
    { title: "Dossage", icon: <VaccinesIcon />, path: "/admin/pharmacy/dossage" },
    { title: "Details", icon: <AdminPanelSettingsIcon />, path: "/admin/pharmacy/details" },
    { 
      title: "Logout", 
      icon: <LogoutIcon />, 
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
                    color: isActive(item.path) ? '#ffffff' : '#3f51b5',
                    backgroundColor: isActive(item.path) 
                      ? 'rgba(63, 81, 181, 1)' 
                      : 'rgba(63, 81, 181, 0.1)',
                    '&:hover': {
                      backgroundColor: isActive(item.path)
                        ? 'rgba(63, 81, 181, 0.9)'
                        : 'rgba(63, 81, 181, 0.2)'
                    }
                  }}
                >
                  {item.icon}
                </IconButton>
              </motion.div>
            </Tooltip>
            
            {/* Active indicator */}
            {isActive(item.path) && (
              <span className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></span>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AdminSideBar;