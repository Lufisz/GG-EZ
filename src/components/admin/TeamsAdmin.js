import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/Admin/AdminPanel.module.css";

const TeamsAdmin = () => {
  const [teams, setTeams] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data } = await axios.get("/api/teams/");
        setTeams(data);
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };

    fetchTeams();
  }, []);

  const handleAddTeam = () => {
    setCurrentTeam(null); // Start with a blank form
    setIsEditing(true);
  };

  const handleEditTeam = (team) => {
    setCurrentTeam(team); // Populate the form with existing team data
    setIsEditing(true);
  };

  const handleSave = async (team) => {
    try {
      if (team.id) {
        // Update existing team
        await axios.put(`/api/teams/${team.id}/`, team);
      } else {
        // Add new team
        await axios.post("/api/teams/", team);
      }
      setIsEditing(false);
      const { data } = await axios.get("/api/teams/");
      setTeams(data);
    } catch (err) {
      console.error("Error saving team:", err);
    }
  };

  return (
    <div className={styles.Container}>
      <h1>Manage Teams</h1>
      {isEditing ? (
        <TeamForm team={currentTeam} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          <button onClick={handleAddTeam}>Add Team</button>
          <ul>
            {teams.map((team) => (
              <li key={team.id}>
                {team.name}
                <button onClick={() => handleEditTeam(team)}>Edit</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

const TeamForm = ({ team, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    team || { name: "", description: "" }
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
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default TeamsAdmin;
