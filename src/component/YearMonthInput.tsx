import { ChangeEvent, FormEvent, FormEventHandler, useState } from "react";
import { YearMonth } from "../service/experience-item.interface";
import _ from "lodash";

export const YearMonthInput = ({
  onChange,
}: {
  onChange: (value: YearMonth) => void;
}) => {
  // input을 controlled component로 만들어야 함. https://reactjs.org/docs/forms.html#controlled-components
  const [state, setState] = useState<YearMonth>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  return (
    <span>
      <select
        onChange={(e) => setState({ ...state, year: Number(e.target.value) })}
        value={state.year}
      >
        {_.range(new Date().getFullYear(), 1959, -1).map((year) => {
          return <option value={year}>{year}</option>;
        })}
      </select>
      년
      <select
        onChange={(e) => setState({ ...state, month: Number(e.target.value) })}
        value={state.month}
      >
        {_.range(1, 13).map((month) => {
          return <option value={month}>{month}</option>;
        })}
      </select>
      월
    </span>
  );
};
