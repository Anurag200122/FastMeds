import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEvent } from '../../component/State/Event/Action';
import { 
  Box, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import CreateEvent from './CreateEvent';

const EventTable = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { pharmacy } = useSelector(store => store);
  const events = pharmacy?.events || [];

  const pharmacyId = pharmacy?.id;
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleDelete = (eventId) => {
    dispatch(deleteEvent({ eventId, jwt }));
    setOpenDelete(false);
  };

  if (!pharmacy) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading pharmacy data...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Button 
        variant="contained" 
        onClick={() => setOpenCreate(true)}
        sx={{ mb: 2 }}
      >
        Create New Event
      </Button>

      {events.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No events found. Create your first event!
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.name || 'No name'}</TableCell>
                  <TableCell>{event.location || 'No location'}</TableCell>
                  <TableCell>
                    {event.startedAt ? new Date(event.startedAt).toLocaleString() : 'Not set'}
                  </TableCell>
                  <TableCell>
                    {event.endsAt ? new Date(event.endsAt).toLocaleString() : 'Not set'}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => {
                      setSelectedEvent(event);
                      setOpenCreate(true);
                    }}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => {
                      setSelectedEvent(event);
                      setOpenDelete(true);
                    }}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CreateEvent 
        open={openCreate} 
        onClose={() => {
          setOpenCreate(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        pharmacyId={pharmacyId}
      />

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{selectedEvent?.name || 'this event'}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button 
            onClick={() => handleDelete(selectedEvent?.id)} 
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventTable;