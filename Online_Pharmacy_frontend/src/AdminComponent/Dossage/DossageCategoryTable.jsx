import { Box, Card, CardHeader, TableCell, TableBody, TableRow, Table, TableHead, Paper, TableContainer, IconButton, Modal, Typography, Tooltip } from "@mui/material";
import React from "react";
import CreateIcon from '@mui/icons-material/Create';
import { Delete } from "@mui/icons-material";
import CreateDossageCategoryForm from "./CreateDossageCategoryForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getDossageCategory } from '../../component/State/Dossage/Action'

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

export const DossageCategoryTable = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const { pharmacy, dossage } = useSelector(store => store);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    dispatch(getDossageCategory({ id: pharmacy.usersPharmacy.id, jwt }));
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Card className="mt-1" sx={{
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <CardHeader
          action={
            <Tooltip title="Add New Category">
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
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold', 
              color: 'text.primary',
              fontSize: '1.25rem'
            }}>
              Dossage Category
            </Typography>
          }
          sx={{
            pt: 2,
            pb: 2,
            alignItems: "center",
            backgroundColor: 'background.default',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        />
        <TableContainer component={Paper} sx={{ 
          borderRadius: 0,
          maxHeight: 'calc(100vh - 200px)',
          overflow: 'auto'
        }}>
          <Table stickyHeader aria-label="simple table" sx={{
            '& .MuiTableCell-root': {
              py: 1.5
            }
          }}>
            <TableHead sx={{ backgroundColor: 'background.paper' }}>
              <TableRow>
                <TableCell 
                  align="left" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'text.secondary',
                    width: '120px'
                  }}
                >
                  ID
                </TableCell>
                <TableCell 
                  align="left" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'text.secondary'
                  }}
                >
                  Category Name
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dossage.category.map((item) => (
                <TableRow
                  key={item.name}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { 
                      backgroundColor: 'action.hover',
                      cursor: 'pointer'
                    }
                  }}
                >
                  <TableCell 
                    component="th" 
                    scope="row" 
                    sx={{ 
                      color: 'text.primary',
                      fontWeight: '500'
                    }}
                  >
                    {item.id}
                  </TableCell>
                  <TableCell 
                    align="left" 
                    sx={{ 
                      color: 'text.primary',
                      fontWeight: '500'
                    }}
                  >
                    {item.name}
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
          <CreateDossageCategoryForm handleClose={handleClose} />
        </Box>
      </Modal>
    </Box>
  );
}