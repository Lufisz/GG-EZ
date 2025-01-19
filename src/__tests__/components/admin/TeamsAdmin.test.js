import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import axios from "axios";
import TeamsAdmin from "../../../components/admin/TeamsAdmin";

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

describe("TeamsAdmin Component", () => {
  // Clear all mock implementations before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading spinner initially", async () => {
    // Simulate a pending API request
    axios.get.mockImplementationOnce(() => new Promise(() => {}));
    render(<TeamsAdmin />);

    // Verify if the loading spinner is displayed while fetching data
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test("fetches and displays teams", async () => {
    // Mock API response with a list of teams
    const mockTeams = {
      results: [
        { id: 1, name: "Team A", description: "Description A" },
        { id: 2, name: "Team B", description: "Description B" },
      ],
      next: null,
      previous: null,
    };

    // Mock axios GET request
    axios.get.mockResolvedValueOnce({ data: mockTeams });

    // Render the component and wait for the API call to complete
    await act(async () => {
      render(<TeamsAdmin />);
    });

    // Verify if teams are displayed in the table
    expect(screen.getByText("Team A")).toBeInTheDocument();
    expect(screen.getByText("Team B")).toBeInTheDocument();
  });

  test("shows error toast on failed fetch", async () => {
    // Silence console.error during this test to avoid noise in test output
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Mock a failed API request
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    // Render the component
    await act(async () => {
      render(<TeamsAdmin />);
    });

    // Verify if an error toast is displayed
    expect(screen.getByText(/failed to fetch teams/i)).toBeInTheDocument();

    // Restore original console.error behavior
    consoleErrorSpy.mockRestore();
  });

  test("filters teams based on search input", async () => {
    // Mock API response with a list of teams
    const mockTeams = {
      results: [
        { id: 1, name: "Team A", description: "Description A" },
        { id: 2, name: "Team B", description: "Description B" },
      ],
      next: null,
      previous: null,
    };

    // Mock axios GET request
    axios.get.mockResolvedValueOnce({ data: mockTeams });

    // Render the component
    await act(async () => {
      render(<TeamsAdmin />);
    });

    // Simulate typing in the search bar
    const searchBar = screen.getByPlaceholderText(/search by id or name/i);
    fireEvent.change(searchBar, { target: { value: "Team A" } });

    // Verify if only the matching team is displayed
    expect(screen.getByText("Team A")).toBeInTheDocument();
    expect(screen.queryByText("Team B")).not.toBeInTheDocument();
  });

  test("deletes a team when delete is confirmed", async () => {
    // Mock API response with a list of teams
    const mockTeams = {
      results: [
        { id: 1, name: "Team A", description: "Description A" },
      ],
      next: null,
      previous: null,
    };

    // Mock axios GET and DELETE requests
    axios.get.mockResolvedValueOnce({ data: mockTeams });
    axios.delete.mockResolvedValueOnce({});

    // Render the component
    await act(async () => {
      render(<TeamsAdmin />);
    });

    // Simulate clicking the delete button and confirming the action
    const deleteButton = screen.getByText(/delete/i);
    window.confirm = jest.fn(() => true); // Mock confirmation dialog
    fireEvent.click(deleteButton);

    // Verify if the team is removed from the list
    await waitFor(() => {
      expect(screen.queryByText("Team A")).not.toBeInTheDocument();
    });
  });

  test("cancels delete operation if confirmation is denied", async () => {
    // Mock API response with a list of teams
    const mockTeams = {
      results: [
        { id: 1, name: "Team A", description: "Description A" },
      ],
      next: null,
      previous: null,
    };

    // Mock axios GET request
    axios.get.mockResolvedValueOnce({ data: mockTeams });

    // Render the component
    await act(async () => {
      render(<TeamsAdmin />);
    });

    // Simulate clicking the delete button and denying the confirmation
    const deleteButton = screen.getByText(/delete/i);
    window.confirm = jest.fn(() => false); // Mock cancellation dialog
    fireEvent.click(deleteButton);

    // Verify that the team remains in the list
    expect(screen.getByText("Team A")).toBeInTheDocument();
  });

  test("shows the team form when adding a new team", async () => {
    // Mock API response with no teams
    axios.get.mockResolvedValueOnce({ data: { results: [], next: null, previous: null } });

    // Render the component
    await act(async () => {
      render(<TeamsAdmin />);
    });

    // Simulate clicking the "Add Team" button
    const addButton = screen.getByText(/add team/i);
    fireEvent.click(addButton);

    // Verify if the team form is displayed
    expect(screen.getByText(/add new team/i)).toBeInTheDocument();
  });

  test("renders pagination buttons and handles navigation", async () => {
    // Mock data for paginated results
    const mockFirstPage = {
      results: [{ id: 1, name: "Team A", description: "Description A" }],
      next: "https://api.example.com/teams?page=2",
      previous: null,
    };
    const mockSecondPage = {
      results: [{ id: 2, name: "Team B", description: "Description B" }],
      next: null,
      previous: "https://api.example.com/teams?page=1",
    };

    // Mock axios GET requests for pagination
    axios.get
      .mockResolvedValueOnce({ data: mockFirstPage }) // First page
      .mockResolvedValueOnce({ data: mockSecondPage }) // Second page
      .mockResolvedValueOnce({ data: mockFirstPage }); // Back to first page

    // Render the component
    await act(async () => {
      render(<TeamsAdmin />);
    });

    // Verify that the first page is displayed
    expect(screen.getByText("Team A")).toBeInTheDocument();
    expect(screen.queryByText("Team B")).not.toBeInTheDocument();

    // Simulate clicking the "Next" button
    const nextPageButton = screen.getByText(/next/i);
    fireEvent.click(nextPageButton);

    // Wait for the second page to load and verify
    await waitFor(() => {
      expect(screen.getByText("Team B")).toBeInTheDocument();
      expect(screen.queryByText("Team A")).not.toBeInTheDocument();
    });

    // Simulate clicking the "Previous" button
    const previousPageButton = screen.getByText(/previous/i);
    fireEvent.click(previousPageButton);

    // Wait for the first page to reload and verify
    await waitFor(() => {
      expect(screen.getByText("Team A")).toBeInTheDocument();
      expect(screen.queryByText("Team B")).not.toBeInTheDocument();
    });
  });
});
