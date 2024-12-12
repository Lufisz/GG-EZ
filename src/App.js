import React from "react";
import { Route, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SignUpForm from "./pages/auth/SignUpForm";
import "./api/axiosDefaults"

function App() {
  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path="/" render={() => <h1>Home Page</h1>} />
          <Route exact path="/events" render={() => <h1>Events Page</h1>} />
          <Route exact path="/matches" render={() => <h1>Matches Page</h1>} />
          <Route exact path="/signin" render={() => <h1>Sign In Page</h1>} />
          <Route exact path="/signup" component={SignUpForm} />
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
      <Footer />
    </div>
  );
}

export default App;