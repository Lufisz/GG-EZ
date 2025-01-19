import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import SignInForm from "../../../pages/auth/SignInForm";
import { useSetCurrentUser } from "../../../contexts/CurrentUserContext";

// Mock the `useSetCurrentUser` context to provide a mocked setter function
jest.mock("../../../contexts/CurrentUserContext", () => ({
  useSetCurrentUser: jest.fn(),
}));

// Mock Axios to control and test API requests
jest.mock("axios");

describe("SignInForm Component", () => {
  const setCurrentUserMock = jest.fn(); // Mock function to simulate setting the current user
  let consoleErrorMock; // Mock for console.error to suppress error logs during tests

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
    useSetCurrentUser.mockReturnValue({ setCurrentUser: setCurrentUserMock }); // Mock context return value
    consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {}); // Mock console.error
  });

  afterEach(() => {
    consoleErrorMock.mockRestore(); // Restore console.error after each test
  });

  // Helper function to render the component inside a BrowserRouter
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );
  };

  test("renders the form fields and sign-in button", () => {
    renderComponent();

    // Check for the presence of input fields and the sign-in button
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  test("updates form fields on user input", () => {
    renderComponent();

    // Get the username and password input fields
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });

    // Verify the input fields contain the correct values
    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("testpassword");
  });

  test("displays a success toast and redirects on successful login", async () => {
    // Mock successful login API response
    axios.post.mockResolvedValueOnce({
      data: { access_token: "mockAccessToken" },
    });
    // Mock successful user data retrieval
    axios.get.mockResolvedValueOnce({
      data: { username: "testuser" },
    });

    renderComponent();

    // Simulate user input
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signInButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });
    fireEvent.click(signInButton);

    // Wait for the toast message to appear and verify it
    await waitFor(() => {
      expect(screen.getByText(/you successfully logged in as/i)).toBeInTheDocument();
      expect(screen.getByText("testuser")).toBeInTheDocument();
    });

    // Verify that the current user is set and the access token is stored
    expect(setCurrentUserMock).toHaveBeenCalledWith({ username: "testuser" });
    expect(localStorage.getItem("accessToken")).toBe("mockAccessToken");
  });

  test("displays field-specific errors from the API", async () => {
    // Mock API response with field-specific errors
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          username: ["Invalid username."],
          password: ["Invalid password."],
        },
      },
    });

    renderComponent();

    // Simulate user input
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signInButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: "wronguser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(signInButton);

    // Wait for the error messages to appear and verify them
    await waitFor(() => {
      expect(screen.getByText(/invalid username\./i)).toBeInTheDocument();
      expect(screen.getByText(/invalid password\./i)).toBeInTheDocument();
    });
  });

  test("displays non-field errors from the API", async () => {
    // Mock API response with non-field errors
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          non_field_errors: ["Unable to log in with provided credentials."],
        },
      },
    });

    renderComponent();

    // Simulate user input
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signInButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: "wronguser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(signInButton);

    // Wait for the error message to appear and verify it
    await waitFor(() => {
      expect(
        screen.getByText(/unable to log in with provided credentials\./i)
      ).toBeInTheDocument();
    });
  });
});
