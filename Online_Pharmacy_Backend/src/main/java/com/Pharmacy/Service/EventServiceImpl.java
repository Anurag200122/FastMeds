package com.Pharmacy.Service;

import com.Pharmacy.Request.CreateEventRequest;
import com.Pharmacy.Response.EventResponse;
import com.Pharmacy.Response.MessageResponse;
import com.Pharmacy.Repository.EventRepository;
import com.Pharmacy.Repository.PharmacyRepository;
import com.Pharmacy.model.Event;
import com.Pharmacy.model.Pharmacy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private PharmacyRepository pharmacyRepository;

    @Override
    public Event createEvent(CreateEventRequest req, Pharmacy pharmacy) {
        if (req.getStartedAt() == null || req.getEndsAt() == null) {
            throw new IllegalArgumentException("Start and end dates cannot be null");
        }
        
        Event event = new Event();
        event.setName(req.getName());
        event.setLocation(req.getLocation());
        event.setImage(req.getImage());
        event.setStartedAt(req.getStartedAt());
        event.setEndsAt(req.getEndsAt());
        event.setPharmacy(pharmacy);
        
        return eventRepository.save(event);
    }

    @Override
    public List<Event> getEventsByPharmacyId(Long pharmacyId) {
    	System.out.println("Fetching events for pharmacy: " + pharmacyId);
        List<Event> events = eventRepository.findByPharmacyId(pharmacyId);
        System.out.println("Found " + events.size() + " events");
        return events;
    }

    @Override
    public EventResponse deleteEvent(Long eventId) throws Exception {
        Optional<Event> opt = eventRepository.findById(eventId);
        
        if(opt.isEmpty()) {
            throw new Exception("Event not found with id "+eventId);
        }
        
        Event event = opt.get();
        eventRepository.delete(event);
        
        EventResponse res = new EventResponse();
        res.setId(event.getId());
        res.setName(event.getName());
        return res;
    }

    @Override
    public Event findEventById(Long id) throws Exception {
        Optional<Event> opt = eventRepository.findById(id);
        
        if(opt.isEmpty()) {
            throw new Exception("Event not found with id "+id);
        }
        return opt.get();
    }
}