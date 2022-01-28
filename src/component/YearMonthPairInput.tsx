import { useState } from "react";
import { YearMonth } from "../domain/YearMonth";
import { YearMonthInput } from "./YearMonthInput";

export const YearMonthPairInput = ({
  onChange,
}: {
  onChange: (value: { start: YearMonth; end: YearMonth }) => void;
}) => {
  const [state, setRawState] = useState<{ start: YearMonth; end: YearMonth }>({
    start: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
    end: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
  });
  const setState = (value: { start: YearMonth; end: YearMonth }) => {
    setRawState(value);
    onChange(value);
  };
  return (
    <div>
      <YearMonthInput onChange={(start) => setState({ ...state, start })} />
      ~
      <YearMonthInput onChange={(end) => setState({ ...state, end })} />
    </div>
  );
};
