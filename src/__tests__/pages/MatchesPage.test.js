import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import MatchesPage from "../../pages/MatchesPage";

// Mock axios to simulate API calls
jest.mock("axios");

describe("MatchesPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock data before each test
  });

  const renderComponent = async () => {
    // Wrap rendering in `act` to handle asynchronous updates
    await act(async () => {
      render(
        <BrowserRouter>
          <MatchesPage />
        </BrowserRouter>
      );
    });
  };

  test("renders a loading message while data is being fetched", async () => {
    // Mock API response to simulate data fetching
    axios.get.mockResolvedValueOnce({ data: { results: [] } });

    renderComponent();

    // Assert that the loading message is displayed
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test("displays matches when data is fetched successfully", async () => {
    // Mock API response with match data
    axios.get.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 1,
            team1_name: "Team A",
            team2_name: "Team B",
            event_name: "Championship A",
            scheduled_time: "2025-01-01",
            status: "Upcoming",
          },
          {
            id: 2,
            team1_name: "Team C",
            team2_name: "Team D",
            event_name: "Championship B",
            scheduled_time: "2025-02-01",
            status: "Completed",
          },
        ],
      },
    });

    await renderComponent();

    // Assert that match data is displayed
    await waitFor(() => {
      expect(screen.getByText(/championship a/i)).toBeInTheDocument();
      expect(screen.getByText(/championship b/i)).toBeInTheDocument();
    });
  });

  test("displays a message when no matches are found", async () => {
    // Mock API response with no match data
    axios.get.mockResolvedValueOnce({
      data: {
        results: [],
      },
    });

    await renderComponent();

    // Assert that the "No matches found" message is displayed
    await waitFor(() => {
      expect(screen.getByText(/no matches found/i)).toBeInTheDocument();
    });
  });
});
