import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { BrowserRouter, useParams, useHistory } from "react-router-dom";
import axios from "axios";
import MatchesDetailPage from "../../pages/MatchDetailPage";

// Mock dependencies to simulate API and router behavior
jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(), // Mock useParams for route parameters
  useHistory: jest.fn(), // Mock useHistory for navigation
}));

describe("MatchesDetailPage Component", () => {
  const mockPush = jest.fn(); // Mock push method for navigation

  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
    useParams.mockReturnValue({ id: "1" }); // Mock useParams to simulate route parameter `id`
    useHistory.mockReturnValue({ push: mockPush }); // Mock useHistory for navigation

    // Suppress console.error to avoid noise from expected errors
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore original console methods after each test
  });

  const renderComponent = async () => {
    // Wrap rendering with `act` to ensure state updates are handled correctly
    await act(async () => {
      render(
        <BrowserRouter>
          <MatchesDetailPage />
        </BrowserRouter>
      );
    });
  };

  test("renders loading message while fetching data", async () => {
    // Simulate API call returning null data
    axios.get.mockResolvedValueOnce({ data: null });

    renderComponent();

    // Assert that the loading message is displayed
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test("displays match details when data is fetched successfully", async () => {
    // Simulate successful API response with match data
    axios.get.mockResolvedValueOnce({
      data: {
        team1_name: "Team A",
        team2_name: "Team B",
        event_name: "Esports Championship",
        scheduled_time: "2025-01-01 12:00:00",
        status: "Scheduled",
        result: "2-1",
      },
    });

    await renderComponent();

    // Assert that match details are displayed correctly
    await waitFor(() => {
      expect(screen.getByText(/team a vs team b/i)).toBeInTheDocument();
      expect(screen.getByText(/event: esports championship/i)).toBeInTheDocument();
      expect(screen.getByText(/scheduled: 2025-01-01 12:00:00/i)).toBeInTheDocument();
      expect(
        screen.getByText((content, element) => element.textContent === "Status: Scheduled")
      ).toBeInTheDocument();
      expect(
        screen.getByText((content, element) => element.textContent === "Result: 2-1")
      ).toBeInTheDocument();
    });
  });

  test("displays error message when match is not found", async () => {
    // Simulate API response with no match data
    axios.get.mockResolvedValueOnce({ data: null });

    await renderComponent();

    // Assert that the "Match not found" message is displayed
    await waitFor(() => {
      expect(screen.getByText(/match not found/i)).toBeInTheDocument();
    });
  });

  test("handles API errors gracefully", async () => {
    // Simulate a network error during API call
    axios.get.mockRejectedValueOnce(new Error("Network error"));

    await renderComponent();

    // Assert that the "Match not found" message is displayed despite the error
    await waitFor(() => {
      expect(screen.getByText(/match not found/i)).toBeInTheDocument();
    });
  });

  test("navigates back to matches list when 'Back to Matches' button is clicked", async () => {
    // Simulate successful API response with match data
    axios.get.mockResolvedValueOnce({
      data: {
        team1_name: "Team A",
        team2_name: "Team B",
        event_name: "Esports Championship",
        scheduled_time: "2025-01-01 12:00:00",
        status: "Scheduled",
      },
    });

    await renderComponent();

    // Wait for match details to load
    await waitFor(() => {
      expect(screen.getByText(/team a vs team b/i)).toBeInTheDocument();
    });

    // Simulate clicking the "Back to Matches" button
    fireEvent.click(screen.getByRole("button", { name: /back to matches/i }));

    // Assert that the mock push method was called with the correct path
    expect(mockPush).toHaveBeenCalledWith("/matches");
  });
});
