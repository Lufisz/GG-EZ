import React from "react";
import { render, screen } from "@testing-library/react";
import ContactUs from "../../../pages/legal/ContactUs";

describe("ContactUs Component", () => {
  // Test to verify that the component renders correctly
  test("renders the Contact Us component", () => {
    render(<ContactUs />);

    // Check for the heading
    expect(screen.getByRole("heading", { name: /contact us/i })).toBeInTheDocument();

    // Check for the descriptive text
    expect(
      screen.getByText(/we'd love to hear from you! here's how you can get in touch with us:/i)
    ).toBeInTheDocument();

    // Check for contact details
    expect(screen.getByText(/support@not-real-email.com/i)).toBeInTheDocument();
    expect(screen.getByText(/\+123 456 7890/i)).toBeInTheDocument();
    expect(screen.getByText(/123 gg-ez lane, esports city/i)).toBeInTheDocument();

    // Check for the closing text
    expect(
      screen.getByText(/for any queries or feedback, don't hesitate to reach out. we're here to help!/i)
    ).toBeInTheDocument();
  });

  // Test to verify the static content
  test("renders the correct contact information", () => {
    render(<ContactUs />);

    // Verify email address
    const emailElement = screen.getByText(/support@not-real-email.com/i);
    expect(emailElement).toBeInTheDocument();

    // Verify phone number
    const phoneElement = screen.getByText(/\+123 456 7890/i);
    expect(phoneElement).toBeInTheDocument();

    // Verify address
    const addressElement = screen.getByText(/123 gg-ez lane, esports city/i);
    expect(addressElement).toBeInTheDocument();
  });
});
