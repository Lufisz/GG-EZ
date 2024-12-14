import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/Admin/AdminPanel.module.css";

const MatchesAdmin = () => {
  const [matches, setMatches] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data } = await axios.get("/api/matches/");
        setMatches(data);
      } catch (err) {
        console.error("Error fetching matches:", err);
      }
    };

    fetchMatches();
  }, []);

  const handleAddMatch = () => {
    setCurrentMatch(null); // Start with a blank form
    setIsEditing(true);
  };

  const handleEditMatch = (match) => {
    setCurrentMatch(match); // Populate the form with existing match data
    setIsEditing(true);
  };

  const handleSave = async (match) => {
    try {
      if (match.id) {
        // Update existing match
        await axios.put(`/api/matches/${match.id}/`, match);
      } else {
        // Add new match
        await axios.post("/api/matches/", match);
      }
      setIsEditing(false);
      const { data } = await axios.get("/api/matches/");
      setMatches(data);
    } catch (err) {
      console.error("Error saving match:", err);
    }
  };

  return (
    <div className={styles.Container}>
      <h1>Manage Matches</h1>
      {isEditing ? (
        <MatchForm match={currentMatch} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          <button onClick={handleAddMatch}>Add Match</button>
          <ul>
            {matches.map((match) => (
              <li key={match.id}>
                {match.name}
                <button onClick={() => handleEditMatch(match)}>Edit</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

const MatchForm = ({ match, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    match || { name: "", date: "", teams: "" }
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
        Date:
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Teams:
        <input
          type="text"
          name="teams"
          value={formData.teams}
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

export default MatchesAdmin;
