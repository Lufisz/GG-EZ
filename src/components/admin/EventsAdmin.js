import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/Admin/AdminPanel.module.css";

const EventsAdmin = () => {
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get("/api/events/");
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  const handleAddEvent = () => {
    setCurrentEvent(null); // Start with a blank form
    setIsEditing(true);
  };

  const handleEditEvent = (event) => {
    setCurrentEvent(event); // Populate the form with existing event data
    setIsEditing(true);
  };

  const handleSave = async (event) => {
    try {
      if (event.id) {
        // Update existing event
        await axios.put(`/api/events/${event.id}/`, event);
      } else {
        // Add new event
        await axios.post("/api/events/", event);
      }
      setIsEditing(false);
      const { data } = await axios.get("/api/events/");
      setEvents(data);
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  return (
    <div className={styles.Container}>
      <h1>Manage Events</h1>
      {isEditing ? (
        <EventForm event={currentEvent} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          <button onClick={handleAddEvent}>Add Event</button>
          <ul>
            {events.map((event) => (
              <li key={event.id}>
                {event.name}
                <button onClick={() => handleEditEvent(event)}>Edit</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

const EventForm = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    event || { name: "", description: "", start_date: "", end_date: "" }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>
      <label>
        Start Date:
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default EventsAdmin;
