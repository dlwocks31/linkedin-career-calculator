import { ChangeEvent, FormEvent, FormEventHandler, useState } from "react";

import _ from "lodash";
import { YearMonth } from "../domain/YearMonth";
import { FormLabel, InputLabel, MenuItem, Select } from "@mui/material";

export const YearMonthInput = ({
  onChange,
}: {
  onChange: (value: YearMonth) => void;
}) => {
  // input을 controlled component로 만들어야 함. https://reactjs.org/docs/forms.html#controlled-components
  const [state, setRawState] = useState<YearMonth>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const setState = (value: YearMonth) => {
    setRawState(value);
    onChange(value);
  };
  return (
    <span>
      <Select
        size="small"
        onChange={(e) => setState({ ...state, year: Number(e.target.value) })}
        value={state.year}
      >
        {_.range(new Date().getFullYear(), 1959, -1).map((year) => {
          return (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          );
        })}
      </Select>
      <FormLabel style={{ padding: "3px" }}>년</FormLabel>
      <Select
        size="small"
        onChange={(e) => setState({ ...state, month: Number(e.target.value) })}
        value={state.month}
      >
        {_.range(1, 13).map((month) => {
          return (
            <MenuItem key={month} value={month}>
              {month}
            </MenuItem>
          );
        })}
      </Select>
      <FormLabel style={{ padding: "3px" }}>월</FormLabel>
    </span>
  );
};
