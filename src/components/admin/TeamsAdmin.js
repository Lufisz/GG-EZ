import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/Admin/AdminShared.module.css";

const TeamsAdmin = () => {
  // State to manage teams data
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  // Fetch teams when the component loads
  useEffect(() => {
    fetchTeams();
  }, []);

  // Filter teams based on search input
  useEffect(() => {
    if (searchTerm.trim()) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      setFilteredTeams(
        teams.filter(
          (team) =>
            team.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            String(team.id).includes(searchTerm)
        )
      );
    } else {
      setFilteredTeams(teams); // Show all teams if search is empty
    }
  }, [searchTerm, teams]);

  // Fetch teams data from the API
  const fetchTeams = async (url = "teams/") => {
    try {
      const { data } = await axios.get(url);
      if (Array.isArray(data.results)) {
        setTeams(data.results);
        setFilteredTeams(data.results);
        setNextPage(data.next);
        setPreviousPage(data.previous);
      } else {
        console.error("Unexpected response format:", data);
        setTeams([]);
        setFilteredTeams([]);
      }
    } catch (err) {
      console.error("Error fetching teams:", err.response || err.message);
      setTeams([]);
      setFilteredTeams([]);
    } finally {
      setLoading(false);
    }
  };

  // Open the form to add a new team
  const handleAddTeam = () => {
    setCurrentTeam(null);
    setIsEditing(true);
  };

  // Open the form to edit an existing team
  const handleEditTeam = (team) => {
    setCurrentTeam(team);
    setIsEditing(true);
  };

  // Delete a team by ID
  const handleDeleteTeam = async (teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await axios.delete(`teams/${teamId}/`);
        // Update state after deletion
        setTeams(teams.filter((team) => team.id !== teamId));
        setFilteredTeams(filteredTeams.filter((team) => team.id !== teamId));
      } catch (err) {
        console.error("Error deleting team:", err.response || err.message);
      }
    }
  };

  // Save team data (for adding or editing)
  const handleSave = async (team, file) => {
    try {
      let logoUrl = team.logo;

      // If a new logo file is uploaded
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
          "/cloudinary-proxy/",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.data.secure_url) {
          logoUrl = response.data.secure_url; // Use the uploaded logo URL
        } else {
          console.error("Cloudinary response missing secure_url:", response);
          throw new Error("Failed to retrieve the secure URL from Cloudinary.");
        }
      }

      // Prepare team data for saving
      const teamData = { ...team, logo: logoUrl || null };
 
      // Update or add a new team
      if (team.id) {
        await axios.put(`teams/${team.id}/`, teamData);
      } else {
        await axios.post("teams/", teamData);
      }

      fetchTeams(); // Refresh the team list
      setIsEditing(false); // Close the form
    } catch (err) {
      console.error("Error saving team:", err.response || err.message);
    }
  };

  const handleNextPage = () => {
    if (nextPage) {
      const secureUrl = nextPage.replace(/^http:/, "https:");
      fetchTeams(secureUrl);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      const secureUrl = previousPage.replace(/^http:/, "https:");
      fetchTeams(secureUrl);
    }
  };

  // Show loading indicator while data is being fetched
  if (loading) {
    return <div className={styles.Container}>Loading...</div>;
  }

  return (
    <>
      {!isEditing ? (
        <div className={styles.Container}>
          <h1 className={styles.Header}>Manage Teams</h1>
          <div className={styles.Controls}>
            <button className={styles.Button} onClick={handleAddTeam}>
              Add Team
            </button>
            <input
              type="text"
              className={styles.SearchBar}
              placeholder="Search by ID or Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <table className={styles.Table}>
            <thead>
              <tr>
                <th className={styles.IdColumn}>ID</th>
                <th className={styles.NameColumn}>Name</th>
                <th className={styles.DescriptionColumn}>Description</th>
                <th className={styles.LogoColumn}>Logo</th>
                <th className={styles.ActionsColumn}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team) => (
                <tr key={team.id}>
                  <td className={styles.IdColumn}>{team.id}</td>
                  <td className={styles.NameColumn}>{team.name}</td>
                  <td className={styles.DescriptionColumn}>{team.description}</td>
                  <td className={styles.LogoColumn}>
                    {team.logo && (
                      <a href={team.logo} target="_blank" rel="noopener noreferrer">
                        <img
                          src={team.logo}
                          alt={team.name}
                          className={styles.Avatar}
                        />
                      </a>
                    )}
                  </td>
                  <td className={styles.ActionsColumn}>
                    <button
                      className={styles.Button}
                      onClick={() => handleEditTeam(team)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.Button} ${styles.DeleteButton}`}
                      onClick={() => handleDeleteTeam(team.id)}
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
        // Show team form when editing/adding
        <TeamForm
          team={currentTeam}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </>
  );
};

const TeamForm = ({ team, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    team || { name: "", description: "", logo: "" }
  );
  const [file, setFile] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input for the logo
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
      <h2 className={styles.FormHeader}>{team ? "Edit Team" : "Add New Team"}</h2>
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
          <label className={styles.Label}>Description:</label>
          <textarea
            name="description"
            className={styles.Input}
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className={styles.FormGroup}>
          <label className={styles.Label}>Logo:</label>
          <input
            type="file"
            accept="image/*"
            className={styles.Input}
            onChange={handleFileChange}
          />
          {formData.logo && (
            <a
              href={formData.logo}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.Link}
            >
              View Current Logo
            </a>
          )}
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

export default TeamsAdmin;
