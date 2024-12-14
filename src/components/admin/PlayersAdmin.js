import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/Admin/AdminShared.module.css";

const PlayersAdmin = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async (url = "players/") => {
    try {
      const { data } = await axios.get(url);
      if (Array.isArray(data.results)) {
        setPlayers(data.results);
        setNextPage(data.next);
        setPreviousPage(data.previous);
      } else {
        console.error("Unexpected response format:", data);
        setPlayers([]);
      }
    } catch (err) {
      console.error("Error fetching players:", err.response || err.message);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = () => {
    setCurrentPlayer(null);
    setIsEditing(true);
  };

  const handleEditPlayer = (player) => {
    setCurrentPlayer(player);
    setIsEditing(true);
  };

  const handleDeletePlayer = async (playerId) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      try {
        await axios.delete(`players/${playerId}/`);
        setPlayers(players.filter((player) => player.id !== playerId));
      } catch (err) {
        console.error("Error deleting player:", err.response || err.message);
      }
    }
  };

  const handleSave = async (player, file) => {
    try {
      let avatarUrl = player.avatar;
  
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
  
        const response = await axios.post(
          "/cloudinary-proxy/",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
  
        if (response.data.secure_url) {
          avatarUrl = response.data.secure_url;
        } else {
          console.error("Cloudinary response missing secure_url:", response);
          throw new Error("Failed to retrieve the secure URL from Cloudinary.");
        }
      }
  
      const playerData = { ...player, avatar: avatarUrl };
  
      if (player.id) {
        await axios.put(`players/${player.id}/`, playerData);
      } else {
        await axios.post("players/", playerData);
      }
  
      fetchPlayers();
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving player:", err.response || err.message);
    }
  };
  

  const handleNextPage = () => {
    if (nextPage) fetchPlayers(nextPage);
  };

  const handlePreviousPage = () => {
    if (previousPage) fetchPlayers(previousPage);
  };

  if (loading) {
    return <div className={styles.Container}>Loading...</div>;
  }

  return (
    <>
      {!isEditing ? (
        <div className={styles.Container}>
          <h1 className={styles.Header}>Manage Players</h1>
          <button className={styles.Button} onClick={handleAddPlayer}>
            Add Player
          </button>
          <table className={styles.Table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Avatar URL</th>
                <th>Team</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id}>
                  <td>{player.id}</td>
                  <td>{player.name}</td>
                  <td>{player.role}</td>
                  <td>
                    <a href={player.avatar} target="_blank" rel="noopener noreferrer">
                      <img
                        src={player.avatar}
                        alt={player.name}
                        className={styles.Avatar}
                      />
                    </a>
                  </td>
                  <td>{player.team_name}</td>
                  <td>
                    <button
                      className={styles.Button}
                      onClick={() => handleEditPlayer(player)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.Button} ${styles.DeleteButton}`}
                      onClick={() => handleDeletePlayer(player.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        <PlayerForm
          player={currentPlayer}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </>
  );
};

const PlayerForm = ({ player, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    player || { name: "", role: "", avatar: "", team: "" }
  );
  const [file, setFile] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get("/teams/");
        setTeams(response.data.results || response.data);
      } catch (err) {
        console.error("Error fetching teams:", err.response || err.message);
      }
    };

    fetchTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, file);
  };

  return (
    <div className={styles.FormContainer}>
      <h2 className={styles.FormHeader}>{player ? "Edit Player" : "Add New Player"}</h2>
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
        </div>
        <div className={styles.FormGroup}>
          <label className={styles.Label}>Role:</label>
          <input
            type="text"
            name="role"
            className={styles.Input}
            value={formData.role}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.FormGroup}>
          <label className={styles.Label}>Avatar:</label>
          <input
            type="file"
            accept="image/*"
            className={styles.Input}
            onChange={handleFileChange}
          />
          {formData.avatar && (
            <a
              href={formData.avatar}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.Link}
            >
              View Current Avatar
            </a>
          )}
        </div>
        <div className={styles.FormGroup}>
          <label className={styles.Label}>Team:</label>
          <select
            name="team"
            className={styles.Input}
            value={formData.team}
            onChange={handleChange}
            required
          >
            <option value="">Select a Team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
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

export default PlayersAdmin;
