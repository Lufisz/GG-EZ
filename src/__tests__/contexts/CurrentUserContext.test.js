import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { CurrentUserProvider, useCurrentUser, useSetCurrentUser } from "../../contexts/CurrentUserContext";

// Mock axios for API calls
jest.mock("axios");

// Helper component to test the CurrentUserContext
const TestComponent = () => {
  const currentUser = useCurrentUser();
  const { setCurrentUser, handleLogout } = useSetCurrentUser();

  return (
    <div>
      {/* Display the current user */}
      <p data-testid="current-user">
        {currentUser ? JSON.stringify(currentUser) : "No user logged in"}
      </p>

      {/* Button to set a mock user */}
      <button
        data-testid="set-user"
        onClick={() => setCurrentUser({ id: 1, username: "testuser" })}
      >
        Set User
      </button>

      {/* Button to log out the user */}
      <button data-testid="logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

// Helper function to render the component with the context provider
const renderWithProvider = () => {
  return render(
    <BrowserRouter>
      <CurrentUserProvider>
        <TestComponent />
      </CurrentUserProvider>
    </BrowserRouter>
  );
};

describe("CurrentUserContext", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset all mocks before each test
    localStorage.clear(); // Clear localStorage to ensure a clean state

    // Mock default API responses
    axios.get.mockResolvedValue({ data: {} });
    axios.post.mockResolvedValue({});
  });

  test("sets current user state correctly", async () => {
    renderWithProvider();

    // Simulate clicking the button to set a user
    fireEvent.click(screen.getByTestId("set-user"));

    // Assert that the user is set correctly
    await waitFor(() => {
      expect(screen.getByTestId("current-user").textContent).toBe(
        JSON.stringify({ id: 1, username: "testuser" })
      );
    });
  });

  test("logs out the user and clears localStorage", async () => {
    // Mock the logout API call
    axios.post.mockResolvedValueOnce({});

    renderWithProvider();

    // Simulate clicking the logout button
    fireEvent.click(screen.getByTestId("logout"));

    // Assert that the user is logged out and localStorage is cleared
    await waitFor(() => {
      expect(screen.getByTestId("current-user").textContent).toBe("No user logged in");
      expect(localStorage.getItem("accessToken")).toBeNull();
      expect(localStorage.getItem("refreshToken")).toBeNull();
    });
  });

  test("fetches user data successfully", async () => {
    // Mock API responses for fetching user data
    axios.get.mockResolvedValueOnce({ data: { id: 1, username: "testuser" } });

    renderWithProvider();

    // Assert that the user data is fetched and displayed
    await waitFor(() => {
      expect(screen.getByTestId("current-user").textContent).toBe(
        JSON.stringify({ id: 1, username: "testuser" })
      );
    });
  });
});
