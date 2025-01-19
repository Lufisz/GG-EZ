import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import SignUpForm from "../../../pages/auth/SignUpForm";

// Mock axios to simulate API responses
jest.mock("axios");

describe("SignUpForm Component", () => {
  // Setup before each test
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks to avoid cross-test contamination
    jest.useFakeTimers(); // Use fake timers for setTimeout
  });

  // Cleanup after each test
  afterEach(() => {
    jest.runOnlyPendingTimers(); // Run any pending timers
    jest.useRealTimers(); // Reset timers to real time
  });

  // Helper function to render the component
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <SignUpForm />
      </BrowserRouter>
    );
  };

  // Test: Ensure all form fields and the submit button are rendered
  test("renders the form fields and sign-up button", () => {
    renderComponent();

    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  // Test: Ensure input fields update when the user types
  test("updates form fields on user input", () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Test@1234" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "Test@1234" },
    });

    expect(screen.getByPlaceholderText("Username").value).toBe("testuser");
    expect(screen.getByPlaceholderText("Email").value).toBe("test@example.com");
    expect(screen.getByPlaceholderText("Password").value).toBe("Test@1234");
    expect(screen.getByPlaceholderText("Confirm Password").value).toBe("Test@1234");
  });

  // Test: Display validation errors for invalid inputs
  test("displays validation errors for invalid inputs", async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "ab" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invalidemail" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "456" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/username must be between 3 and 30 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character/i
        )
      ).toBeInTheDocument();
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  // Test: Display non-field errors returned by the API
  test("displays non-field errors from the API", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          non_field_errors: ["Unable to register with provided credentials."],
        },
      },
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Test@1234" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "Test@1234" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText(/unable to register with provided credentials\./i)
      ).toBeInTheDocument();
    });
  });
});
