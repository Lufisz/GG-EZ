import React from "react";
import { render, screen } from "@testing-library/react";
import TermsOfService from "../../../pages/legal/TermsOfService";

describe("TermsOfService Component", () => {
  // Test to ensure the main heading is rendered
  test("renders the main heading", () => {
    render(<TermsOfService />);
    expect(
      screen.getByRole("heading", { name: /terms of service/i })
    ).toBeInTheDocument(); // Check for the presence of the main heading
  });

  // Test to ensure the introductory text is displayed
  test("renders the introductory text", () => {
    render(<TermsOfService />);
    expect(
      screen.getByText(/these terms govern your use of our platform/i)
    ).toBeInTheDocument(); // Verify the introductory paragraph is displayed
  });

  // Test to ensure the "Account Registration" section is displayed
  test("renders the 'Account Registration' section with details", () => {
    render(<TermsOfService />);
    expect(
      screen.getByRole("heading", { name: /account registration/i })
    ).toBeInTheDocument(); // Check the section heading
    expect(
      screen.getByText(/you must provide accurate information when creating an account/i)
    ).toBeInTheDocument(); // Verify the content of the section
  });

  // Test to ensure the "Acceptable Use" section and its list items are displayed
  test("renders the 'Acceptable Use' section with list items", () => {
    render(<TermsOfService />);
    expect(
      screen.getByRole("heading", { name: /acceptable use/i })
    ).toBeInTheDocument(); // Check the section heading
    expect(
      screen.getByText(/respect other users and avoid abusive behavior/i)
    ).toBeInTheDocument(); // Verify the first list item
    expect(
      screen.getByText(/refrain from sharing illegal or harmful content/i)
    ).toBeInTheDocument(); // Verify the second list item
    expect(
      screen.getByText(/use gg-ez services only for lawful purposes/i)
    ).toBeInTheDocument(); // Verify the third list item
  });

  // Test to ensure the "Intellectual Property" section is displayed
  test("renders the 'Intellectual Property' section", () => {
    render(<TermsOfService />);
    expect(
      screen.getByRole("heading", { name: /intellectual property/i })
    ).toBeInTheDocument(); // Check the section heading
    expect(
      screen.getByText(/all content on gg-ez is protected by intellectual property laws/i)
    ).toBeInTheDocument(); // Verify the content of the section
  });

  // Test to ensure the "Limitation of Liability" section is displayed
  test("renders the 'Limitation of Liability' section", () => {
    render(<TermsOfService />);
    expect(
      screen.getByRole("heading", { name: /limitation of liability/i })
    ).toBeInTheDocument(); // Check the section heading
    expect(
      screen.getByText(/we are not liable for any losses or damages/i)
    ).toBeInTheDocument(); // Verify the content of the section
  });

  // Test to ensure the "Changes to Terms" section is displayed
  test("renders the 'Changes to Terms' section", () => {
    render(<TermsOfService />);
    expect(
      screen.getByRole("heading", { name: /changes to terms/i })
    ).toBeInTheDocument(); // Check the section heading
    expect(
      screen.getByText(/we may update these terms from time to time/i)
    ).toBeInTheDocument(); // Verify the content of the section
  });

  // Test to ensure the contact email is displayed
  test("renders the contact email", () => {
    render(<TermsOfService />);
    expect(
      screen.getByText(/support@not-real-email\.com/i)
    ).toBeInTheDocument(); // Verify the contact email is displayed
  });
});
