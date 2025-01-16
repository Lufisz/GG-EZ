import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "../../styles/pages/SignInUpForm.module.css";
import btnStyles from "../../styles/components/Button.module.css";
import CustomToast from "../../components/CustomToast";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

const SignUpForm = () => {
  // State to hold form input values
  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
    role: "default_user",
  });
  const { username, email, password1, password2, role } = signUpData;

  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [registeredUser, setRegisteredUser] = useState("");
  const history = useHistory();

  // Handle form input changes
  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

  // Frontend validation logic
  const validateForm = () => {
    const validationErrors = {};

    // Username validation
    if (!username || username.length < 3 || username.length > 30) {
      validationErrors.username = [
        "Username must be between 3 and 30 characters.",
      ];
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      validationErrors.email = ["Please enter a valid email address."];
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password1 || !passwordRegex.test(password1)) {
      validationErrors.password1 = [
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
      ];
    }

    // Confirm password validation
    if (password1 !== password2) {
      validationErrors.password2 = ["Passwords do not match."];
    }

    return validationErrors;
  };

  // Handle form submission for user registration
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Validate inputs before sending data to backend
    const validationErrors = validateForm();

    // If validation errors exist, set them and prevent submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Send a POST request to the registration endpoint
      await axios.post("/dj-rest-auth/registration/", signUpData);
    
      // Set the registered username for the success message
      setRegisteredUser(signUpData.username);
      setShowToast(true); // Show the toast
    
      // Redirect to the sign-in page after a delay
      setTimeout(() => {
        history.push("/signin");
      }, 1500);
    } catch (err) {
      // Set errors returned from the backend
      setErrors(err.response?.data || {});
    }
  };

  return (
    <div className={styles.Container}>
      {/* Toast notification for successful registration */}
      <CustomToast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={`Welcome to GG-EZ,`}
        usernameColor="#00ff99"
        username={registeredUser}
      />

      {/* Sign-Up Form Header */}
      <h1 className={styles.Header}>Sign Up</h1>
      <Form onSubmit={handleSubmit}>
        {/* Username Input */}
        <Form.Group controlId="username">
          <Form.Label className="d-none">Username</Form.Label>
          <Form.Control
            className={styles.Input}
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={handleChange}
            required
          />
        </Form.Group>
        {errors.username?.map((message, idx) => (
          <Alert key={idx} variant="warning">
            {message}
          </Alert>
        ))}

        {/* Email Input */}
        <Form.Group controlId="email">
          <Form.Label className="d-none">Email</Form.Label>
          <Form.Control
            className={styles.Input}
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        {errors.email?.map((message, idx) => (
          <Alert key={idx} variant="warning">
            {message}
          </Alert>
        ))}

        {/* Password Input */}
        <Form.Group controlId="password1">
          <Form.Label className="d-none">Password</Form.Label>
          <Form.Control
            className={styles.Input}
            type="password"
            placeholder="Password"
            name="password1"
            value={password1}
            onChange={handleChange}
            required
          />
        </Form.Group>
        {errors.password1?.map((message, idx) => (
          <Alert key={idx} variant="warning">
            {message}
          </Alert>
        ))}

        {/* Confirm Password Input */}
        <Form.Group controlId="password2">
          <Form.Label className="d-none">Confirm Password</Form.Label>
          <Form.Control
            className={styles.Input}
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={handleChange}
            required
          />
        </Form.Group>
        {errors.password2?.map((message, idx) => (
          <Alert key={idx} variant="warning">
            {message}
          </Alert>
        ))}

        {/* Role Selection Dropdown */}
        <Form.Group controlId="role">
          <Form.Label className="d-none">Role</Form.Label>
          <Form.Control
            as="select"
            className={styles.Input}
            name="role"
            value={role}
            onChange={handleChange}
          >
            <option value="default_user">Default User</option>
            <option value="staff_user">Staff Member</option>
          </Form.Control>
        </Form.Group>
        {errors.role?.map((message, idx) => (
          <Alert key={idx} variant="warning">
            {message}
          </Alert>
        ))}

        {/* Submit Button */}
        <Button
          className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
          type="submit"
          variant="none"
        >
          Sign Up
        </Button>

        {/* Non-Field Errors */}
        {errors.non_field_errors?.map((message, idx) => (
          <Alert key={idx} variant="warning" className="mt-3">
            {message}
          </Alert>
        ))}
      </Form>

      {/* Link to Sign-In Page */}
      <div className="mt-3">
        <Link className={styles.Link} to="/signin">
          Already have an account? <span>Sign in</span>
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
