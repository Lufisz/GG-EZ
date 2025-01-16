import React from "react";
import { Toast } from "react-bootstrap";
import toastStyles from "../styles/components/Toast.module.css";

const CustomToast = ({ 
  show,
  onClose,
  message,
  username = null,
  type = "success",
  usernameColor = "#00ff99"
}) => {
  // Determine styles based on the type (success or error)
  const toastStyle =
    type === "success"
      ? { backgroundColor: "#1a1a1a", color: "#00ff99" }
      : { backgroundColor: "#1a1a1a", color: "#ff4d4d" };

  return (
    <Toast
      onClose={onClose}
      show={show}
      delay={3000}
      autohide
      style={toastStyle}
      className={toastStyles.toast}
    >
      <Toast.Body className={toastStyles.toastBody}>
        {message}{" "}
        {username && (
          <span style={{ color: usernameColor, fontWeight: "bold" }}>{username}</span>
        )}
      </Toast.Body>
    </Toast>
  );
};

export default CustomToast;