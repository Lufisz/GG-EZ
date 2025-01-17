import React from "react";
import { render, screen } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import AdminPanel from "../../components/AdminPanel";

describe("AdminPanel Component", () => {
  test("renders the admin panel header and navigation options", () => {
    render(
      <Router history={createMemoryHistory()}>
        <AdminPanel />
      </Router>
    );

    // Check if the header is rendered
    expect(screen.getByText(/Admin Panel/i)).toBeInTheDocument();

    // Check if the navigation options are rendered
    expect(screen.getByText(/Matches/i)).toBeInTheDocument();
    expect(screen.getByText(/Events/i)).toBeInTheDocument();
    expect(screen.getByText(/Teams/i)).toBeInTheDocument();
    expect(screen.getByText(/Players/i)).toBeInTheDocument();
  });

  test("navigates to correct paths when navigation cards are clicked", () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <AdminPanel />
      </Router>
    );

    // Simulate clicking on Matches card
    userEvent.click(screen.getByText(/Matches/i));
    expect(history.location.pathname).toBe("/admin/matches");

    // Simulate clicking on Events card
    userEvent.click(screen.getByText(/Events/i));
    expect(history.location.pathname).toBe("/admin/events");

    // Simulate clicking on Teams card
    userEvent.click(screen.getByText(/Teams/i));
    expect(history.location.pathname).toBe("/admin/teams");

    // Simulate clicking on Players card
    userEvent.click(screen.getByText(/Players/i));
    expect(history.location.pathname).toBe("/admin/players");
  });
});
