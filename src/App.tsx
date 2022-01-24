import { useState } from "react";
import "./App.css";
import { ChromeRepository } from "./repository/chrome.repository";
import { ExperienceItemService } from "./service/experience-item.service";
import { MockChromeRepository } from "./repository/mock-chrome.repository";
import { ExperienceItem } from "./service/experience-item.interface";

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
        {item.prevText ? `(${item.prevText})` : ""}
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
  const [listOfExperienceItem, setListOfExperienceItem] = useState<
    ExperienceItem[]
  >([]);

  function handleToggleIsUsed(uuid: string) {
    const newList = listOfExperienceItem.map((item) => {
      if (item.uuid === uuid) {
        item.isUsed = !item.isUsed;
      }
      return item;
    });
    setListOfExperienceItem(newList);
  }

  const getListOfExpItem = async () => {
    const service = new ExperienceItemService(new ChromeRepository());
    setListOfExperienceItem(await service.getExperienceItems());
  };

  const getListOfMockExpItem = async () => {
    const service = new ExperienceItemService(new MockChromeRepository());
    setListOfExperienceItem(await service.getExperienceItems());
  };

  return (
    <div className="App">
      <button onClick={getListOfExpItem}>Get From Span</button>
      <button onClick={getListOfMockExpItem}>Get From Mock</button>
      <ExperienceSummaryComponent listOfExperienceItem={listOfExperienceItem} />
      <p>----------------------</p>
      {listOfExperienceItem.map((item) => (
        <ExperienceItemComponent
          experienceItem={item}
          toggleIsUsed={() => handleToggleIsUsed(item.uuid)}
        />
      ))}
    </div>
  );
};

export default App;
