import { useState } from "react";
import "./App.css";
import { ChromeRepository } from "./repository/chrome.repository";
import { ExperienceItemService } from "./service/experience-item.service";
import { MockChromeRepository } from "./repository/mock-chrome.repository";
import { experienceItemMapper } from "./helper/experience-item-mapper";
import { YearMonthInput } from "./component/YearMonthInput";
import { ExperienceItem } from "./domain/ExperienceItem";
import { BasicExperienceItem } from "./domain/BasicExperienceItem";
import { YearMonthPairInput } from "./component/YearMonthPairInput";
import { BasicExperienceItemInput } from "./component/BasicExperienceInput";

const ExperienceItemComponent = (props: {
  experienceItem: ExperienceItem;
  toggleIsUsed: () => void;
}) => {
  const item = props.experienceItem;
  return (
    <div>
      <input
        type="checkbox"
        checked={item.isUsed}
        onClick={props.toggleIsUsed}
      />
      <span>
        {item.start.year}/{item.start.month} ~ {item.end.year}/{item.end.month}:{" "}
        {item.added}개월
        {item.duplicate > 0 ? ` (${item.duplicate}개월 중복)` : ""}
        {item.company ? `(${item.company})` : ""}
      </span>
    </div>
  );
};

const ExperienceSummaryComponent = ({
  listOfExperienceItem,
}: {
  listOfExperienceItem: ExperienceItem[];
}) => {
  const sum = listOfExperienceItem
    .filter((item) => item.isUsed)
    .reduce((acc, cur) => acc + cur.added, 0);
  return (
    <h3>
      총합 경력: {Math.floor(sum / 12)}년 {sum % 12}개월
    </h3>
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

  return (
    <div className="App">
      <button onClick={getListOfExpItem}>Get From Span</button>
      <button onClick={getListOfMockExpItem}>Get From Mock</button>
      <button onClick={clearListOfExpItem}>Clear</button>

      <BasicExperienceItemInput
        onSubmit={(experienceItem) =>
          experienceItem &&
          setBasicExperienceItems([experienceItem, ...basicExperienceItems])
        }
      />

      <ExperienceSummaryComponent
        listOfExperienceItem={experienceItemMapper(basicExperienceItems)}
      />
      <p>----------------------</p>
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
