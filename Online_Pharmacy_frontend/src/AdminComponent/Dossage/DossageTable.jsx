import { Box, Card, CardHeader, TableCell, TableBody, TableRow, Table, TableHead, Paper, TableContainer, IconButton, Modal, Button, Typography, Tooltip } from "@mui/material";
import React from "react";
import CreateIcon from '@mui/icons-material/Create';
import { Delete } from "@mui/icons-material";
import CreateDossageForm from "./CreateDossageForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getDossageOfPharmacy, updateStockOfDossages } from '../../component/State/Dossage/Action'

const orders = [1, 1, 1, 1, 1, 1, 1, 1];
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export const DossageTable = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt")
  const { pharmacy, dossage } = useSelector(store => store)

  useEffect(() => {
    dispatch(getDossageOfPharmacy({ jwt, id: pharmacy.usersPharmacy.id }))
  }, [])

  const handleUpdateStoke = (id) => {
    dispatch(updateStockOfDossages({ id, jwt }))
  }
  return (
    <Box sx={{ p: 3 }}>
      <Card className="mt-1" sx={{
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <CardHeader
          action={
            <Tooltip title="Add New Dossage">
              <IconButton onClick={handleOpen} aria-label="settings" sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                }
              }}>
                <CreateIcon />
              </IconButton>
            </Tooltip>
          }
          title={
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Dossage
            </Typography>
          }
          sx={{
            pt: 2,
            alignItems: "center",
            backgroundColor: 'background.default',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        />
        <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: 'background.paper' }}>
              <TableRow>
                <TableCell align="left" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Id</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Category</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Availability</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dossage.dossage.map((item) => (
                <TableRow
                  key={item.name}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ color: 'text.primary' }}>
                    {item.id}
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'text.primary' }}>{item.name}</TableCell>
                  <TableCell align="right" sx={{ color: 'text.primary' }}>{item.category.name}</TableCell>
                  <TableCell align="right">
                    <Button
                      onClick={() => handleUpdateStoke(item.id)}
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: item.inStoke ? 'success.main' : 'error.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: item.inStoke ? 'success.dark' : 'error.dark',
                        },
                        textTransform: 'none',
                        fontWeight: 'bold',
                        minWidth: 100
                      }}
                    >
                      {item.inStoke ? "In Stock" : "Out of Stock"}
                    </Button>
                  </TableCell>
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
          <CreateDossageForm handleClose={handleClose} />
        </Box>
      </Modal>
    </Box>
  )
}