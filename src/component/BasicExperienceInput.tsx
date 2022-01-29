import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { v4 } from "uuid";
import { BasicExperienceItem } from "../domain/BasicExperienceItem";
import { YearMonth } from "../domain/YearMonth";
import { YearMonthPairInput } from "./YearMonthPairInput";

export const BasicExperienceItemInput = ({
  onSubmit,
  setErrorMessage,
}: {
  onSubmit: (v: BasicExperienceItem | null) => void;
  setErrorMessage: (msg: string) => void;
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
      setErrorMessage("시작일이 종료일보다 늦습니다.");
      return;
    }
    onSubmit({ ...state, uuid: v4(), isUsed: true });
    setState({ ...state, company: "" });
    setErrorMessage("");
  };
  return (
    <div style={{ display: "flex", padding: "10px" }}>
      <YearMonthPairInput
        onChange={(pair) => setState({ ...state, ...pair })}
      />
      <TextField
        size="small"
        label="회사명(선택)"
        variant="outlined"
        value={state.company}
        onChange={(e) => setState({ ...state, company: e.target.value })}
      />
      <Button
        variant="contained"
        onClick={checkValidAndSubmit}
        style={{ margin: "0 3px" }}
      >
        경력 추가
      </Button>
    </div>
  );
};
