import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  const isLoggedIn = false;

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#home">GG-EZ</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/events">Events</Nav.Link>
            <Nav.Link as={Link} to="/matches">Matches</Nav.Link>
            {isLoggedIn ? (
              <NavDropdown title="Account" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/logout">Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;