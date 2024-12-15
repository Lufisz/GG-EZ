import React, { useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import HomePage from "./pages/HomePage";
import AdminPanel from "./components/AdminPanel";
import TeamsAdmin from "./components/admin/TeamsAdmin";
import EventsAdmin from "./components/admin/EventsAdmin";
import MatchesAdmin from "./components/admin/MatchesAdmin";
import PlayersAdmin from "./components/admin/PlayersAdmin";
import { CurrentUserProvider, useSetCurrentUser } from "./contexts/CurrentUserContext";
import "./api/axiosDefaults";
import axios from "axios";

function App() {
  const history = useHistory();
  const setCurrentUser = useSetCurrentUser();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const { data: user } = await axios.get("/dj-rest-auth/user/");
          setCurrentUser(user);
        } catch (err) {
          console.error("Failed to fetch user:", err);
          localStorage.removeItem("accessToken");
          history.push("/signin");
        }
      }
    };

    fetchCurrentUser();
  }, [setCurrentUser, history]);

  return (
    <CurrentUserProvider>
      <div className={styles.App}>
        <NavBar />
        <Container className={styles.Main}>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/events" render={() => <h1>Events Page</h1>} />
            <Route exact path="/matches" render={() => <h1>Matches Page</h1>} />
            <Route exact path="/signin" component={SignInForm} />
            <Route exact path="/signup" component={SignUpForm} />
            <Route exact path="/admin" component={AdminPanel} />
            <Route exact path="/admin/teams" component={TeamsAdmin} />
            <Route exact path="/admin/events" component={EventsAdmin} />
            <Route exact path="/admin/matches" component={MatchesAdmin} />
            <Route exact path="/admin/players" component={PlayersAdmin} />
            <Route render={() => <p>Page not found!</p>} />
          </Switch>
        </Container>
        <Footer />
      </div>
    </CurrentUserProvider>
  );
}

export default App;
