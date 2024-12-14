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
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" className={styles.FooterLink}>
            Privacy Policy
          </a>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" className={styles.FooterLink}>
            Terms of Service
          </a>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" className={styles.FooterLink}>
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
