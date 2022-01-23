import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

interface ResponseItem {
  start: {
    year: number;
    month: number;
  };
  end: {
    year: number;
    month: number;
  };
  added: number;
  duplicate: number;
  prevText: string;
}
const renderAsViewArray = (dataArray: ResponseItem[]) => {
  const sum = dataArray.reduce((acc, cur) => acc + cur.added, 0);
  console.log(dataArray);
  return [
    `총합 경력: ${Math.floor(sum / 12)}년 ${sum % 12}개월`,
    "----------------------------------------",
    ...dataArray.map(({ start, end, added, duplicate, prevText }) => {
      console.log(start, end, added, duplicate, prevText);
      return (
        `${start.year}/${start.month} ~ ${end.year}/${end.month}: ${added}개월` +
        (duplicate > 0 ? ` (${duplicate}개월 중복)` : "") +
        `(${prevText})`
      );
    }),
  ];
};
const App = () => {
  const [responseFromContent, setResponseFromContent] = useState<
    ResponseItem[]
  >([]);

  /**
   * Get current URL
   */
  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true };

    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        const url = tabs[0].url || "";
      });
  }, []);

  const getQuery = () => {
    const message = {
      type: "get",
    };

    const queryInfo: chrome.tabs.QueryInfo = {
      active: true,
      currentWindow: true,
    };

    chrome.tabs.query(queryInfo, (tabs) => {
      const tabId: number = tabs[0].id as number;
      chrome.tabs.sendMessage(tabId, message, (response) => {
        setResponseFromContent(response.data);
      });
    });
  };

  return (
    <div className="App">
      <button onClick={getQuery}>Get</button>
      {renderAsViewArray(responseFromContent).map((item) => (
        <p>{item}</p>
      ))}
    </div>
  );
};

export default App;
