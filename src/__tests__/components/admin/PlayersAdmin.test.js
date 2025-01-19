import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import axios from "axios";
import PlayersAdmin from "../../../components/admin/PlayersAdmin";

// Mocking axios to intercept and control API calls during tests
jest.mock("axios");

// Reset mocks and timers after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});

// Reset timers globally after all tests
afterAll(() => {
  jest.useRealTimers();
});

describe("PlayersAdmin Component", () => {
  // Clear all mock implementations before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading spinner initially", async () => {
    // Simulate a pending API request
    axios.get.mockImplementationOnce(() => new Promise(() => {}));
    render(<PlayersAdmin />);

    // Verify if the loading spinner is displayed while fetching data
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test("fetches and displays players", async () => {
    // Mock API response with a list of players
    const mockPlayers = {
      results: [
        { id: 1, name: "Player 1", role: "Striker", team_name: "Team A" },
        { id: 2, name: "Player 2", role: "Defender", team_name: "Team B" },
      ],
      next: null,
      previous: null,
    };

    // Mock axios GET request
    axios.get.mockResolvedValueOnce({ data: mockPlayers });

    // Render the component and wait for the API call to complete
    await act(async () => {
      render(<PlayersAdmin />);
    });

    // Verify if players are displayed in the table
    expect(screen.getByText("Player 1")).toBeInTheDocument();
    expect(screen.getByText("Player 2")).toBeInTheDocument();
  });

  test("shows error toast on failed fetch", async () => {
    // Silence console.error during this test to avoid noise in test output
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Mock a failed API request
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    // Render the component
    await act(async () => {
      render(<PlayersAdmin />);
    });

    // Verify if an error toast is displayed
    expect(screen.getByText(/failed to fetch players/i)).toBeInTheDocument();

    // Restore original console.error behavior
    consoleErrorSpy.mockRestore();
  });

  test("filters players based on search input", async () => {
    // Mock API response with a list of players
    const mockPlayers = {
      results: [
        { id: 1, name: "Player 1", role: "Striker", team_name: "Team A" },
        { id: 2, name: "Player 2", role: "Defender", team_name: "Team B" },
      ],
      next: null,
      previous: null,
    };

    // Mock axios GET request
    axios.get.mockResolvedValueOnce({ data: mockPlayers });

    // Render the component
    await act(async () => {
      render(<PlayersAdmin />);
    });

    // Simulate typing in the search bar
    const searchBar = screen.getByPlaceholderText(/search by id, name, or team/i);
    fireEvent.change(searchBar, { target: { value: "Player 1" } });

    // Verify if only the matching player is displayed
    expect(screen.getByText("Player 1")).toBeInTheDocument();
    expect(screen.queryByText("Player 2")).not.toBeInTheDocument();
  });

  test("deletes a player when delete is confirmed", async () => {
    // Mock API response with a list of players
    const mockPlayers = {
      results: [
        { id: 1, name: "Player 1", role: "Striker", team_name: "Team A" },
      ],
      next: null,
      previous: null,
    };

    // Mock axios GET and DELETE requests
    axios.get.mockResolvedValueOnce({ data: mockPlayers });
    axios.delete.mockResolvedValueOnce({});

    // Render the component
    await act(async () => {
      render(<PlayersAdmin />);
    });

    // Simulate clicking the delete button and confirming the action
    const deleteButton = screen.getByText(/delete/i);
    window.confirm = jest.fn(() => true); // Mock confirmation dialog
    fireEvent.click(deleteButton);

    // Verify if the player is removed from the list
    await waitFor(() => {
      expect(screen.queryByText("Player 1")).not.toBeInTheDocument();
    });
  });

  test("cancels delete operation if confirmation is denied", async () => {
    // Mock API response with a list of players
    const mockPlayers = {
      results: [
        { id: 1, name: "Player 1", role: "Striker", team_name: "Team A" },
      ],
      next: null,
      previous: null,
    };

    // Mock axios GET request
    axios.get.mockResolvedValueOnce({ data: mockPlayers });

    // Render the component
    await act(async () => {
      render(<PlayersAdmin />);
    });

    // Simulate clicking the delete button and denying the confirmation
    const deleteButton = screen.getByText(/delete/i);
    window.confirm = jest.fn(() => false); // Mock cancellation dialog
    fireEvent.click(deleteButton);

    // Verify that the player remains in the list
    expect(screen.getByText("Player 1")).toBeInTheDocument();
  });

  test("shows the player form when adding a new player", async () => {
    // Mock axios GET request for teams and players
    axios.get.mockImplementation((url) => {
      if (url === "/teams/") {
        return Promise.resolve({
          data: { results: [{ id: 1, name: "Team A" }, { id: 2, name: "Team B" }] },
        });
      }
      return Promise.resolve({ data: { results: [], next: null, previous: null } });
    });
  
    // Render the PlayersAdmin component
    await act(async () => {
      render(<PlayersAdmin />);
    });
  
    // Simulate clicking the "Add Player" button
    await act(async () => {
      const addButton = screen.getByText(/add player/i);
      fireEvent.click(addButton);
    });
  
    // Verify that the player form is displayed
    expect(screen.getByText(/add new player/i)).toBeInTheDocument();
  
    // Verify that the dropdown contains the mocked teams
    expect(screen.getByText(/select a team/i)).toBeInTheDocument();
    expect(screen.getByText("Team A")).toBeInTheDocument();
    expect(screen.getByText("Team B")).toBeInTheDocument();
  });  

  test("renders pagination buttons and handles navigation", async () => {
    // Mock data for paginated results
    const mockFirstPage = {
      results: [{ id: 1, name: "Player 1", role: "Striker", team_name: "Team A" }],
      next: "https://api.example.com/players?page=2",
      previous: null,
    };
    const mockSecondPage = {
      results: [{ id: 2, name: "Player 2", role: "Defender", team_name: "Team B" }],
      next: null,
      previous: "https://api.example.com/players?page=1",
    };

    // Mock axios GET requests for pagination
    axios.get
      .mockResolvedValueOnce({ data: mockFirstPage }) // First page
      .mockResolvedValueOnce({ data: mockSecondPage }) // Second page
      .mockResolvedValueOnce({ data: mockFirstPage }); // Back to first page

    // Render the component
    await act(async () => {
      render(<PlayersAdmin />);
    });

    // Verify that the first page is displayed
    expect(screen.getByText("Player 1")).toBeInTheDocument();
    expect(screen.queryByText("Player 2")).not.toBeInTheDocument();

    // Simulate clicking the "Next" button
    const nextPageButton = screen.getByText(/next/i);
    fireEvent.click(nextPageButton);

    // Wait for the second page to load and verify
    await waitFor(() => {
      expect(screen.getByText("Player 2")).toBeInTheDocument();
      expect(screen.queryByText("Player 1")).not.toBeInTheDocument();
    });

    // Simulate clicking the "Previous" button
    const previousPageButton = screen.getByText(/previous/i);
    fireEvent.click(previousPageButton);

    // Wait for the first page to reload and verify
    await waitFor(() => {
      expect(screen.getByText("Player 1")).toBeInTheDocument();
      expect(screen.queryByText("Player 2")).not.toBeInTheDocument();
    });
  });
});
