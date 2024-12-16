import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/Admin/AdminShared.module.css";

const MatchesAdmin = () => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      setFilteredMatches(
        matches.filter(
          (match) =>
            match.team1_name.toLowerCase().includes(lowerCaseSearchTerm) ||
            match.team2_name.toLowerCase().includes(lowerCaseSearchTerm) ||
            match.event_name.toLowerCase().includes(lowerCaseSearchTerm) ||
            String(match.id).includes(searchTerm)
        )
      );
    } else {
      setFilteredMatches(matches);
    }
  }, [searchTerm, matches]);

  const fetchMatches = async (url = "matches/") => {
    try {
      const { data } = await axios.get(url);
      if (Array.isArray(data.results)) {
        setMatches(data.results);
        setFilteredMatches(data.results);
        setNextPage(data.next);
        setPreviousPage(data.previous);
      } else {
        console.error("Unexpected response format:", data);
        setMatches([]);
        setFilteredMatches([]);
      }
    } catch (err) {
      console.error("Error fetching matches:", err.response || err.message);
      setMatches([]);
      setFilteredMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMatch = () => {
    setCurrentMatch(null);
    setIsEditing(true);
  };

  const handleEditMatch = (match) => {
    setCurrentMatch(match);
    setIsEditing(true);
  };

  const handleDeleteMatch = async (matchId) => {
    if (window.confirm("Are you sure you want to delete this match?")) {
      try {
        await axios.delete(`matches/${matchId}`);
        setMatches(matches.filter((match) => match.id !== matchId));
        setFilteredMatches(filteredMatches.filter((match) => match.id !== matchId));
      } catch (err) {
        console.error("Error deleting match:", err.response || err.message);
      }
    }
  };

  const handleSave = async (match) => {
    try {
      if (match.id) {
        await axios.put(`matches/${match.id}/`, match);
      } else {
        await axios.post("matches/", match);
      }
      fetchMatches();
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving match:", err.response || err.message);
    }
  };

  const handleNextPage = () => {
    if (nextPage) fetchMatches(nextPage.replace(/^http:/, "https:"));
  };

  const handlePreviousPage = () => {
    if (previousPage) fetchMatches(previousPage.replace(/^http:/, "https:"));
  };

  if (loading) {
    return <div className={styles.Container}>Loading...</div>;
  }

  return (
    <>
      {!isEditing ? (
        <div className={styles.Container}>
          <h1 className={styles.Header}>Manage Matches</h1>
          <div className={styles.Controls}>
            <button className={styles.Button} onClick={handleAddMatch}>
              Add Match
            </button>
            <input
              type="text"
              className={styles.SearchBar}
              placeholder="Search by ID, Team, or Event"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.TableWrapper}>
            <table className={`${styles.Table} ${styles.MatchesTable}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Event</th>
                  <th>Team 1</th>
                  <th>Team 2</th>
                  <th>Scheduled Time</th>
                  <th>Status</th>
                  <th>Result</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatches.map((match) => (
                  <tr key={match.id}>
                    <td>{match.id}</td>
                    <td>{match.event_name}</td>
                    <td>{match.team1_name}</td>
                    <td>{match.team2_name}</td>
                    <td>{match.scheduled_time}</td>
                    <td>{match.status}</td>
                    <td>{match.result || "N/A"}</td>
                    <td>
                      <button
                        className={styles.Button}
                        onClick={() => handleEditMatch(match)}
                      >
                        Edit
                      </button>
                      <button
                        className={`${styles.Button} ${styles.DeleteButton}`}
                        onClick={() => handleDeleteMatch(match.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
        <MatchForm match={currentMatch} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      )}
    </>
  );
};

const MatchForm = ({ match, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    match || {
      event: "",
      team1: "",
      team2: "",
      scheduled_time: "",
      status: "upcoming",
      result: "",
    }
  );
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [eventsResponse, teamsResponse] = await Promise.all([
          axios.get("events/"),
          axios.get("teams/"),
        ]);
        setEvents(eventsResponse.data.results || eventsResponse.data);
        setTeams(teamsResponse.data.results || teamsResponse.data);
      } catch (err) {
        console.error("Error fetching options:", err.response || err.message);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={styles.FormContainer}>
      <h2 className={styles.FormHeader}>{match ? "Edit Match" : "Add New Match"}</h2>
      <form className={styles.Form} onSubmit={handleSubmit}>
        <div className={styles.FormGroup}>
          <label className={styles.Label}>Event:</label>
          <select
            name="event"
            className={styles.Input}
            value={formData.event}
            onChange={handleChange}
            required
          >
            <option value="">Select an Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.FormGroup}>
          <label className={styles.Label}>Team 1:</label>
          <select
            name="team1"
            className={styles.Input}
            value={formData.team1}
            onChange={handleChange}
            required
          >
            <option value="">Select Team 1</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.FormGroup}>
          <label className={styles.Label}>Team 2:</label>
          <select
            name="team2"
            className={styles.Input}
            value={formData.team2}
            onChange={handleChange}
            required
          >
            <option value="">Select Team 2</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.FormGroup}>
          <label className={styles.Label}>Scheduled Time:</label>
          <input
            type="datetime-local"
            name="scheduled_time"
            className={styles.Input}
            value={formData.scheduled_time}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.FormGroup}>
          <label className={styles.Label}>Status:</label>
          <select
            name="status"
            className={styles.Input}
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="upcoming">Upcoming</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className={styles.FormGroup}>
          <label className={styles.Label}>Result:</label>
          <input
            type="text"
            name="result"
            className={styles.Input}
            value={formData.result}
            onChange={handleChange}
          />
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

export default MatchesAdmin;
