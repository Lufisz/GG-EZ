import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/admin/AdminShared.module.css";

// PlayersAdmin Component: Manages and displays players in the admin panel
const PlayersAdmin = () => {
  // State to manage players data
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  // Fetch players when the component loads
  useEffect(() => {
    fetchPlayers();
  }, []);

  // Filter players based on search input
  useEffect(() => {
    if (searchTerm.trim()) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      setFilteredPlayers(
        players.filter(
          (player) =>
            player.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            player.team_name.toLowerCase().includes(lowerCaseSearchTerm) ||
            String(player.id).includes(searchTerm)
        )
      );
    } else {
      setFilteredPlayers(players); // Show all players if search is empty
    }
  }, [searchTerm, players]);

  // Fetch players data from the API
  const fetchPlayers = async (url = "players/") => {
    try {
      const { data } = await axios.get(url);
      if (Array.isArray(data.results)) {
        setPlayers(data.results);
        setFilteredPlayers(data.results);
        setNextPage(data.next);
        setPreviousPage(data.previous);
      } else {
        console.error("Unexpected response format:", data);
        setPlayers([]);
        setFilteredPlayers([]);
      }
    } catch (err) {
      console.error("Error fetching players:", err.response || err.message);
      setPlayers([]);
      setFilteredPlayers([]);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Open the form to add a new player
  const handleAddPlayer = () => {
    setCurrentPlayer(null);
    setIsEditing(true);
  };

  // Open the form to edit an existing player
  const handleEditPlayer = (player) => {
    setCurrentPlayer(player);
    setIsEditing(true);
  };

  // Delete a player by ID
  const handleDeletePlayer = async (playerId) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      try {
        await axios.delete(`players/${playerId}/`);
        // Update state after deletion
        setPlayers(players.filter((player) => player.id !== playerId));
        setFilteredPlayers(filteredPlayers.filter((player) => player.id !== playerId));
      } catch (err) {
        console.error("Error deleting player:", err.response || err.message);
      }
    }
  };

  // Save player data (for adding or editing)
  const handleSave = async (player, file) => {
    try {
      let avatarUrl = player.avatar;

      // If a new avatar file is uploaded
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
          "/cloudinary-proxy/",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.data.secure_url) {
          avatarUrl = response.data.secure_url; // Use the uploaded avatar URL
        } else {
          console.error("Cloudinary response missing secure_url:", response);
          throw new Error("Failed to retrieve the secure URL from Cloudinary.");
        }
      }

      // Prepare player data for saving
      const playerData = {
        ...player,
        avatar: avatarUrl || null,
        team: player.team || null,
      };

      // Update or add a new player
      if (player.id) {
        await axios.put(`players/${player.id}/`, playerData);
      } else {
        await axios.post("players/", playerData);
      }

      fetchPlayers(); // Refresh the player list
      setIsEditing(false); // Close the form
    } catch (err) {
      console.error("Error saving player:", err.response || err.message);
    }
  };

  // Fetch the next page of players
  const handleNextPage = () => {
    if (nextPage) {
      const secureUrl = nextPage.replace(/^http:/, "https:");
      fetchPlayers(secureUrl);
    }
  };

  // Fetch the previous page of players
  const handlePreviousPage = () => {
    if (previousPage) {
      const secureUrl = previousPage.replace(/^http:/, "https:");
      fetchPlayers(secureUrl);
    }
  };

  // Show loading indicator while data is being fetched
  if (loading) {
    return <div className={styles.Container}>Loading...</div>;
  }

  return (
    <>
      {/* Display player list or player form */}
      {!isEditing ? (
        <div className={styles.Container}>
          <h1 className={styles.Header}>Manage Players</h1>
          <button className={styles.Button} onClick={handleAddPlayer}>
            Add Player
          </button>
          <input
            type="text"
            className={styles.SearchBar}
            placeholder="Search by ID, Name, or Team"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <table className={styles.Table}>
            <thead>
              <tr>
                <th className={styles.IdColumn}>ID</th>
                <th className={styles.NameColumn}>Name</th>
                <th className={styles.RoleColumn}>Role</th>
                <th className={styles.AvatarColumn}>Avatar URL</th>
                <th className={styles.TeamColumn}>Team</th>
                <th className={styles.ActionsColumn}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player) => (
                <tr key={player.id}>
                  <td className={styles.IdColumn}>{player.id}</td>
                  <td className={styles.NameColumn}>{player.name}</td>
                  <td className={styles.RoleColumn}>{player.role}</td>
                  <td className={styles.AvatarColumn}>
                    <a href={player.avatar} target="_blank" rel="noopener noreferrer">
                      <img
                        src={player.avatar}
                        alt={player.name}
                        className={styles.Avatar}
                      />
                    </a>
                  </td>
                  <td className={styles.TeamColumn}>{player.team_name}</td>
                  <td className={styles.ActionsColumn}>
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
        // Show player form when editing/adding
        <PlayerForm
          player={currentPlayer}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </>
  );
};

// PlayerForm Component: Form to add or edit a player
const PlayerForm = ({ player, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    player || { name: "", role: "", avatar: "", team: "" }
  );
  const [file, setFile] = useState(null);
  const [teams, setTeams] = useState([]);

  // Fetch available teams when the form loads
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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input for the avatar
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
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
