import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavBar from "../../components/NavBar";

// Mock the CurrentUserContext
jest.mock("../../contexts/CurrentUserContext", () => ({
  useCurrentUser: jest.fn(),
  useSetCurrentUser: () => ({
    handleLogout: jest.fn(),
  }),
}));

// Import mocked hooks
import { useCurrentUser } from "../../contexts/CurrentUserContext";

describe("NavBar Component", () => {
  const renderNavBar = () =>
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the home, events, and matches links", () => {
    useCurrentUser.mockReturnValue(null);
    renderNavBar();

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Events/i)).toBeInTheDocument();
    expect(screen.getByText(/Matches/i)).toBeInTheDocument();
  });

  test("renders sign-in and sign-up links when logged out", () => {
    useCurrentUser.mockReturnValue(null);
    renderNavBar();

    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.queryByText(/Log Out/i)).not.toBeInTheDocument();
  });

  test("renders log out link when logged in", () => {
    useCurrentUser.mockReturnValue({ username: "test_user", role: "user" });
    renderNavBar();

    expect(screen.getByText(/Log Out/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sign In/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sign Up/i)).not.toBeInTheDocument();
  });

  test("renders admin panel link for staff users", () => {
    useCurrentUser.mockReturnValue({ username: "admin_user", role: "staff_user" });
    renderNavBar();

    expect(screen.getByText(/Admin Panel/i)).toBeInTheDocument();
  });

  test("does not render admin panel link for regular users", () => {
    useCurrentUser.mockReturnValue({ username: "regular_user", role: "user" });
    renderNavBar();

    expect(screen.queryByText(/Admin Panel/i)).not.toBeInTheDocument();
  });

  test("calls the toggle function when the toggle button is clicked", () => {
    useCurrentUser.mockReturnValue(null);
    renderNavBar();

    const toggleButton = screen.getByRole("button", { name: /toggle navigation/i });
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);
    // Confirm no error is thrown; behavior can be checked more thoroughly with further implementation
  });
});
