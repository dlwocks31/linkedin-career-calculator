import { useState } from "react";
import "./App.css";
import { experienceItemMapper } from "./helper/experience-item-mapper";
import { BasicExperienceItem } from "./domain/BasicExperienceItem";
import { BasicExperienceItemInput } from "./component/BasicExperienceInput";
import { AlertColor, Divider } from "@mui/material";

import { ExperienceItemComponent } from "./component/ExperienceItemComponent";
import { ExperienceItemSetter } from "./component/ExperienceItemSetter";
import { ExperienceSummaryComponent } from "./component/ExperienceSummaryComponent";
import { CollaspingAlert } from "./component/CollaspingAlert";
import { AlertMessage } from "./domain/AlertMessage";

const App = () => {
  const [basicExperienceItems, setBasicExperienceItems] = useState<
    BasicExperienceItem[]
  >([]);

  const [alertMessage, setAlertMessage] = useState<AlertMessage>({
    message: "",
    severity: "info",
  });
  function handleToggleIsUsed(uuid: string) {
    const newList = basicExperienceItems.map((item) => {
      if (item.uuid === uuid) {
        item.isUsed = !item.isUsed;
      }
      return item;
    });
    setBasicExperienceItems(newList);
  }
  const clearAlertMessage = () =>
    setAlertMessage({ ...alertMessage, message: "" });

  const setAlertMessageOrClear = (message: string, severity: AlertColor) =>
    message ? setAlertMessage({ message, severity }) : clearAlertMessage();
  return (
    <div className="App">
      <CollaspingAlert
        alertMessage={alertMessage}
        setAlertMessage={setAlertMessage}
      />

      <ExperienceItemSetter
        setBasicExperienceItems={setBasicExperienceItems}
        setWarningMessage={(message) =>
          setAlertMessageOrClear(message, "warning")
        }
      />
      <BasicExperienceItemInput
        onSubmit={(experienceItem) =>
          experienceItem &&
          setBasicExperienceItems([experienceItem, ...basicExperienceItems])
        }
        setErrorMessage={(message) => setAlertMessageOrClear(message, "error")}
      />
      <ExperienceSummaryComponent
        listOfExperienceItem={experienceItemMapper(basicExperienceItems)}
      />
      <Divider style={{ width: "100%", marginBottom: "5px" }} />
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
