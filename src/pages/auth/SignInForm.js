import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import styles from "../../styles/pages/SignInUpForm.module.css";
import btnStyles from "../../styles/components/Button.module.css";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import CustomToast from "../../components/CustomToast";

const SignInForm = () => {
  const { setCurrentUser } = useSetCurrentUser();

  // State to hold user input data for sign-in
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = signInData;

  // State to handle errors and UI toast
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");
  const history = useHistory();

  // Update form input values as the user types
  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  // Handle form submission for user sign-in
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send sign-in data to the backend login endpoint
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);

      // Store the access token and set the authorization header for future requests
      const accessToken = data.access_token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      localStorage.setItem("accessToken", accessToken);

      // Fetch the user's role to update the context and local storage
      const roleResponse = await axios.get("/current-user-role/");
      setCurrentUser(roleResponse.data);
      localStorage.setItem("currentUser", JSON.stringify(roleResponse.data));

      // Set the username to display the success toast
      setLoggedInUser(roleResponse.data.username);
      setShowToast(true);

      // Redirect the user to the home page after a short delay
      setTimeout(() => {
        history.push("/");
      }, 1000);
    } catch (err) {
      console.error("Login failed:", err);
      setErrors(err.response?.data || {});
    }
  };

  return (
    <div className={styles.Container}>
      {/* Toast notification for successful login */}
      <CustomToast
        show={showToast}
        onClose={() => setShowToast(false)}
        message="You successfully logged in as"
        username={loggedInUser}
      />

      {/* Sign-in form */}
      <h1 className={styles.Header}>Sign In</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label className="d-none">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Username"
            name="username"
            className={styles.Input}
            value={username}
            onChange={handleChange}
            required
          />
        </Form.Group>
        {/* Display errors related to the username */}
        {errors.username?.map((message, idx) => (
          <Alert key={idx} variant="warning">
            {message}
          </Alert>
        ))}

        {/* Password input */}
        <Form.Group controlId="password">
          <Form.Label className="d-none">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            className={styles.Input}
            value={password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        {/* Display errors related to the password */}
        {errors.password?.map((message, idx) => (
          <Alert key={idx} variant="warning">
            {message}
          </Alert>
        ))}

        {/* Submit button */}
        <Button
          className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
          type="submit"
        >
          Sign In
        </Button>
        {/* Display non-field errors (e.g., general errors) */}
        {errors.non_field_errors?.map((message, idx) => (
          <Alert key={idx} variant="warning" className="mt-3">
            {message}
          </Alert>
        ))}
      </Form>

      {/* Link to the Sign-Up page */}
      <div className="mt-3">
        <Link className={styles.Link} to="/signup">
          Don&apos;t have an account? <span>Sign up now!</span>
        </Link>
      </div>
    </div>
  );
};

export default SignInForm;
