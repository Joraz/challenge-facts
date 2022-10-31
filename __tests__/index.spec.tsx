import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import Home from "../pages";

describe("Index page", () => {
  beforeEach(() => {
    render(<Home />);
  });

  it("should set the initial value of the expression", () => {
    expect(screen.getByTestId("expression-input")).toHaveValue(`{
  "expression": {"fn": "*", "a": "sales", "b": 2},
  "security": "ABC"
}`);
  });

  it("should set the expression when an example button is clicked", () => {
    fireEvent.click(screen.getByTestId("button-divide"));

    expect(screen.getByTestId("expression-input")).toHaveValue(`{
  "expression": {"fn": "/", "a": "price", "b": "eps"},
  "security": "BCD"
}`);
  });

  it("should show message on click of run button when invalid dsl is entered", () => {
    fireEvent.click(screen.getByTestId("button-invalid-json"));
    fireEvent.click(screen.getByTestId("run-button"));

    expect(screen.getByTestId("error-banner")).toHaveTextContent(
      "There is a problem with your DSL query",
    );
  });
  it("should show message on click of run button when valid dsl is entered", () => {
    fireEvent.click(screen.getByTestId("button-divide"));
    fireEvent.click(screen.getByTestId("run-button"));

    expect(screen.getByTestId("success-banner")).toHaveTextContent(
      "DSL query ran successfully!",
    );
  });

  // TODO: Complete this test suite once implementation is complete
  xit('should evaluate the expression when the "run" button is clicked', () => {
    fireEvent.click(screen.getByTestId("run-button"));

    fail("Implement me!");
  });
});
