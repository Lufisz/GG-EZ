import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/components/Footer.module.css";

// Footer Component: Displays the footer section with links and copyright info
const Footer = () => {
  return (
    <footer className={styles.Footer}>
      <div className={styles.Container}>
        {/* Copyright information with dynamic year */}
        <p className={styles.Copyright}>
          &copy; {new Date().getFullYear()} GG-EZ. All rights reserved.
        </p>
        {/* Footer links section */}
        <div className={styles.Links}>
          <Link to="/privacy-policy" className={styles.FooterLink}>
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className={styles.FooterLink}>
            Terms of Service
          </Link>
          <Link to="/contact-us" className={styles.FooterLink}>
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
