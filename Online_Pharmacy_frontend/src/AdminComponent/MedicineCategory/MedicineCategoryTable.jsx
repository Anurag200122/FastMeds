import { Box, Card, CardHeader, TableCell, TableBody, TableRow, Table, TableHead, Paper, TableContainer, IconButton, Modal, Typography } from "@mui/material";
import React from "react";
import CreateIcon from '@mui/icons-material/Create';
import { useSelector, useDispatch } from "react-redux";
import CreateMedicineCategoryForm from "./CreateMedicineCategoryForm";
import { getPharmacyCategory } from "../../component/State/Pharmacy/Action";
import { getDossageCategory } from "../../component/State/Dossage/Action";
import { useEffect } from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
};

export const MedicineCategoryTable = () => {
  const { pharmacy } = useSelector((store) => store);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatch(getPharmacyCategory({ jwt, pharmacyId: pharmacy.usersPharmacy?.id }));
  }, [dispatch, jwt, pharmacy.usersPharmacy?.id]);

  useEffect(() => {
    dispatch(getDossageCategory({ id: pharmacy.usersPharmacy.id, jwt }));
  }, [dispatch, jwt, pharmacy.usersPharmacy?.id]);

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
              onClick={handleOpen}
              aria-label="add-category"
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
              Medicine Categories
            </Typography>
          }
          sx={{
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid rgba(0,0,0,0.12)',
            py: 2
          }}
        />
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table sx={{ minWidth: 650 }} aria-label="medicine categories table">
            <TableHead sx={{ backgroundColor: '#fafafa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pharmacy.categories?.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: 'rgba(63, 81, 181, 0.04)' }
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>{item.id}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CreateMedicineCategoryForm handleClose={handleClose} />
        </Box>
      </Modal>
    </Box>
  );
};