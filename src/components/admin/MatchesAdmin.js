import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/admin/AdminShared.module.css";
import CustomToast from "../../components/CustomToast";

// MatchesAdmin Component: Manages and displays matches in the admin panel
const MatchesAdmin = () => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Fetch matches when the component mounts
  useEffect(() => {
    fetchMatches();
  }, []);

  // Search term effect: Filters matches based on user input
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

  // Function to fetch matches from the backend API
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
      setToastMessage("Failed to fetch matches.");
      setToastType("error");
      setShowToast(true);
      console.error("Error fetching matches:", err.response || err.message);
      setMatches([]);
      setFilteredMatches([]);
    } finally {
      setLoading(false);
    }
  };

  // Open the form for adding a new match
  const handleAddMatch = () => {
    setCurrentMatch(null);
    setIsEditing(true);
  };

  // Open the form for editing an existing match
  const handleEditMatch = (match) => {
    setCurrentMatch(match);
    setIsEditing(true);
  };

  // Delete a match by ID with confirmation
  const handleDeleteMatch = async (matchId) => {
    if (window.confirm("Are you sure you want to delete this match?")) {
      try {
        await axios.delete(`matches/${matchId}`);
        setMatches(matches.filter((match) => match.id !== matchId));
        setFilteredMatches(filteredMatches.filter((match) => match.id !== matchId));
        setToastMessage("Match deleted successfully.");
        setToastType("success");
        setShowToast(true);
      } catch (err) {
        setToastMessage("Failed to delete match.");
        setToastType("error");
        setShowToast(true);
        console.error("Error deleting match:", err.response || err.message);
      }
    }
  };

  // Save a new or edited match to the backend
  const handleSave = async (match) => {
    try {
      if (match.id) {
        await axios.put(`matches/${match.id}/`, match);
        setToastMessage("Match updated successfully.");
      } else {
        await axios.post("matches/", match);
        setToastMessage("Match added successfully.");
      }
      setToastType("success");
      setShowToast(true);
      fetchMatches();
      setIsEditing(false);
    } catch (err) {
      setToastMessage("Failed to save match.");
      setToastType("error");
      setShowToast(true);
      console.error("Error saving match:", err.response || err.message);
    }
  };

  // Fetch the next page of matches
  const handleNextPage = () => {
    if (nextPage) fetchMatches(nextPage.replace(/^http:/, "https:"));
  };

  // Fetch the previous page of matches
  const handlePreviousPage = () => {
    if (previousPage) fetchMatches(previousPage.replace(/^http:/, "https:"));
  };

  // Show loading indicator while data is being fetched
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
      {/* Display the matches table or the edit form */}
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
            {/* Table displaying matches */}
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
          {/* Pagination controls */}
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
        // Render MatchForm for adding/editing a match
        <MatchForm 
          match={currentMatch} 
          onSave={handleSave} 
          onCancel={() => setIsEditing(false)} 
        />
      )}
    </>
  );
};

// MatchForm Component: Form to add or edit match details
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
  const [errors, setErrors] = useState({});

  // Fetch events and teams when the form is loaded
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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear the specific error when the user types
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
};

  // Submit form data to save the match
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    const newErrors = {};

    if (!formData.event) {
      newErrors.event = "Event is required.";
    }

    if (!formData.team1) {
      newErrors.team1 = "Team 1 is required.";
    }

    if (!formData.team2) {
      newErrors.team2 = "Team 2 is required.";
    } else if (formData.team1 && formData.team1 === formData.team2) {
      newErrors.team2 = "Team 1 and Team 2 must be different.";
    }

    if (!formData.scheduled_time) {
      newErrors.scheduled_time = "Scheduled time is required.";
    } else if (new Date(formData.scheduled_time) < new Date()) {
      newErrors.scheduled_time = "Scheduled time cannot be in the past.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  return (
    <div className={styles.FormContainer}>
      <h2 className={styles.FormHeader}>{match ? "Edit Match" : "Add New Match"}</h2>
      <form className={styles.Form} onSubmit={handleSubmit}>
        {/* Event dropdown */}
        <div className={styles.FormGroup}>
          <label className={styles.Label}>Event:</label>
          <select
            name="event"
            className={`${styles.Input} ${errors.event ? styles.ErrorInput : ""}`}
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
          {errors.event && <div className={styles.Error}>{errors.event}</div>}
        </div>
        <div className={styles.FormGroup}>
          {/* Team 1 dropdown */}
          <label className={styles.Label}>Team 1:</label>
          <select
            name="team1"
            className={`${styles.Input} ${errors.team1 ? styles.ErrorInput : ""}`}
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
          {errors.team1 && <div className={styles.Error}>{errors.team1}</div>}
        </div>
        <div className={styles.FormGroup}>
          {/* Team 2 dropdown */}
          <label className={styles.Label}>Team 2:</label>
          <select
            name="team2"
            className={`${styles.Input} ${errors.team2 ? styles.ErrorInput : ""}`}
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
          {errors.team2 && <div className={styles.Error}>{errors.team2}</div>}
        </div>
        <div className={styles.FormGroup}>
          {/* Scheduled Time, Status, and Result inputs */}
          <label className={styles.Label}>Scheduled Time:</label>
          <input
            type="datetime-local"
            name="scheduled_time"
            className={`${styles.Input} ${errors.scheduled_time ? styles.ErrorInput : ""}`}
            value={formData.scheduled_time}
            onChange={handleChange}
            required
          />
          {errors.scheduled_time && <div className={styles.Error}>{errors.scheduled_time}</div>}
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
          {/* Buttons */}
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
