import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Chip,
  IconButton,
  Snackbar,
  Badge,
  Fade,
  Tooltip
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../State/Cart/Action.js';
import { styled } from '@mui/material/styles';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Custom styled components
const ProductCard = styled(Card)(({ theme, expanded }) => ({
  position: 'relative',
  marginBottom: '16px',
  borderRadius: '12px',
  overflow: 'visible',
  transition: 'all 0.3s ease',
  backgroundColor: 'white',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
  },
  border: expanded ? `1px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0'
}));

const CardWrapper = styled('div')({
  position: 'relative',
  marginBottom: '10px',
  perspective: '1000px'
});

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: '140px',
  width:'140px',
  top:"150px",
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
  transition: 'transform 0.5s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const ProductContent = styled(CardContent)({
  padding: '16px',
  paddingBottom: '8px !important'
});

const PriceTag = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: '12px',
  right: '12px',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  padding: '4px 12px',
  borderRadius: '20px',
  fontWeight: 'bold',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  zIndex: 1
}));

const ExpandButton = styled(IconButton)(({ theme, expanded }) => ({
  position: 'absolute',
  bottom: '-16px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: expanded ? theme.palette.primary.main : 'white',
  color: expanded ? 'white' : theme.palette.primary.main,
  border: `1px solid ${expanded ? theme.palette.primary.main : '#e0e0e0'}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: expanded ? theme.palette.primary.dark : '#f5f5f5'
  },
  zIndex: 2
}));

// Fix for dosage options - adjusting to fit content better
const DosageOption = styled(FormControlLabel)(({ theme, selected }) => ({
  margin: '4px',
  borderRadius: '8px',
  backgroundColor: selected ? theme.palette.primary.light : 'white',
  border: `1px solid ${selected ? theme.palette.primary.main : '#e0e0e0'}`,
  transition: 'all 0.2s ease',
  padding: '0 8px',  // Added padding
  width: 'fit-content', // Make it fit the content
  minWidth: '120px', // Set a minimum width
  flexGrow: 0, // Don't let it grow
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.light : '#f5f5f5'
  },
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    whiteSpace: 'nowrap', // Prevent wrapping
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}));

const ActionsContainer = styled(CardActions)({
  padding: '8px 16px',
  justifyContent: 'flex-end'
});

const ExpandedContent = styled(CardContent)({
  backgroundColor: '#f9f9f9',
  borderTop: '1px solid #e0e0e0',
  padding: '16px'
});

const StockBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: '-3px',
    top: '13px',
    backgroundColor: '#ff5722',
    color: 'white',
    padding: '0 6px',
    fontSize: '0.75rem'
  }
}));

