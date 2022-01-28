import { useState } from "react";
import { v4 } from "uuid";
import { BasicExperienceItem } from "../domain/BasicExperienceItem";
import { YearMonth } from "../domain/YearMonth";
import { YearMonthPairInput } from "./YearMonthPairInput";

export const BasicExperienceItemInput = ({
  onSubmit,
}: {
  onSubmit: (v: BasicExperienceItem | null) => void;
}) => {
  const [state, setState] = useState<{
    start: YearMonth;
    end: YearMonth;
    company: string;
  }>({
    start: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
    end: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
    company: "",
  });
  const checkValidAndSubmit = () => {
    const { start, end } = state;
    if (
      start.year > end.year ||
      (start.year === end.year && start.month > end.month)
    ) {
      alert("시작일이 종료일보다 늦습니다.");
      return;
    }
    onSubmit({ ...state, uuid: v4(), isUsed: true });
    setState({ ...state, company: "" });
  };
  return (
    <div style={{ display: "flex" }}>
      <YearMonthPairInput
        onChange={(pair) => setState({ ...state, ...pair })}
        
      />
      <input
        type="text"
        value={state.company}
        onChange={(e) => setState({ ...state, company: e.target.value })}
        placeholder="회사명 입력(선택)"
      />
      <button onClick={checkValidAndSubmit}>제출</button>
    </div>
  );
};
