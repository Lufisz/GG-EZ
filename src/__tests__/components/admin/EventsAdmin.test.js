import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import axios from "axios";
import EventsAdmin from "../../../components/admin/EventsAdmin";

// Mocking axios to intercept API calls during tests
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

describe("EventsAdmin Component", () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading spinner initially", async () => {
    // Simulate a pending API request
    axios.get.mockImplementationOnce(() => new Promise(() => {}));
    render(<EventsAdmin />);

    // Check if the loading spinner is displayed
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test("fetches and displays events", async () => {
    // Mock data for events
    const mockEvents = {
      results: [
        { id: 1, name: "Event 1", start_date: "2025-01-01", end_date: "2025-01-02" },
        { id: 2, name: "Event 2", start_date: "2025-01-03", end_date: "2025-01-04" },
      ],
      next: null,
      previous: null,
    };

    // Mock API response
    axios.get.mockResolvedValueOnce({ data: mockEvents });

    // Render the component and wait for events to load
    await act(async () => {
      render(<EventsAdmin />);
    });

    // Verify if the events are displayed
    expect(screen.getByText("Event 1")).toBeInTheDocument();
    expect(screen.getByText("Event 2")).toBeInTheDocument();
  });

  test("shows error toast on failed fetch", async () => {
    // Silence console.error output during this test
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Simulate a failed API request
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    // Render the component
    await act(async () => {
      render(<EventsAdmin />);
    });

    // Verify if the error toast is shown
    expect(screen.getByText(/failed to fetch events/i)).toBeInTheDocument();

    // Restore original console.error behavior
    consoleErrorSpy.mockRestore();
  });

  test("filters events based on search input", async () => {
    // Mock data for events
    const mockEvents = {
      results: [
        { id: 1, name: "Event 1", start_date: "2025-01-01", end_date: "2025-01-02" },
        { id: 2, name: "Event 2", start_date: "2025-01-03", end_date: "2025-01-04" },
      ],
      next: null,
      previous: null,
    };

    // Mock API response
    axios.get.mockResolvedValueOnce({ data: mockEvents });

    // Render the component
    await act(async () => {
      render(<EventsAdmin />);
    });

    // Search for "Event 1"
    const searchBar = screen.getByPlaceholderText(/search by id or name/i);
    fireEvent.change(searchBar, { target: { value: "Event 1" } });

    // Verify filtering behavior
    expect(screen.getByText("Event 1")).toBeInTheDocument();
    expect(screen.queryByText("Event 2")).not.toBeInTheDocument();
  });

  test("deletes an event when delete is confirmed", async () => {
    // Mock data for events
    const mockEvents = {
      results: [
        { id: 1, name: "Event 1", start_date: "2025-01-01", end_date: "2025-01-02" },
      ],
      next: null,
      previous: null,
    };

    // Mock API responses for fetching and deleting events
    axios.get.mockResolvedValueOnce({ data: mockEvents });
    axios.delete.mockResolvedValueOnce({});

    // Render the component
    await act(async () => {
      render(<EventsAdmin />);
    });

    // Simulate clicking the delete button and confirming the action
    const deleteButton = screen.getByText(/delete/i);
    window.confirm = jest.fn(() => true);
    fireEvent.click(deleteButton);

    // Verify if the event is removed
    await waitFor(() => {
      expect(screen.queryByText("Event 1")).not.toBeInTheDocument();
    });
  });

  test("cancels delete operation if confirmation is denied", async () => {
    // Mock data for events
    const mockEvents = {
      results: [
        { id: 1, name: "Event 1", start_date: "2025-01-01", end_date: "2025-01-02" },
      ],
      next: null,
      previous: null,
    };

    // Mock API response
    axios.get.mockResolvedValueOnce({ data: mockEvents });

    // Render the component
    await act(async () => {
      render(<EventsAdmin />);
    });

    // Simulate clicking the delete button and canceling the confirmation
    const deleteButton = screen.getByText(/delete/i);
    window.confirm = jest.fn(() => false);
    fireEvent.click(deleteButton);

    // Verify that the event is not removed
    expect(screen.getByText("Event 1")).toBeInTheDocument();
  });

  test("shows the event form when adding a new event", async () => {
    // Mock API response with no events
    axios.get.mockResolvedValueOnce({ data: { results: [], next: null, previous: null } });

    // Render the component
    await act(async () => {
      render(<EventsAdmin />);
    });

    // Simulate clicking the "Add Event" button
    const addButton = screen.getByText(/add event/i);
    fireEvent.click(addButton);

    // Verify if the event form is displayed
    expect(screen.getByText(/add new event/i)).toBeInTheDocument();
  });

  test("renders pagination buttons and handles page navigation", async () => {
    // Mock data for the first and second pages
    const mockFirstPage = {
      results: [{ id: 1, name: "Event 1", start_date: "2025-01-01", end_date: "2025-01-02" }],
      next: "https://api.example.com/events?page=2",
      previous: null,
    };
    const mockSecondPage = {
      results: [{ id: 2, name: "Event 2", start_date: "2025-01-03", end_date: "2025-01-04" }],
      next: null,
      previous: "https://api.example.com/events?page=1",
    };

    // Mock API responses for pagination
    axios.get
      .mockResolvedValueOnce({ data: mockFirstPage }) // First page
      .mockResolvedValueOnce({ data: mockSecondPage }) // Second page
      .mockResolvedValueOnce({ data: mockFirstPage }); // Back to first page

    // Render the component
    await act(async () => {
      render(<EventsAdmin />);
    });

    // Verify that the first page is displayed
    expect(screen.getByText("Event 1")).toBeInTheDocument();
    expect(screen.queryByText("Event 2")).not.toBeInTheDocument();

    // Simulate clicking the "Next" button
    const nextPageButton = screen.getByText(/next/i);
    fireEvent.click(nextPageButton);

    // Wait for the second page to load
    await waitFor(() => {
      expect(screen.getByText("Event 2")).toBeInTheDocument();
      expect(screen.queryByText("Event 1")).not.toBeInTheDocument();
    });

    // Simulate clicking the "Previous" button
    const previousPageButton = screen.getByText(/previous/i);
    fireEvent.click(previousPageButton);

    // Wait for the first page to reload
    await waitFor(() => {
      expect(screen.getByText("Event 1")).toBeInTheDocument();
      expect(screen.queryByText("Event 2")).not.toBeInTheDocument();
    });
  });
});
