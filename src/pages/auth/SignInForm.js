import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import CustomToast from "../../components/CustomToast"; // Import CustomToast

const SignInForm = () => {
  const { setCurrentUser } = useSetCurrentUser();

  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = signInData;

  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");
  const history = useHistory();

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      const token = data.key;

      axios.defaults.headers.common["Authorization"] = `Token ${token}`;

      localStorage.setItem("authToken", token);

      const { data: user } = await axios.get("/dj-rest-auth/user/");
      setCurrentUser(user);

      setLoggedInUser(user.username);
      setShowToast(true);

      setTimeout(() => {
        history.push("/");
      }, 3000);
    } catch (err) {
      console.error("Login failed:", err);
      setErrors(err.response?.data || {});
    }
  };

  return (
    <div className={styles.Container}>
      <CustomToast
        show={showToast}
        onClose={() => setShowToast(false)}
        message="You successfully logged in as"
        username={loggedInUser}
      />

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
        {errors.username?.map((message, idx) => (
          <Alert key={idx} variant="warning">
            {message}
          </Alert>
        ))}

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
        {errors.password?.map((message, idx) => (
          <Alert key={idx} variant="warning">
            {message}
          </Alert>
        ))}

        <Button
          className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
          type="submit"
        >
          Sign In
        </Button>
        {errors.non_field_errors?.map((message, idx) => (
          <Alert key={idx} variant="warning" className="mt-3">
            {message}
          </Alert>
        ))}
      </Form>
      <div className="mt-3">
        <Link className={styles.Link} to="/signup">
          Don't have an account? <span>Sign up now!</span>
        </Link>
      </div>
    </div>
  );
};

export default SignInForm;
