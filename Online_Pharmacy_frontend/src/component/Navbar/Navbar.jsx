import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import {
  Box,
  IconButton,
  Avatar,
  Badge,
  TextField,
  Popper,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  CircularProgress,
  Chip,
  Tooltip,
  styled,
  InputAdornment,
  Container
} from "@mui/material";
import {
  Search as SearchIcon,
  AddShoppingCart as AddShoppingCartIcon,
  Person as PersonIcon,
  LocalPharmacy as PharmacyIcon,
  MedicalServices as MedicineIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Clear as ClearIcon,
  LocalPharmacyOutlined as PharmacyOutlinedIcon
} from "@mui/icons-material";
import { searchAll, clearSearch } from "../State/Search/Action";
import { addToFavorites } from "../State/Authentication/Action";
import { isPrsesetInFavorites } from "../config/logic";
import { motion } from "framer-motion";

// Styled components for enhanced UI
const NavbarContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '16px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'calc(100% - 32px)',
  maxWidth: '1400px',
  zIndex: 1100,
  borderRadius: '16px',
  backdropFilter: 'blur(10px)',
  backgroundColor: 'rgba(13, 148, 136, 0.85)',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
  padding: theme.spacing(1.5, 3),
  transition: 'all 0.3s ease',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  
  '&:hover': {
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
  },
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 2),
    width: 'calc(100% - 24px)',
    top: '12px',
  }
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    
    '& fieldset': {
      borderColor: 'transparent',
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(13, 148, 136, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: '0 0 0 3px rgba(13, 148, 136, 0.2)',
    },
  },
  '& .MuiInputBase-input': {
    padding: '10px 14px',
  }
}));

const StyledPopper = styled(Popper)(({ theme }) => ({
  zIndex: 1300,
  width: '100%',
  maxWidth: '500px',
  [theme.breakpoints.down('sm')]: {
    width: '90vw'
  },
  '& .MuiPaper-root': {
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    border: `1px solid ${theme.palette.divider}`,
    maxHeight: '60vh',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '6px'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.action.hover,
      borderRadius: '3px'
    }
  }
}));

const NavbarActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  color: 'white',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    transform: 'translateY(-2px)',
  },
  
  '&:active': {
    transform: 'translateY(0px)',
  }
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: '0.5px',
  backgroundImage: 'linear-gradient(90deg, #ffffff, #e6f7ff)',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  transition: 'all 0.3s ease',
  
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundImage: 'linear-gradient(90deg, #ffffff, #b3e0ff)',
  }
}));

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth, cart, search = { results: [], loading: false, error: null } } = useSelector((store) => store);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const jwt = localStorage.getItem("jwt");
  const cartItemCount = cart.cart?.item.length;

  const debouncedSearch = debounce((query) => {
    if (query.length > 2) {
      dispatch(searchAll({ query, jwt, includeCategories: true }));
      setSearchOpen(true);
    } else {
      dispatch(clearSearch());
      setSearchOpen(false);
    }
  }, 300);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
      dispatch(clearSearch());
    }
  };
  
  const handleClearSearch = () => {
    setSearchQuery("");
    dispatch(clearSearch());
    setSearchOpen(false);
  };

  const handleFavoriteClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToFavorites({ 
      pharmacyId: item.id, 
      jwt,
      ...item
    }));
  };

  const handleSearchItemClick = (item) => {
    setSearchOpen(false);
    setSearchQuery("");
    dispatch(clearSearch());
    
    if (item.type === "pharmacy") {
      navigate(`/search?type=pharmacy&query=${encodeURIComponent(item.name)}`);
    } else {
      navigate(`/search?type=medicine&query=${encodeURIComponent(item.name)}`);
    }
  };

  const handleAvatarClick = () => {
    if (auth.user?.role === "ROLE_CUSTOMER") {
      navigate("/my-profile");
    } else {
      navigate("/admin/pharmacy");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <NavbarContainer>
        <Container maxWidth={false} sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: 0
        }}>
          {/* Logo Section */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => navigate("/")}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <PharmacyOutlinedIcon sx={{ 
              color: 'white', 
              fontSize: { xs: 24, sm: 28, md: 32 },
              marginRight: 1
            }} />
            <LogoText variant="h6" sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
            }}>
              FastMeds
            </LogoText>
          </motion.div>

          {/* Search and Actions Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1, 
            maxWidth: '700px', 
            mx: { xs: 1, sm: 2, md: 4 }
          }}>
            {/* Search Bar with Results Dropdown */}
            <Box ref={searchRef} sx={{ width: '100%', position: 'relative' }}>
              <form onSubmit={handleSearchSubmit} style={{ width: '100%' }}>
                <SearchTextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Search pharmacies, medicines or categories..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onClick={() => searchQuery.length > 0 && setSearchOpen(true)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "gray" }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClearSearch}
                          size="small"
                          edge="end"
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: 'rgba(0,0,0,0.05)' 
                            } 
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </form>

              <StyledPopper
                open={searchOpen && searchQuery.length > 0}
                anchorEl={searchRef.current}
                placement="bottom-start"
                disablePortal={false}
              >
                <Paper elevation={3}>
                  {search.loading ? (
                    <Box display="flex" justifyContent="center" p={2}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : search.error ? (
                    <Box p={2}>
                      <Typography variant="body2" color="error">
                        Error: {search.error}
                      </Typography>
                    </Box>
                  ) : search.results?.length > 0 ? (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={staggerContainer}
                    >
                      <List dense>
                        {search.results.map((item, index) => (
                          <motion.div
                            key={`${item.type}-${item.id}`}
                            variants={{
                              hidden: { opacity: 0, y: 10 },
                              visible: { 
                                opacity: 1, 
                                y: 0,
                                transition: { delay: index * 0.05 }
                              }
                            }}
                          >
                            <ListItemButton
                              onClick={() => handleSearchItemClick(item)}
                              sx={{
                                py: 1.5,
                                borderBottom: '1px solid rgba(0,0,0,0.05)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  backgroundColor: 'rgba(13, 148, 136, 0.05)',
                                  transform: 'translateX(5px)'
                                },
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 40 }}>
                                {item.type === "pharmacy" ? (
                                  <PharmacyIcon sx={{ color: '#0d9488' }} />
                                ) : (
                                  <MedicineIcon sx={{ color: '#0369a1' }} />
                                )}
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                      {item.name}
                                    </Typography>
                                    {item.type === "pharmacy" && item.open !== undefined && (
                                      <Chip
                                        size="small"
                                        label={item.open ? "OPEN" : "CLOSED"}
                                        color={item.open ? "success" : "error"}
                                        sx={{ 
                                          ml: 1, 
                                          height: 20, 
                                          fontSize: '0.65rem',
                                          fontWeight: 600
                                        }}
                                      />
                                    )}
                                  </Box>
                                }
                                secondary={
                                  <Box display="flex" justifyContent="space-between">
                                    <Typography variant="caption" color="text.secondary">
                                      {item.type === "pharmacy" ? 
                                        `${item.address?.city || 'Location not specified'}` : 
                                        `Medicine${item.category ? ` | ${item.category}` : ''}`}
                                    </Typography>
                                    {item.fromCategorySearch && (
                                      <Chip 
                                        label="Category Match" 
                                        size="small" 
                                        color="info" 
                                        sx={{ fontSize: '0.6rem', height: 20 }}
                                      />
                                    )}
                                  </Box>
                                }
                              />
                              {auth.user && item.type === "pharmacy" && (
                                <Tooltip title={
                                  isPrsesetInFavorites(auth.favorites, item) ? 
                                  "Remove from favorites" : "Add to favorites"
                                }>
                                  <IconButton
                                    onClick={(e) => handleFavoriteClick(e, item)}
                                    size="small"
                                    sx={{ 
                                      color: isPrsesetInFavorites(auth.favorites, item) ? 
                                        '#ef4444' : 'action.active',
                                      '&:hover': {
                                        backgroundColor: 'rgba(239, 68, 68, 0.08)'
                                      }
                                    }}
                                  >
                                    {isPrsesetInFavorites(auth.favorites, item) ? 
                                      <FavoriteIcon fontSize="small" /> : 
                                      <FavoriteBorderIcon fontSize="small" />}
                                  </IconButton>
                                </Tooltip>
                              )}
                            </ListItemButton>
                          </motion.div>
                        ))}
                      </List>
                    </motion.div>
                  ) : (
                    <Box p={3} textAlign="center">
                      <Typography variant="body2" color="textSecondary">
                        No results found
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </StyledPopper>
            </Box>
          </Box>

          {/* User and Cart Section */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            {/* User Avatar */}
            <motion.div variants={fadeIn}>
              {auth.user ? (
                <Tooltip title={auth.user.fullName || "My Account"}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Avatar
                      onClick={handleAvatarClick}
                      sx={{
                        bgcolor: "white",
                        color: "#7e22ce",
                        width: { xs: 34, sm: 38 },
                        height: { xs: 34, sm: 38 },
                        border: '2px solid rgba(255, 255, 255, 0.8)',
                        boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: { xs: '1rem', sm: '1.1rem' }
                      }}
                    >
                      {auth.user?.fullName?.[0]?.toUpperCase() || ''}
                    </Avatar>
                  </motion.div>
                </Tooltip>
              ) : (
                <Tooltip title="Login">
                  <NavbarActionButton
                    onClick={() => navigate("/account/login")}
                    size="small"
                  >
                    <PersonIcon />
                  </NavbarActionButton>
                </Tooltip>
              )}
            </motion.div>

            {/* Cart Icon */}
            <motion.div variants={fadeIn}>
              <Tooltip title="My Cart">
                <NavbarActionButton onClick={() => navigate("/cart")} size="small">
                  <Badge
                    color="error"
                    badgeContent={cartItemCount || 0}
                    sx={{
                      '& .MuiBadge-badge': {
                        right: -3,
                        top: 5,
                        border: `2px solid rgba(13, 148, 136, 0.8)`,
                        padding: '0 4px',
                        fontWeight: 600
                      }
                    }}
                  >
                    <AddShoppingCartIcon />
                  </Badge>
                </NavbarActionButton>
              </Tooltip>
            </motion.div>
          </motion.div>
        </Container>
      </NavbarContainer>
      {/* Spacer to prevent content from being hidden under fixed navbar */}
      <Box sx={{ height: { xs: '80px', sm: '90px' } }} />
    </motion.div>
  );
};

export default Navbar;