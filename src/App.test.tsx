import { render, screen } from "@testing-library/react";
import App from "./App";

test("링크드인 페이지에서 가져오기 버튼이 노출된다.", () => {
  render(<App />);
  const linkElement = screen.getByText(/링크드인 페이지에서 가져오기/i);
  expect(linkElement).toBeInTheDocument();
});
