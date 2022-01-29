import { Button } from "@mui/material";
import { BasicExperienceItem } from "../domain/BasicExperienceItem";
import { ChromeRepository } from "../repository/chrome.repository";
import { MockChromeRepository } from "../repository/mock-chrome.repository";
import { ExperienceItemService } from "../service/experience-item.service";

export const ExperienceItemSetter = ({
  setBasicExperienceItems,
}: {
  setBasicExperienceItems: (items: BasicExperienceItem[]) => void;
}) => {
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
  );
};
