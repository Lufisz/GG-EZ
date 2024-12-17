import React from "react";
import { useHistory } from "react-router-dom";
import styles from "../styles/admin/AdminPanel.module.css";

// AdminPanel Component: Provides navigation to different admin sections
const AdminPanel = () => {
  const history = useHistory();

  // Function to handle navigation to the specified path
  const handleNavigation = (path) => {
    history.push(path);
  };

  return (
    <div className={styles.Container}>
      {/* Header for the Admin Panel */}
      <h1 className={styles.Header}>Admin Panel</h1>
      <div className={styles.Options}>
                  {/* Container for the navigation options */}
        <div
          className={styles.OptionCard}
          onClick={() => handleNavigation("/admin/matches")}
        >
          <h2>Matches</h2>
        </div>
        {/* Navigation card for Events */}
        <div
          className={styles.OptionCard}
          onClick={() => handleNavigation("/admin/events")}
        >
          <h2>Events</h2>
        </div>
        {/* Navigation card for Teams */}
        <div
          className={styles.OptionCard}
          onClick={() => handleNavigation("/admin/teams")}
        >
          <h2>Teams</h2>
        </div>
        {/* Navigation card for Players */}
        <div
          className={styles.OptionCard}
          onClick={() => handleNavigation("/admin/players")}
        >
          <h2>Players</h2>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
