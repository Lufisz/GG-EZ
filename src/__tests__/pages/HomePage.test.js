import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import HomePage from "../../pages/HomePage";

// Mock axios
jest.mock("axios");

describe("HomePage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock data before each test
  });

  const renderComponent = async () => {
    // Wrap rendering in act to handle async updates correctly
    await act(async () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
    });
  };

  test("displays events and matches when data is fetched successfully", async () => {
    // Mock API responses for events and matches
    axios.get
      .mockResolvedValueOnce({
        data: {
          results: [
            { id: 1, name: "Event A", start_date: "2025-01-01", end_date: "2025-01-05" },
            { id: 2, name: "Event B", start_date: "2025-02-01", end_date: "2025-02-05" },
            { id: 3, name: "Event C", start_date: "2025-03-01", end_date: "2025-03-05" },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          results: [
            { id: 1, team1_name: "Team A", team2_name: "Team B", scheduled_time: "2025-01-10" },
            { id: 2, team1_name: "Team C", team2_name: "Team D", scheduled_time: "2025-01-15" },
            { id: 3, team1_name: "Team E", team2_name: "Team F", scheduled_time: "2025-01-20" },
          ],
        },
      });

    await renderComponent();

    // Assert that events are displayed
    await waitFor(() => {
      expect(screen.getByText(/event a/i)).toBeInTheDocument();
      expect(screen.getByText(/event b/i)).toBeInTheDocument();
      expect(screen.getByText(/event c/i)).toBeInTheDocument();
    });

    // Assert that matches are displayed
    await waitFor(() => {
      expect(screen.getByText(/team a vs team b/i)).toBeInTheDocument();
      expect(screen.getByText(/team c vs team d/i)).toBeInTheDocument();
      expect(screen.getByText(/team e vs team f/i)).toBeInTheDocument();
    });
  });

  test("displays appropriate messages when no events or matches are available", async () => {
    // Mock API responses with empty data
    axios.get.mockResolvedValue({ data: { results: [] } });

    await renderComponent();

    // Assert no events and matches messages
    await waitFor(() => {
      expect(screen.getByText(/no upcoming events available/i)).toBeInTheDocument();
      expect(screen.getByText(/no upcoming matches available/i)).toBeInTheDocument();
    });
  });
});
