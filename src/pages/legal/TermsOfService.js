import React from "react";
import styles from "../../styles/footer/LegalPages.module.css";

const TermsOfService = () => {
  return (
    <div className={styles.LegalContainer}>
      <h1 className={styles.LegalTitle}>Terms of Service</h1>
      <p className={styles.Text}>
        Welcome to GG-EZ! These terms govern your use of our platform. By using
        GG-EZ, you agree to the following terms:
      </p>
      <h2 className={styles.SectionTitle}>1. Account Registration</h2>
      <p className={styles.Text}>
        You must provide accurate information when creating an account. Keep
        your login details secure and notify us immediately if you suspect
        unauthorized access.
      </p>
      <h2 className={styles.SectionTitle}>2. Acceptable Use</h2>
      <p className={styles.Text}>When using our platform, you agree to:</p>
      <ul className={styles.List}>
        <li>Respect other users and avoid abusive behavior.</li>
        <li>Refrain from sharing illegal or harmful content.</li>
        <li>Use GG-EZ services only for lawful purposes.</li>
      </ul>
      <h2 className={styles.SectionTitle}>3. Intellectual Property</h2>
      <p className={styles.Text}>
        All content on GG-EZ is protected by intellectual property laws. You may
        not copy or distribute any material without permission.
      </p>
      <h2 className={styles.SectionTitle}>4. Limitation of Liability</h2>
      <p className={styles.Text}>
        GG-EZ is provided &quot;as is.&quot; We are not liable for any losses or damages
        arising from your use of our platform.
      </p>
      <h2 className={styles.SectionTitle}>5. Changes to Terms</h2>
      <p className={styles.Text}>
        We may update these terms from time to time. Continued use of the
        platform indicates your acceptance of the revised terms.
      </p>
      <p className={styles.Text}>
        If you have any questions, feel free to contact us at{" "}
        <strong>support@not-real-email.com</strong>.
      </p>
    </div>
  );
};

export default TermsOfService;
