import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "../../styles/pages/SignInUpForm.module.css";
import btnStyles from "../../styles/components/Button.module.css";
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
  const history = useHistory();

  // Handle form input changes
  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

  // Handle form submission for user registration
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send a POST request to the registration endpoint
      await axios.post("/dj-rest-auth/registration/", signUpData);
      history.push("/signin");
    } catch (err) {
      // Set errors returned from the backend
      setErrors(err.response?.data || {});
    }
  };

  return (
    <div className={styles.Container}>
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