const MenuCard = ({ item = {}, onClick }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedDossage, setSelectedDossage] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const dispatch = useDispatch();

  const isAnyDosageInStock = item.dossage?.some(dossage => dossage?.inStoke);

  const handleCheckBoxChange = (itemName) => {
    if (selectedDossage.includes(itemName)) {
      setSelectedDossage(selectedDossage.filter((item) => item !== itemName));
    } else {
      setSelectedDossage([...selectedDossage, itemName]);
    }
  };

  const handleExpandClick = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
    if (onClick) onClick(e);
  };

  const handleAddItemToCart = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    const areSelectedInStock = selectedDossage.length > 0 && 
      item.dossage?.some(dosage => 
        selectedDossage.includes(dosage.name) && dosage.inStoke
      );

    if (!areSelectedInStock) {
      setSnack({ open: true, message: 'Please select an available dosage', severity: 'error' });
      return;
    }

    const reqData = {
      token: localStorage.getItem('jwt'),
      cartItem: {
        medicinceId: item.id,
        quantity: 1,
        dossage: selectedDossage,
      },
    };

    try {
      await dispatch(addItemToCart(reqData));
      setSnack({
        open: true,
        message: 'Item added to cart!',
        severity: 'success',
      });
    } catch (err) {
      setSnack({
        open: true,
        message: err.message || 'Something went wrong!',
        severity: 'error',
      });
    }
  };

  return (
    <>
      <CardWrapper>
        <ProductCard expanded={expanded}>
          {/* Price Tag */}
          <PriceTag variant="body2">${item.price || '0.00'}</PriceTag>
          
          {/* Main card content */}
          <div>
            {!isAnyDosageInStock && (
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                  borderRadius: '12px'
                }}
              >
                <Chip
                  label="Out of Stock"
                  color="error"
                  sx={{ fontWeight: 'bold' }}
                />
              </div>
            )}
            
            <StockBadge
              badgeContent={!isAnyDosageInStock ? "OUT OF STOCK" : null}
              color="error"
            >
              {/* Fixed image prop handling */}
              <ProductImage
                image={typeof item?.images === 'string' ? item.images : (item?.images?.[0] || '/placeholder-medicine.jpg')}
                title={item.name}
                component="img" 
              />
            </StockBadge>
            
            <ProductContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
                  {item.name || 'Unknown Medicine'}
                </Typography>
                
                <Tooltip title="View details">
                  <IconButton size="small" onClick={handleExpandClick}>
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
              
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  maxHeight: '40px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.3
                }}
              >
                {item.description || 'No description available'}
              </Typography>
            </ProductContent>
            
            <ActionsContainer>
              <Button
                size="small"
                variant="outlined"
                disabled={!isAnyDosageInStock}
                onClick={handleExpandClick}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  mr: 'auto',
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  borderRadius: '20px',
                  backgroundColor: expanded ? 'rgba(25, 118, 210, 0.08)' : 'transparent'
                }}
              >
                {expanded ? 'Hide options' : 'Select dosage'}
              </Button>
              
              {!expanded && (
                <Button
                  size="small"
                  variant="contained"
                  disabled={!isAnyDosageInStock || selectedDossage.length === 0}
                  onClick={handleAddItemToCart}
                  startIcon={<ShoppingCartIcon />}
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    padding: '4px 16px'
                  }}
                >
                  Add
                </Button>
              )}
            </ActionsContainer>
          </div>
          
          {/* Expand button in the middle of the card */}
          <ExpandButton
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            size="small"
            expanded={expanded}
          >
            <KeyboardArrowDownIcon
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            />
          </ExpandButton>
          
          {/* Expanded content */}
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <ExpandedContent>
              <form onSubmit={handleAddItemToCart}>
                {item?.dossage && item.dossage?.length > 0 ? (
                  <div>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                      Choose Dosage:
                    </Typography>
                    
                    {/* Improved dosage layout */}
                    <FormGroup sx={{ 
                      display: 'flex', 
                      flexDirection: 'row', 
                      flexWrap: 'wrap',
                      justifyContent: 'flex-start',
                      gap: '8px'
                    }}>
                      {item.dossage?.map((dosageItem) => (
                        <DosageOption
                          key={dosageItem.id}
                          control={
                            <Checkbox
                              size="small"
                              onChange={() => handleCheckBoxChange(dosageItem.name)}
                              disabled={!dosageItem.inStoke}
                              checked={selectedDossage.includes(dosageItem.name)}
                              sx={{ marginRight: 0.5 }}
                            />
                          }
                          label={
                            <span style={{ 
                              display: 'inline-block', 
                              maxWidth: '100px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {dosageItem.name} {!dosageItem.inStoke ? ' (Out of Stock)' : ''}
                            </span>
                          }
                          selected={selectedDossage.includes(dosageItem.name)}
                          disabled={!dosageItem.inStoke}
                          sx={{ 
                            opacity: dosageItem.inStoke ? 1 : 0.6,
                            textDecoration: dosageItem.inStoke ? 'none' : 'line-through',
                          }}
                        />
                      ))}
                    </FormGroup>
                  </div>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No dosage options available
                  </Typography>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <Button
                    variant="contained"
                    disabled={!isAnyDosageInStock || selectedDossage.length === 0}
                    type="submit"
                    startIcon={<ShoppingCartIcon />}
                    sx={{
                      borderRadius: '20px',
                      textTransform: 'none',
                      padding: '8px 24px',
                      fontWeight: 600
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </form>
            </ExpandedContent>
          </Collapse>
        </ProductCard>
      </CardWrapper>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MenuCard;