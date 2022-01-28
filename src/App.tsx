import { useState } from "react";
import "./App.css";
import { ChromeRepository } from "./repository/chrome.repository";
import { ExperienceItemService } from "./service/experience-item.service";
import { MockChromeRepository } from "./repository/mock-chrome.repository";
import { experienceItemMapper } from "./helper/experience-item-mapper";
import { ExperienceItem } from "./domain/ExperienceItem";
import { BasicExperienceItem } from "./domain/BasicExperienceItem";
import { BasicExperienceItemInput } from "./component/BasicExperienceInput";
import { Button, Divider, Typography } from "@mui/material";
import { ExperienceItemComponent } from "./component/ExperienceItemComponent";

const ExperienceSummaryComponent = ({
  listOfExperienceItem,
}: {
  listOfExperienceItem: ExperienceItem[];
}) => {
  const sum = listOfExperienceItem
    .filter((item) => item.isUsed)
    .reduce((acc, cur) => acc + cur.added, 0);
  return (
    <Typography variant="h3">
      총합 경력: {Math.floor(sum / 12)}년 {sum % 12}개월
    </Typography>
  );
};
const App = () => {
  const [basicExperienceItems, setBasicExperienceItems] = useState<
    BasicExperienceItem[]
  >([]);

  function handleToggleIsUsed(uuid: string) {
    const newList = basicExperienceItems.map((item) => {
      if (item.uuid === uuid) {
        item.isUsed = !item.isUsed;
      }
      return item;
    });
    setBasicExperienceItems(newList);
  }

  const getListOfExpItem = async () => {
    const service = new ExperienceItemService(new ChromeRepository());
    setBasicExperienceItems(await service.getExperienceItems());
  };

  const getListOfMockExpItem = async () => {
    const service = new ExperienceItemService(new MockChromeRepository());
    setBasicExperienceItems(await service.getExperienceItems());
  };

  const clearListOfExpItem = () => setBasicExperienceItems([]);
  const isTesting = false;
  return (
    <div className="App">
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Button
          variant="contained"
          onClick={getListOfExpItem}
          style={{ marginRight: "20px" }}
        >
          링크드인 페이지에서 가져오기
        </Button>
        {isTesting && (
          <Button variant="contained" onClick={getListOfMockExpItem}>
            Get From Mock
          </Button>
        )}
        <Button variant="contained" color="error" onClick={clearListOfExpItem}>
          초기화
        </Button>
      </div>

      <BasicExperienceItemInput
        onSubmit={(experienceItem) =>
          experienceItem &&
          setBasicExperienceItems([experienceItem, ...basicExperienceItems])
        }
      />

      <ExperienceSummaryComponent
        listOfExperienceItem={experienceItemMapper(basicExperienceItems)}
      />
      <Divider style={{ width: "100%", padding: "5px" }} />
      {experienceItemMapper(basicExperienceItems).map((item) => (
        <ExperienceItemComponent
          experienceItem={item}
          toggleIsUsed={() => handleToggleIsUsed(item.uuid)}
        />
      ))}
    </div>
  );
};

export default App;
