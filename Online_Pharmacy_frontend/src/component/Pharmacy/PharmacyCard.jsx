import React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Card, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isPrsesetInFavorites } from '../config/logic';
import { addToFavorites } from "../State/Authentication/Action.js";
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '18rem',
  transition: 'all 0.3s ease',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
    borderColor: theme.palette.primary.main
  },
}));

const PharmacyCard = ({ item, showStatus = true }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const { auth } = useSelector(store => store);
    const [isFavorite, setIsFavorite] = React.useState(false);

    React.useEffect(() => {
        setIsFavorite(isPrsesetInFavorites(auth.favorites, item));
    }, [auth.favorites, item]);

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        dispatch(addToFavorites({ 
            pharmacyId: item.id, 
            jwt,
            ...item
        }));
    };

    const handleNavigateToPharmacy = () => {
        navigate(`/pharmacy/${item.address?.city}/${item.name}/${item.id}`);
    };

    return (
        <StyledCard 
            className="cursor-pointer"
            onClick={handleNavigateToPharmacy}
            elevation={0}
        >
            <div className="relative">
                {showStatus && (
                    <Chip
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            zIndex: 1,
                            fontWeight: 600
                        }}
                        color={item.open ? "primary" : "error"}
                        label={item.open ? "OPEN" : "CLOSED"}
                    />
                )}
                <div className="relative h-[10rem] overflow-hidden">
                    <img 
                        className="w-full h-full object-cover rounded-t-[12px]"
                        src={item.images?.[0] || '/default-pharmacy.jpg'} 
                        alt={item.name}
                        onError={(e) => {
                            e.target.src = '/default-pharmacy.jpg';
                        }}
                    />
                    {showStatus && !item.open && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-[12px]">
                            <Typography variant="body1" sx={{ color: "white", fontWeight: 500 }}>
                                Currently Closed
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="p-4 flex justify-between items-start">
                <div className="space-y-1 flex-1">
                    <Typography 
                        variant="h6" 
                        sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            '&:hover': {
                                color: 'primary.main'
                            }
                        }}
                        className="truncate"
                    >
                        {item.name}
                    </Typography>
                    <Typography 
                        variant="body2" 
                        sx={{
                            color: 'text.secondary',
                            minHeight: '40px'
                        }}
                        className="line-clamp-2"
                    >
                        {item.description || 'No description available'}
                    </Typography>
                    {item.address?.city && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            📍 {item.address.city}
                        </Typography>
                    )}
                </div>
                <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                    <IconButton 
                        onClick={handleFavoriteClick}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        sx={{
                            color: isFavorite ? 'error.main' : 'action.active',
                            '&:hover': {
                                backgroundColor: 'rgba(239, 68, 68, 0.08)'
                            }
                        }}
                    >
                        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                </Tooltip>
            </div>
        </StyledCard>
    );
};

export default PharmacyCard;