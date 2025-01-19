import React from "react";
import { render, screen } from "@testing-library/react";
import PrivacyPolicy from "../../../pages/legal/PrivacyPolicy";

describe("PrivacyPolicy Component", () => {
  // Test to ensure the main heading is rendered
  test("renders the main heading", () => {
    render(<PrivacyPolicy />);
    expect(
      screen.getByRole("heading", { name: /privacy policy/i })
    ).toBeInTheDocument(); // Check for the presence of the heading
  });

  // Test to ensure the introductory text is displayed
  test("renders the introductory text", () => {
    render(<PrivacyPolicy />);
    expect(
      screen.getByText(/your privacy is important to us/i)
    ).toBeInTheDocument(); // Verify the introductory text is present
  });

  // Test to ensure the "Information We Collect" section and its details are displayed
  test("renders the 'Information We Collect' section with details", () => {
    render(<PrivacyPolicy />);
    expect(
      screen.getByRole("heading", { name: /information we collect/i })
    ).toBeInTheDocument(); // Check the section heading
    expect(
      screen.getByText(/personal details \(e.g., name, email address\)/i)
    ).toBeInTheDocument(); // Verify the presence of the first list item
    expect(screen.getByText(/usage data to improve our platform/i)).toBeInTheDocument(); // Verify the second list item
  });

  // Test to ensure the "How We Use Your Information" section and its details are displayed
  test("renders the 'How We Use Your Information' section with details", () => {
    render(<PrivacyPolicy />);
    expect(
      screen.getByRole("heading", { name: /how we use your information/i })
    ).toBeInTheDocument(); // Check the section heading
    expect(screen.getByText(/provide and improve our services/i)).toBeInTheDocument(); // Verify the first list item
    expect(screen.getByText(/communicate updates and offers/i)).toBeInTheDocument(); // Verify the second list item
    expect(
      screen.getByText(/ensure a secure experience on our platform/i)
    ).toBeInTheDocument(); // Verify the third list item
  });

  // Test to ensure the "Your Rights" section and its details are displayed
  test("renders the 'Your Rights' section with details", () => {
    render(<PrivacyPolicy />);
    expect(screen.getByRole("heading", { name: /your rights/i })).toBeInTheDocument(); // Check the section heading
    expect(
      screen.getByText(/access, update, or delete your personal data/i)
    ).toBeInTheDocument(); // Verify the first list item
    expect(
      screen.getByText(/withdraw consent for certain data processing/i)
    ).toBeInTheDocument(); // Verify the second list item
    expect(
      screen.getByText(/contact us with any privacy-related concerns/i)
    ).toBeInTheDocument(); // Verify the third list item
  });

  // Test to ensure the contact email is displayed
  test("renders the contact email", () => {
    render(<PrivacyPolicy />);
    expect(
      screen.getByText(/privacy@not-real-email\.com/i)
    ).toBeInTheDocument(); // Verify the presence of the contact email
  });
});
