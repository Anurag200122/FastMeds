import { Box, Card, CardHeader, TableCell, TableBody, TableRow, Table, TableHead, Paper, TableContainer, IconButton, Avatar, Chip, Typography, Snackbar, Alert, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import CreateIcon from '@mui/icons-material/Create';
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getMenuItemsByPharmacyId } from "../../component/State/Menu/Action";
import { useEffect } from "react";
import { deleteMenuItem } from "../../component/State/Menu/Action";

const getStockStatus = (dossages) => {
  if (!dossages || dossages.length === 0) return { label: "Unknown", color: "default" };
  
  const inStockCount = dossages.filter(d => d.inStoke).length;
  
  if (inStockCount === 0) return { label: "Out of Stock", color: "error" };
  if (inStockCount === dossages.length) return { label: "In Stock", color: "success" };
  return { label: "Partial Stock", color: "warning" };
};

export const MenuTable = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { pharmacy, menu } = useSelector(store => store);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (pharmacy.usersPharmacy?.id && jwt) {
      dispatch(getMenuItemsByPharmacyId({
        pharmacyId: pharmacy.usersPharmacy.id,
        jwt,
        vegetarian: false,
        seasonal: false,
        medicineCategory: ""
      }));
    }
  }, [dispatch, jwt, pharmacy.usersPharmacy?.id]);

  const handleDeleteMedicine = (medicineId, medicineName) => {
    setDeletingId(medicineId);
    dispatch(deleteMenuItem({ medicineId, jwt }))
      .then(() => {
        setSnackbar({
          open: true,
          message: `${medicineName} deleted successfully!`,
          severity: "success"
        });
        // Refresh the list immediately
        dispatch(getMenuItemsByPharmacyId({
          pharmacyId: pharmacy.usersPharmacy.id,
          jwt,
          vegetarian: false,
          seasonal: false,
          medicineCategory: ""
        }));
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Failed to delete medicine",
          severity: "error"
        });
      })
      .finally(() => {
        setDeletingId(null);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box className="px-5">
      <Card sx={{ 
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <CardHeader
          action={
            <IconButton 
              onClick={() => navigate("/admin/pharmacy/add-menu")} 
              aria-label="add-medicine"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
            >
              <CreateIcon />
            </IconButton>
          }
          title={
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Medicine Inventory
            </Typography>
          }
          sx={{ 
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid rgba(0,0,0,0.12)',
            py: 2
          }}
        />
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table sx={{ minWidth: 650 }} aria-label="medicine inventory table">
            <TableHead sx={{ backgroundColor: '#fafafa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Ingredients</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Availability</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menu.menuItems?.map((item) => {
                const stockStatus = getStockStatus(item.dossage);
                
                return (
                  <TableRow
                    key={item.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { backgroundColor: 'rgba(63, 81, 181, 0.04)' }
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <Avatar 
                        src={item.images?.[0]} 
                        alt={item.name}
                        sx={{ 
                          width: 48, 
                          height: 48,
                          border: '2px solid #f5f5f5'
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                      {item.name}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        {item.dossage?.map((dossage, index) => (
                          <Chip 
                            key={`${item.id}-${dossage.id || index}`}
                            label={dossage.name}
                            size="small"
                            sx={{ 
                              backgroundColor: '#e3f2fd',
                              color: 'primary.main',
                              fontWeight: 500
                            }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      ${item.price?.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={stockStatus.label}
                        color={stockStatus.color}
                        sx={{ 
                          fontWeight: 600,
                          minWidth: '100px',
                          borderRadius: '4px'
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteMedicine(item.id, item.name)}
                        aria-label="delete"
                        disabled={deletingId === item.id}
                        sx={{
                          backgroundColor: 'rgba(244, 67, 54, 0.08)',
                          '&:hover': {
                            backgroundColor: 'rgba(244, 67, 54, 0.2)'
                          }
                        }}
                      >
                        {deletingId === item.id ? (
                          <CircularProgress size={24} />
                        ) : (
                          <Delete />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};