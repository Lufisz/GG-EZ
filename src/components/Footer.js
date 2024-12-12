import React from "react";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.Footer}>
      <div className={styles.Container}>
        <p className={styles.Copyright}>
          &copy; {new Date().getFullYear()} GG-EZ. All rights reserved.
        </p>
        <div className={styles.Links}>
          <a href="/privacy" className={styles.FooterLink}>
            Privacy Policy
          </a>
          <a href="/terms" className={styles.FooterLink}>
            Terms of Service
          </a>
          <a href="/contact" className={styles.FooterLink}>
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
