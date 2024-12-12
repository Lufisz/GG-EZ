import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "../../styles/SignUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

const SignUpForm = () => {
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

  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/dj-rest-auth/registration/", signUpData);
      history.push("/signin");
    } catch (err) {
      setErrors(err.response?.data || {});
    }
  };

  return (
    <div className={styles.Container}>
      <h1 className={styles.Header}>Sign Up</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label className="d-none">Username</Form.Label>
          <Form.Control
            className={styles.Input}
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={handleChange}
          />
        </Form.Group>
        {errors.username?.map((message, idx) => (
          <Alert key={idx} variant="warning">
            {message}
          </Alert>
        ))}

        <Form.Group controlId="email">
          <Form.Label className="d-none">Email</Form.Label>
          <Form.Control
            className={styles.Input}
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </Form.Group>
        {errors.email?.map((message, idx) => (
          <Alert key={idx} variant="warning">
            {message}
          </Alert>
        ))}

        <Form.Group controlId="password1">
          <Form.Label className="d-none">Password</Form.Label>
          <Form.Control
            className={styles.Input}
            type="password"
            placeholder="Password"
            name="password1"
            value={password1}
            onChange={handleChange}
          />
        </Form.Group>
        {errors.password1?.map((message, idx) => (
          <Alert key={idx} variant="warning">
            {message}
          </Alert>
        ))}

        <Form.Group controlId="password2">
          <Form.Label className="d-none">Confirm Password</Form.Label>
          <Form.Control
            className={styles.Input}
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={handleChange}
          />
        </Form.Group>
        {errors.password2?.map((message, idx) => (
          <Alert key={idx} variant="warning">
            {message}
          </Alert>
        ))}

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

        <Button
          className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
          type="submit"
          variant="none"
        >
          Sign Up
        </Button>
        {errors.non_field_errors?.map((message, idx) => (
          <Alert key={idx} variant="warning" className="mt-3">
            {message}
          </Alert>
        ))}
      </Form>
      <div className="mt-3">
        <Link className={styles.Link} to="/signin">
          Already have an account? <span>Sign in</span>
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
