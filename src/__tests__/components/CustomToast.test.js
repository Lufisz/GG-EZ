import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CustomToast from "../../components/CustomToast";

describe("CustomToast Component", () => {
  test("renders the toast with a message and shows it", () => {
    render(
      <CustomToast
        show={true}
        onClose={jest.fn()}
        message="Test Message"
        type="success"
      />
    );

    expect(screen.getByText(/test message/i)).toBeInTheDocument();
  });

  test("does not render the toast when show is false", () => {
    render(
      <CustomToast
        show={false}
        onClose={jest.fn()}
        message="Hidden Message"
      />
    );

    expect(screen.queryByText(/hidden message/i)).not.toBeInTheDocument();
  });

  test("displays the username with the correct color", () => {
    render(
      <CustomToast
        show={true}
        onClose={jest.fn()}
        message="Hello"
        username="User123"
        usernameColor="#ff0000"
      />
    );

    const username = screen.getByText(/user123/i);
    expect(username).toBeInTheDocument();
    expect(username).toHaveStyle("color: #ff0000");
  });

  test("calls the onClose handler when the toast hides automatically", async () => {
    const onCloseMock = jest.fn();
    render(
      <CustomToast
        show={true}
        onClose={onCloseMock}
        message="Close Test"
      />
    );
  
    // Wait for the toast to autohide
    await waitFor(
      () => {
        expect(onCloseMock).toHaveBeenCalledTimes(1);
      },
      { timeout: 2000 }
    );
  });

  test("applies success styles when type is success", () => {
    render(
      <CustomToast
        show={true}
        onClose={jest.fn()}
        message="Success Test"
        type="success"
      />
    );

    const toast = screen.getByRole("alert");
    expect(toast).toHaveStyle("background-color: #1a1a1a; color: #00ff99");
  });

  test("applies error styles when type is error", () => {
    render(
      <CustomToast
        show={true}
        onClose={jest.fn()}
        message="Error Test"
        type="error"
      />
    );

    const toast = screen.getByRole("alert");
    expect(toast).toHaveStyle("background-color: #1a1a1a; color: #ff4d4d");
  });
});
