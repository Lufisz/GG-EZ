import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { BrowserRouter, useParams, useHistory } from "react-router-dom";
import axios from "axios";
import EventDetailPage from "../../pages/EventDetailPage";

// Mock dependencies
jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useHistory: jest.fn(),
}));

describe("EventDetailPage Component", () => {
  const mockPush = jest.fn();
  let consoleErrorMock;

  beforeEach(() => {
    // Clear all mock calls and reset states
    jest.clearAllMocks();
    useParams.mockReturnValue({ id: "1" }); // Mock the route parameter `id`
    useHistory.mockReturnValue({ push: mockPush }); // Mock the history `push` method
    consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console.error during tests
  });

  afterEach(() => {
    consoleErrorMock.mockRestore(); // Restore original console.error after tests
  });

  const renderComponent = async () => {
    // Use `act` to wrap rendering to handle asynchronous updates
    await act(async () => {
      render(
        <BrowserRouter>
          <EventDetailPage />
        </BrowserRouter>
      );
    });
  };

  test("renders a loading message while fetching data", async () => {
    // Ensure axios.get resolves after rendering
    axios.get.mockResolvedValueOnce({ data: null });

    renderComponent();
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test("displays event details when data is fetched successfully", async () => {
    // Mock the API response with successful data
    axios.get.mockResolvedValueOnce({
      data: {
        name: "Sample Event",
        description: "This is a sample event.",
        image: "/sample-event.jpg",
        start_date: "2025-01-01",
        end_date: "2025-01-02",
      },
    });

    await renderComponent();

    // Wait for the event details to appear in the DOM
    await waitFor(() => {
      expect(screen.getByText("Sample Event")).toBeInTheDocument();
      expect(screen.getByText("This is a sample event.")).toBeInTheDocument();
      expect(screen.getByAltText("Sample Event")).toBeInTheDocument();
      expect(screen.getByText("2025-01-01 - 2025-01-02")).toBeInTheDocument();
    });
  });

  test("displays an error message if the event is not found", async () => {
    // Mock the API response with no data (event not found)
    axios.get.mockResolvedValueOnce({ data: null });

    await renderComponent();

    // Wait for the error message to appear in the DOM
    await waitFor(() => {
      expect(screen.getByText(/event not found/i)).toBeInTheDocument();
    });
  });

  test("handles API error gracefully", async () => {
    // Mock the API to throw an error
    axios.get.mockRejectedValueOnce(new Error("Network error"));

    await renderComponent();

    // Verify that the "Event not found" message is displayed
    await waitFor(() => {
      expect(screen.getByText(/event not found/i)).toBeInTheDocument();
    });

    // Verify the error was logged
    expect(consoleErrorMock).toHaveBeenCalledWith("Error fetching event:", "Network error");
  });

  test("navigates back to events list when 'Back to Events' button is clicked", async () => {
    // Mock the API response with successful data
    axios.get.mockResolvedValueOnce({
      data: {
        name: "Sample Event",
        description: "This is a sample event.",
        image: "/sample-event.jpg",
        start_date: "2025-01-01",
        end_date: "2025-01-02",
      },
    });

    await renderComponent();

    // Wait for the event details to appear in the DOM
    await waitFor(() => {
      expect(screen.getByText("Sample Event")).toBeInTheDocument();
    });

    // Simulate clicking the "Back to Events" button
    fireEvent.click(screen.getByRole("button", { name: /back to events/i }));

    // Verify that `history.push` was called with the correct path
    expect(mockPush).toHaveBeenCalledWith("/events");
  });
});
