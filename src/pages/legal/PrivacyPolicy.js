import React from "react";
import styles from "../../styles/footer/LegalPages.module.css";

const PrivacyPolicy = () => {
  return (
    <div className={styles.LegalContainer}>
      <h1 className={styles.LegalTitle}>Privacy Policy</h1>
      <p className={styles.Text}>
        Welcome to GG-EZ! Your privacy is important to us, and we are committed
        to protecting your personal information. This Privacy Policy outlines
        how we collect, use, and safeguard your data when you use our services.
      </p>
      <h2 className={styles.SectionTitle}>Information We Collect</h2>
      <p className={styles.Text}>We may collect the following information:</p>
      <ul className={styles.List}>
        <li>Personal details (e.g., name, email address) when you sign up.</li>
        <li>Usage data to improve our platform.</li>
      </ul>
      <h2 className={styles.SectionTitle}>How We Use Your Information</h2>
      <p className={styles.Text}>We use your information to:</p>
      <ul className={styles.List}>
        <li>Provide and improve our services.</li>
        <li>Communicate updates and offers.</li>
        <li>Ensure a secure experience on our platform.</li>
      </ul>
      <h2 className={styles.SectionTitle}>Your Rights</h2>
      <p className={styles.Text}>You have the right to:</p>
      <ul className={styles.List}>
        <li>Access, update, or delete your personal data.</li>
        <li>Withdraw consent for certain data processing.</li>
        <li>Contact us with any privacy-related concerns.</li>
      </ul>
      <p className={styles.Text}>
        For more details, please reach out to us at{" "}
        <strong>privacy@not-real-email.com</strong>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
