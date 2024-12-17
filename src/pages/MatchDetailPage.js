import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import styles from "../../src/styles/match/MatchDetailPage.module.css";

const MatchesDetailPage = () => {
    const { id } = useParams();
    const history = useHistory();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch match details based on ID
        const fetchMatch = async () => {
            try {
                const { data } = await axios.get(`/matches/${id}`);
                setMatch(data);
            } catch (err) {
                console.error("Error fetching match:", err.response || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();
    }, [id]);

    // Show loading message while data is being fetched
    if (loading) return <p>Loading...</p>;
    // Display message if match data is not found
    if (!match) return <p>Match not found.</p>;

    return (
        <div className={styles.MatchContainer}>
            {/* Match Title */}
            <h1 className={styles.MatchTitle}>
                {match.team1_name} vs {match.team2_name}
            </h1>

            {/* Event Information */}
            <h3 className={styles.EventName}>Event: {match.event_name}</h3>

            {/* Match Scheduled Time */}
            <p className={styles.MatchDate}>
                Scheduled: {match.scheduled_time}
            </p>

            {/* Match Status */}
            <p className={styles.MatchStatus}>
                Status: <span>{match.status}</span>
            </p>

            {/* Result */}
            {match.result && (
                <p className={styles.MatchResult}>
                    Result: <span>{match.result}</span>
                </p>
            )}

            {/* Back Button */}
            <div className={styles.ActionContainer}>
                <button
                    className={styles.BackButton}
                    onClick={() => history.push("/matches")}
                >
                    Back to Matches
                </button>
            </div>
        </div>
    );
};

export default MatchesDetailPage;
