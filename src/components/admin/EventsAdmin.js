import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/admin/AdminShared.module.css";
import CustomToast from "../../components/CustomToast";

const EventsAdmin = () => {
  // State to store all events, filtered events, and related UI controls
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Fetch events when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Dynamically filter events based on the search term
  useEffect(() => {
    if (searchTerm.trim()) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      setFilteredEvents(
        events.filter((event) =>
          event.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          String(event.id).includes(searchTerm)
        )
      );
    } else {
      setFilteredEvents(events);
    }
  }, [searchTerm, events]);

  // Fetch events from the API (supports pagination)
  const fetchEvents = async (url = "events/") => {
    try {
      const { data } = await axios.get(url);
      if (Array.isArray(data.results)) {
        setEvents(data.results);
        setFilteredEvents(data.results);
        setNextPage(data.next);
        setPreviousPage(data.previous);
      } else {
        console.error("Unexpected response format:", data);
        setEvents([]);
        setFilteredEvents([]);
      }
    } catch (err) {
      setToastMessage("Failed to fetch events.");
      setToastType("error");
      setShowToast(true);
      console.error("Error fetching events:", err.response || err.message);
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new event
  const handleAddEvent = () => {
    setCurrentEvent(null);
    setIsEditing(true);
  };

  // Handle editing an existing event
  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setIsEditing(true);
  };

  // Handle deleting an event (confirmation before delete)
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`events/${eventId}`);
        setEvents(events.filter((event) => event.id !== eventId));
        setFilteredEvents(filteredEvents.filter((event) => event.id !== eventId));
        setToastMessage("Event deleted successfully.");
        setToastType("success");
        setShowToast(true);
      } catch (err) {
        setToastMessage("Failed to delete event.");
        setToastType("error");
        setShowToast(true);
        console.error("Error deleting event:", err.response || err.message);
      }
    }
  };

  // Save an event (handles both add and edit functionality)
  const handleSave = async (event, file) => {
    try {
      let imageUrl = event.image;
  
      // Upload the file to Cloudinary if a new file is selected
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
  
        const response = await axios.post(
          "/cloudinary-proxy/",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
  
        if (response.data.secure_url) {
          imageUrl = response.data.secure_url;
        } else {
          throw new Error("Failed to retrieve the secure URL from Cloudinary.");
        }
      }
  
      // Prepare event data for submission
      const eventData = {
        name: event.name,
        description: event.description || "",
        start_date: event.start_date,
        end_date: event.end_date,
        image: imageUrl || null, // Send null for no image
      };
  
      console.log("Payload being sent to backend:", eventData);
  
      // Determine whether to create or update the event
      if (event.id) {
        await axios.put(`events/${event.id}`, eventData); // Use PUT for updates
        setToastMessage("Event updated successfully.");
      } else {
        await axios.post("events/", eventData); // Use POST for new events
        setToastMessage("Event added successfully.");
      }
  

      setToastType("success");
      setShowToast(true);
      fetchEvents(); // Refresh events list
      setIsEditing(false); // Exit editing mode
    } catch (err) {
      setToastMessage("Failed to save event.");
      setToastType("error");
      setShowToast(true);
      console.error("Error saving event:", err.response?.data || err.message);
    }
  };

  // Navigate to the next page of events
  const handleNextPage = () => {
    if (nextPage) fetchEvents(nextPage.replace(/^http:/, "https:"));
  };

  // Navigate to the previous page of events
  const handlePreviousPage = () => {
    if (previousPage) fetchEvents(previousPage.replace(/^http:/, "https:"));
  };

  // Show loading spinner while events are being fetched
  if (loading) {
    return <div className={styles.Container}>Loading...</div>;
  }

  return (
    <>
      <CustomToast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        type={toastType}
      />
      {!isEditing ? (
        <div className={styles.Container}>
          <h1 className={styles.Header}>Manage Events</h1>
          <div className={styles.Controls}>
            <button className={styles.Button} onClick={handleAddEvent}>
              Add Event
            </button>
            <input
              type="text"
              className={styles.SearchBar}
              placeholder="Search by ID or Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Event Table */}
          <div className={styles.TableWrapper}>
            <table className={`${styles.Table} ${styles.EventsTable}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td>{event.id}</td>
                    <td>{event.name}</td>
                    <td>{event.start_date}</td>
                    <td>{event.end_date}</td>
                    <td>
                      {event.image && (
                        <a href={event.image} target="_blank" rel="noopener noreferrer">
                          <img
                            src={event.image}
                            alt={event.name}
                            className={styles.Avatar}
                          />
                        </a>
                      )}
                    </td>
                    <td>
                      <button
                        className={styles.Button}
                        onClick={() => handleEditEvent(event)}
                      >
                        Edit
                      </button>
                      <button
                        className={`${styles.Button} ${styles.DeleteButton}`}
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div>
            <button
              className={styles.Button}
              onClick={handlePreviousPage}
              disabled={!previousPage}
            >
              Previous
            </button>
            <button
              className={styles.Button}
              onClick={handleNextPage}
              disabled={!nextPage}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        // Render the form for adding or editing events
        <EventForm
          event={currentEvent}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </>
  );
};

const EventForm = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    event || { name: "", description: "", start_date: "", end_date: "", image: "" }
  );
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
    // Clear specific error when the user types
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend validation
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Event name cannot be blank.";
    } else if (formData.name.length < 3) {
      newErrors.name = "Event name must be at least 3 characters long.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Event description cannot be blank.";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required.";
    }

    if (!formData.end_date) {
      newErrors.end_date = "End date is required.";
    } else if (formData.start_date && formData.end_date < formData.start_date) {
      newErrors.end_date = "End date must be after the start date.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If no errors, pass data to the save function
    const formDataWithImage = { ...formData, image: formData.image || null };
    onSave(formDataWithImage, file);
  };

  return (
    <div className={styles.FormContainer}>
      <h2 className={styles.FormHeader}>{event ? "Edit Event" : "Add New Event"}</h2>
      <form className={styles.Form} onSubmit={handleSubmit}>
        <div className={styles.FormGroup}>
          <label className={styles.Label}>Name:</label>
          <input
            type="text"
            name="name"
            className={styles.Input}
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className={styles.Error}>{errors.name}</p>}
        </div>
        <div className={styles.FormGroup}>
          <label className={styles.Label}>Description:</label>
          <textarea
            name="description"
            className={styles.Input}
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <p className={styles.Error}>{errors.description}</p>}
        </div>
        <div className={styles.FormGroup}>
          <label className={styles.Label}>Start Date:</label>
          <input
            type="date"
            name="start_date"
            className={styles.Input}
            value={formData.start_date}
            onChange={handleChange}
            required
          />
          {errors.start_date && <p className={styles.Error}>{errors.start_date}</p>}
        </div>
        <div className={styles.FormGroup}>
          <label className={styles.Label}>End Date:</label>
          <input
            type="date"
            name="end_date"
            className={styles.Input}
            value={formData.end_date}
            onChange={handleChange}
            required
          />
          {errors.end_date && <p className={styles.Error}>{errors.end_date}</p>}
        </div>
        <div className={styles.FormGroup}>
          <label className={styles.Label}>Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {formData.image && (
            <a href={formData.image} target="_blank" rel="noopener noreferrer">
              View Current Image
            </a>
          )}
        </div>
        <div className={styles.ButtonGroup}>
          <button className={styles.Button} type="submit">
            Save
          </button>
          <button
            className={`${styles.Button} ${styles.CancelButton}`}
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventsAdmin;
