import React from "react";
import styles from "../../styles/footer/LegalPages.module.css";

const ContactUs = () => {
  return (
    <div className={styles.LegalContainer}>
      <h1 className={styles.LegalTitle}>Contact Us</h1>
      <p className={styles.Text}>
        We&apos;d love to hear from you! Here&apos;s how you can get in touch with us:
      </p>
      <ul className={styles.List}>
        <li>
          <strong>Email:</strong> support@not-real-email.com
        </li>
        <li>
          <strong>Phone:</strong> +123 456 7890
        </li>
        <li>
          <strong>Address:</strong> 123 GG-EZ Lane, Esports City
        </li>
      </ul>
      <p className={styles.Text}>
        For any queries or feedback, don&apos;t hesitate to reach out. We&apos;re here to
        help!
      </p>
    </div>
  );
};

export default ContactUs;
