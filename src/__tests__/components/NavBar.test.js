import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavBar from "../../components/NavBar";

// Mock the CurrentUserContext to control user states in tests
jest.mock("../../contexts/CurrentUserContext", () => ({
  useCurrentUser: jest.fn(), // Mock hook for accessing current user
  useSetCurrentUser: () => ({
    handleLogout: jest.fn(), // Mock logout function
  }),
}));

// Import the mocked hook
import { useCurrentUser } from "../../contexts/CurrentUserContext";

describe("NavBar Component", () => {
  // Helper function to render NavBar with routing context
  const renderNavBar = () =>
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

  // Clear any mocked behavior after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the home, events, and matches links", () => {
    // Simulate a logged-out user
    useCurrentUser.mockReturnValue(null);
    renderNavBar();

    // Verify that the default links are present
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Events/i)).toBeInTheDocument();
    expect(screen.getByText(/Matches/i)).toBeInTheDocument();
  });

  test("renders sign-in and sign-up links when logged out", () => {
    // Simulate a logged-out user
    useCurrentUser.mockReturnValue(null);
    renderNavBar();

    // Check that "Sign In" and "Sign Up" links are displayed
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    // Ensure "Log Out" is not shown for logged-out users
    expect(screen.queryByText(/Log Out/i)).not.toBeInTheDocument();
  });

  test("renders log out link when logged in", () => {
    // Simulate a logged-in user
    useCurrentUser.mockReturnValue({ username: "test_user", role: "user" });
    renderNavBar();

    // Verify that "Log Out" is displayed and login links are hidden
    expect(screen.getByText(/Log Out/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sign In/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sign Up/i)).not.toBeInTheDocument();
  });

  test("renders admin panel link for staff users", () => {
    // Simulate a staff user
    useCurrentUser.mockReturnValue({ username: "admin_user", role: "staff_user" });
    renderNavBar();

    // Ensure the "Admin Panel" link is visible
    expect(screen.getByText(/Admin Panel/i)).toBeInTheDocument();
  });

  test("does not render admin panel link for regular users", () => {
    // Simulate a regular user
    useCurrentUser.mockReturnValue({ username: "regular_user", role: "user" });
    renderNavBar();

    // Verify that the "Admin Panel" link is not shown
    expect(screen.queryByText(/Admin Panel/i)).not.toBeInTheDocument();
  });

  test("calls the toggle function when the toggle button is clicked", () => {
    // Simulate a logged-out user
    useCurrentUser.mockReturnValue(null);
    renderNavBar();

    // Verify the toggle button is present
    const toggleButton = screen.getByRole("button", { name: /toggle navigation/i });
    expect(toggleButton).toBeInTheDocument();

    // Simulate a click event on the toggle button
    fireEvent.click(toggleButton);
    // No error is expected; further behavior can be tested with more implementation
  });
});
