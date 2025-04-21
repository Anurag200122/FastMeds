import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchEvents } from '../../component/State/Event/Action';
import EventTable from './EventTable';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

export default Event = () => {
  const { pharmacyId } = useParams();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { events, loadingEvents, errorEvents } = useSelector(state => state.pharmacy);

  useEffect(() => {
    if (pharmacyId && jwt) {
      dispatch(fetchEvents({ jwt, pharmacyId }));
    }
  }, [pharmacyId, jwt, dispatch]);

  if (loadingEvents) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (errorEvents) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {errorEvents}
      </Alert>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Pharmacy Events
      </Typography>
      <EventTable events={events} pharmacyId={pharmacyId} />
    </div>
  );
};

