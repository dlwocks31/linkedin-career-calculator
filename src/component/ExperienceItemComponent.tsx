import { Checkbox, Divider, Typography } from "@mui/material";
import { ExperienceItem } from "../domain/ExperienceItem";

export const ExperienceItemComponent = (props: {
  experienceItem: ExperienceItem;
  toggleIsUsed: () => void;
}) => {
  const item = props.experienceItem;
  const texts = [
    `${item.start.year}/${item.start.month}~${item.end.year}/${item.end.month}`,
    `${item.added}개월`,
  ];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "90%",
      }}
    >
      <Checkbox
        checked={item.isUsed}
        onClick={props.toggleIsUsed}
        size="small"
        style={{ padding: "3px", width: "5%" }}
      />
      <Typography variant="body1" style={{ width: "35%" }}>
        {texts.join(" - ")}
      </Typography>
      <Typography variant="body1" style={{ width: "40%" }}>
        {item.company}
      </Typography>
      {item.duplicate > 0 && (
        <Typography variant="body1" style={{ width: "15%" }}>
          {`${item.duplicate}개월 중복`}
        </Typography>
      )}
    </div>
  );
};
