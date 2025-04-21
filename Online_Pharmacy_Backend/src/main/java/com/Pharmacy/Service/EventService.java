package com.Pharmacy.Service;

import com.Pharmacy.Request.CreateEventRequest;
import com.Pharmacy.Response.EventResponse;
import com.Pharmacy.model.Event;
import com.Pharmacy.model.Pharmacy;
import java.util.List;

public interface EventService {
    Event createEvent(CreateEventRequest req, Pharmacy pharmacy);
    List<Event> getEventsByPharmacyId(Long pharmacyId);
    EventResponse deleteEvent(Long eventId) throws Exception;
    Event findEventById(Long id) throws Exception;
}