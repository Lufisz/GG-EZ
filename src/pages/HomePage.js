import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../../src/styles/HomePage.module.css";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get("/events/");
        setEvents(data.results);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.HomePage}>
      <h1>Upcoming Esports Events</h1>
      <div className={styles.EventsContainer}>
        {events.length ? (
          events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className={styles.EventCardLink}
            >
              <div className={styles.EventCard}>
                <img
                  src={event.image || "/default-event.jpg"}
                  alt={event.name}
                />
                <h2>{event.name}</h2>
                <p>{event.description}</p>
                <p className={styles.EventDate}>
                  {event.start_date} - {event.end_date}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p>No events available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
