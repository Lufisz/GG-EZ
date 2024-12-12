import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import styles from "../styles/NavBar.module.css";

const NavBar = () => {
  return (
    <Navbar expand="md" fixed="top" className={styles.NavBar}>
      <Container>
        <Navbar.Brand className={styles.Logo}>GG-EZ</Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav navbar-light"
          className={styles.CustomToggle}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <Nav.Link href="/" className={styles.NavLink}>
              <i className="fas fa-home"></i> Home
            </Nav.Link>
            <Nav.Link href="/events" className={styles.NavLink}>
              <i className="fas fa-calendar-alt"></i> Events
            </Nav.Link>
            <Nav.Link href="/matches" className={styles.NavLink}>
              <i className="fas fa-gamepad"></i> Matches
            </Nav.Link>
            <Nav.Link href="/signin" className={styles.NavLink}>
              <i className="fas fa-sign-in-alt"></i> Sign In
            </Nav.Link>
            <Nav.Link href="/signup" className={styles.NavLink}>
              <i className="fas fa-user-plus"></i> Sign Up
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
