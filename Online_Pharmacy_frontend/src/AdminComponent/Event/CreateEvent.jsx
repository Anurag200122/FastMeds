import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createEvent } from '../../component/State/Event/Action';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack
} from '@mui/material';

const CreateEvent = ({ open, onClose, event, pharmacyId }) => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const [formData, setFormData] = useState({
    name: event?.name || '',
    location: event?.location || '',
    startedAt: event?.startedAt || '',
    endsAt: event?.endsAt || '',
    pharmacyId: pharmacyId
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createEvent({ 
      data: formData, 
      jwt 
    }))
    .then(() => {
      onClose(); // Close the dialog on success
    })
    .catch(error => {
      console.error("Error creating event:", error);
      // You might want to show an error message here
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{event ? 'Edit Event' : 'Create New Event'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Event Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Start Date & Time"
              type="datetime-local"
              name="startedAt"
              value={formData.startedAt}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="End Date & Time"
              type="datetime-local"
              name="endsAt"
              value={formData.endsAt}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {event ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateEvent;