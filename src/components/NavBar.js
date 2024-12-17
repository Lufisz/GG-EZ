import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import styles from "../styles/components/NavBar.module.css";
import { useCurrentUser, useSetCurrentUser } from "../contexts/CurrentUserContext";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";

// NavBar Component: Navigation bar with dynamic options based on the user's login state
const NavBar = () => {
  const currentUser = useCurrentUser(); // Access the current user
  const { handleLogout } = useSetCurrentUser();

  // Manage Navbar toggle behavior with click outside detection
  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  // Icons displayed for logged-in users (includes Log Out)
  const loggedInIcons = (
    <>
      <Nav.Link className={styles.NavLink} onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i> Log Out
      </Nav.Link>
    </>
  );

  // Icons displayed for users who are not logged in (Sign In and Sign Up)
  const loggedOutIcons = (
    <>
      <NavLink
        to="/signin"
        className={styles.NavLink}
        activeClassName={styles.Active}
      >
        <i className="fas fa-sign-in-alt"></i> Sign In
      </NavLink>
      <NavLink
        to="/signup"
        className={styles.NavLink}
        activeClassName={styles.Active}
      >
        <i className="fas fa-user-plus"></i> Sign Up
      </NavLink>
    </>
  );

  return (
    // Main Navbar component
    <Navbar expanded={expanded} expand="md" fixed="top" className={styles.NavBar}>
      <Container>
        {/* Navbar Brand */}
        <Navbar.Brand className={styles.Logo}>GG-EZ</Navbar.Brand>
        {/* Navbar toggle for small screens */}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          className={styles.CustomToggle}
        />
        {/* Collapsible Navbar content */}
        <Navbar.Collapse id="basic-navbar-nav" style={{ backgroundColor: "#1a1a1a" }}>
          <Nav className="ml-auto text-left">
            {/* Home link */}
            <NavLink
              to="/"
              exact
              className={styles.NavLink}
              activeClassName={styles.Active}
            >
              <i className="fas fa-home"></i> Home
            </NavLink>
            {/* Events link */}
            <NavLink
              to="/events"
              className={styles.NavLink}
              activeClassName={styles.Active}
            >
              <i className="fas fa-calendar-alt"></i> Events
            </NavLink>
            {/* Matches link */}
            <NavLink
              to="/matches"
              className={styles.NavLink}
              activeClassName={styles.Active}
            >
              <i className="fas fa-gamepad"></i> Matches
            </NavLink>
            {/* Admin Panel link (only for staff users) */}
            {currentUser?.role === "staff_user" && (
              <NavLink
                to="/admin"
                className={styles.NavLink}
                activeClassName={styles.Active}
              >
                <i className="fas fa-tools"></i> Admin Panel
              </NavLink>
            )}
            {/* Display either logged-in or logged-out icons */}
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
