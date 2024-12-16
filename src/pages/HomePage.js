import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../../src/styles/pages/HomePage.module.css";

const HomePage = () => {
    const [events, setEvents] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true; // Flag to track if component is mounted

        // Fetch upcoming events
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get("/events/");
                if (isMounted) setEvents(data.results.slice(0, 3)); // Only update if mounted
            } catch (err) {
                console.error("Error fetching events:", err);
            }
        };

        // Fetch upcoming matches
        const fetchMatches = async () => {
            try {
                const { data } = await axios.get("/matches/");
                if (isMounted) setMatches(data.results.slice(0, 3)); // Only update if mounted
            } catch (err) {
                console.error("Error fetching matches:", err);
            }
        };

        fetchEvents();
        fetchMatches();

        setLoading(false);

        // Cleanup function to avoid state update on unmounted component
        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className={styles.HomeContainer}>
            {/* Hero Section */}
            <section className={styles.HeroSection}>
                <h1>Welcome to Esports Event Tracker</h1>
                <p>Your one-stop solution for tracking esports events and matches.</p>
                <Link to="/events" className={styles.CTAButton}>
                    View Events
                </Link>
            </section>

            {/* Events Highlights */}
            <section className={styles.HighlightsSection}>
                <h2>Upcoming Events</h2>
                <div className={styles.CardContainer}>
                    {events.length > 0 ? (
                        events.map((event) => (
                            <div key={event.id} className={styles.Card}>
                                <h3>{event.name}</h3>
                                <p>{event.start_date} - {event.end_date}</p>
                                <Link to={`/events/${event.id}`} className={styles.DetailsLink}>
                                    See Details
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No upcoming events available.</p>
                    )}
                </div>
            </section>

            {/* Matches Highlights */}
            <section className={styles.HighlightsSection}>
                <h2>Upcoming Matches</h2>
                <div className={styles.CardContainer}>
                    {matches.length > 0 ? (
                        matches.map((match) => (
                            <div key={match.id} className={styles.Card}>
                                <h3>{match.team1_name} vs {match.team2_name}</h3>
                                <p>{match.scheduled_time}</p>
                                <Link to={`/matches/${match.id}`} className={styles.DetailsLink}>
                                    See Details
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No upcoming matches available.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
