import React from "react";
import { render, fireEvent } from "@testing-library/react";
import useClickOutsideToggle from "../../hooks/useClickOutsideToggle";

// Helper component to test the hook
const TestComponent = () => {
  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  return (
    <div>
      <div data-testid="inside" ref={ref}>
        Inside Element
      </div>
      <button data-testid="toggle" onClick={() => setExpanded((prev) => !prev)}>
        Toggle
      </button>
      {expanded && <div data-testid="expanded">Expanded Content</div>}
    </div>
  );
};

describe("useClickOutsideToggle", () => {
  test("toggles expanded state on outside click", () => {
    const { getByTestId, queryByTestId } = render(<TestComponent />);

    const insideElement = getByTestId("inside");
    const toggleButton = getByTestId("toggle");

    // Toggle expanded state to true
    fireEvent.click(toggleButton);
    expect(queryByTestId("expanded")).toBeInTheDocument();

    // Simulate click outside the inside element
    fireEvent.mouseUp(document.body);
    expect(queryByTestId("expanded")).not.toBeInTheDocument();

    // Ensure state remains false after outside click
    fireEvent.mouseUp(document.body);
    expect(queryByTestId("expanded")).not.toBeInTheDocument();
  });

  test("does not toggle expanded state on inside click", () => {
    const { getByTestId, queryByTestId } = render(<TestComponent />);

    const insideElement = getByTestId("inside");
    const toggleButton = getByTestId("toggle");

    // Toggle expanded state to true
    fireEvent.click(toggleButton);
    expect(queryByTestId("expanded")).toBeInTheDocument();

    // Simulate click inside the referenced element
    fireEvent.mouseUp(insideElement);
    expect(queryByTestId("expanded")).toBeInTheDocument();
  });
});
