import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import styles from "../../src/styles/events/EventDetailPage.module.css";

const EventDetailPage = () => {
    // Extract the event ID from the route parameters
    const { id } = useParams();
    const history = useHistory();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch the event details when the component mounts or ID changes
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // Send GET request to fetch event details by ID
                const { data } = await axios.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                console.error("Error fetching event:", err.response || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    // Show a loading message until the data is fetched
    if (loading) return <p>Loading...</p>;
    // Show an error message if the event was not found
    if (!event) return <p>Event not found.</p>;

    return (
            <div className={styles.EventContainer}>
                {/* Event Title */}
                <h1 className={styles.EventTitle}>{event.name}</h1>

                {/* Event Image */}
                <img
                    src={event.image || "/default-event.jpg"}
                    alt={event.name}
                    className={styles.EventImage}
                />

                {/* Event Description */}
                <p className={styles.EventDescription}>{event.description}</p>

                {/* Action Buttons and Dates */}
                <div className={styles.ActionContainer}>
                    <button
                        className={styles.BackButton}
                        onClick={() => history.push("/events")}
                    >
                        Back to Events
                    </button>
                    <div>
                        {/* Display start and end dates */}
                        <p className={styles.EventDate}>
                            {event.start_date} - {event.end_date}
                        </p>
                    </div>
                </div>
            </div>
    );
};

export default EventDetailPage;
