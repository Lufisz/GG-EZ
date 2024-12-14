import React from "react";
import { useHistory } from "react-router-dom";
import styles from "../styles/Admin/AdminPanel.module.css";

const AdminPanel = () => {
  const history = useHistory();

  const handleNavigation = (path) => {
    history.push(path);
  };

  return (
    <div className={styles.Container}>
      <h1 className={styles.Header}>Admin Panel</h1>
      <div className={styles.Options}>
        <div
          className={styles.OptionCard}
          onClick={() => handleNavigation("/admin/teams")}
        >
          <h2>Teams</h2>
        </div>
        <div
          className={styles.OptionCard}
          onClick={() => handleNavigation("/admin/events")}
        >
          <h2>Events</h2>
        </div>
        <div
          className={styles.OptionCard}
          onClick={() => handleNavigation("/admin/matches")}
        >
          <h2>Matches</h2>
        </div>
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
