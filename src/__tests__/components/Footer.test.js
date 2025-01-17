import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "../../components/Footer";

describe("Footer Component", () => {
  test("renders the footer with copyright information", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const currentYear = new Date().getFullYear();
    const copyrightText = `© ${currentYear} GG-EZ. All rights reserved.`;

    expect(screen.getByText(copyrightText)).toBeInTheDocument();
  });

  test("renders privacy policy link", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const privacyLink = screen.getByText("Privacy Policy");
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute("href", "/privacy-policy");
  });

  test("renders terms of service link", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const termsLink = screen.getByText("Terms of Service");
    expect(termsLink).toBeInTheDocument();
    expect(termsLink).toHaveAttribute("href", "/terms-of-service");
  });

  test("renders contact us link", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const contactLink = screen.getByText("Contact Us");
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute("href", "/contact-us");
  });
});
