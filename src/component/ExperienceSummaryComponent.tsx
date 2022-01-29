import { Typography } from "@mui/material";
import { ExperienceItem } from "../domain/ExperienceItem";

export const ExperienceSummaryComponent = ({
  listOfExperienceItem,
}: {
  listOfExperienceItem: ExperienceItem[];
}) => {
  const sum = listOfExperienceItem
    .filter((item) => item.isUsed)
    .reduce((acc, cur) => acc + cur.added, 0);
  return (
    <Typography variant="h4" style={{ margin: "5px" }}>
      총합 경력: {Math.floor(sum / 12)}년 {sum % 12}개월
    </Typography>
  );
};
