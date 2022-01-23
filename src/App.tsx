import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

interface ExperienceItem {
  start: YearMonth;
  end: YearMonth;
  added: number;
  duplicate: number;
  prevText: string;
}

interface YearMonth {
  year: number;
  month: number;
}
const renderAsViewArray = (dataArray: ExperienceItem[]) => {
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
const getAllSpanTexts = (): Promise<string[]> => {
  const message = {
    type: "getAllSpanText",
  };
  const queryInfo: chrome.tabs.QueryInfo = {
    active: true,
    currentWindow: true,
  };
  return new Promise((resolve) => {
    chrome.tabs.query(queryInfo, (tabs) => {
      const tabId: number = tabs[0].id as number;
      chrome.tabs.sendMessage(tabId, message, (response) => {
        resolve(response.data);
      });
    });
  });
};
function parseStringToYearMonth(str: string) {
  if (str == "현재") {
    return { year: new Date().getFullYear(), month: new Date().getMonth() + 1 };
  }
  const res = str.match(/(\d{4})년 (\d{1,2})월/);
  if (res?.length && res.length >= 3) {
    return { year: parseInt(res[1]), month: parseInt(res[2]) };
  } else {
    return null;
  }
}

function enumerateDiffOfTwoYearMonth(
  yearMonthStart: YearMonth,
  yearMonthEnd: YearMonth,
) {
  if (diffTwoYearMonth(yearMonthStart, yearMonthEnd) <= 0) {
    return [];
  }
  const ls = [];
  let year = yearMonthStart.year;
  let month = yearMonthStart.month;
  console.log("XXX enumerateDiffOfTwoYearMonth", yearMonthStart, yearMonthEnd);
  while (!(year == yearMonthEnd.year && month == yearMonthEnd.month)) {
    ls.push(`${year}-${month}`);
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }
  ls.push(`${year}-${month}`);
  return ls;
}

function diffTwoYearMonth(yearMonthStart: YearMonth, yearMonthEnd: YearMonth) {
  return (
    yearMonthEnd.year * 12 +
    yearMonthEnd.month -
    (yearMonthStart.year * 12 + yearMonthStart.month) +
    1
  );
}
function uniqueize(ls: string[]) {
  const st = new Set();
  const res = [];
  for (const x of ls) {
    if (!st.has(x)) {
      res.push(x);
      st.add(x);
    }
  }
  return res;
}

function parseAsDuration(text: string) {
  if (!text) return null;
  const result = text.match(
    /^(\d{4}년 \d{1,2}월) [-–~] (현재|\d{4}년 \d{1,2}월)/,
  );
  console.log("XXX parseAsDuration", text, result);
  if (result) {
    const start = parseStringToYearMonth(result[1]);
    const end = parseStringToYearMonth(result[2]);
    console.log("XXX start, end", start, end);
    if (start && end) {
      return {
        start,
        end,
      };
    }
  }
  return null;
}
class YearMonthContainer {
  private container;
  constructor() {
    this.container = new Set();
  }
  addDuration(start: YearMonth, end: YearMonth) {
    let added = 0;
    let duplicate = 0;
    const ls = enumerateDiffOfTwoYearMonth(start, end);
    for (const ym of ls) {
      if (!this.container.has(ym)) {
        this.container.add(ym);
        added++;
      } else {
        duplicate++;
      }
    }
    return { added, duplicate };
  }
}

const getListOfExpStringFromPage = async () => {
  const ymc = new YearMonthContainer();
  const dataArray: ExperienceItem[] = [];
  const spanTexts = await getAllSpanTexts();
  const uniqueSpanTexts = uniqueize(spanTexts);
  for (const [i, text] of uniqueSpanTexts.entries()) {
    const result = parseAsDuration(text);
    if (result) {
      const { start, end } = result;
      const { added, duplicate } = ymc.addDuration(start, end);
      dataArray.push({
        start,
        end,
        added,
        duplicate,
        prevText: uniqueSpanTexts[i - 1],
      });
    }
  }
  console.log("XXX dataArray is: ", dataArray);
  return dataArray;
};

const ExperienceItemComponent = (props: { experienceItem: ExperienceItem }) => {
  const item = props.experienceItem;
  return (
    <div>
      <input type="checkbox" />
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
  const sum = listOfExperienceItem.reduce((acc, cur) => acc + cur.added, 0);
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

  const getListOfExpString = async () => {
    const list = await getListOfExpStringFromPage();
    setListOfExperienceItem(list);
  };

  return (
    <div className="App">
      <button onClick={getListOfExpString}>Get From Span</button>
      <ExperienceSummaryComponent listOfExperienceItem={listOfExperienceItem} />
      <p>----------------------</p>
      {listOfExperienceItem.map((item) => (
        <ExperienceItemComponent experienceItem={item} />
      ))}
    </div>
  );
};

export default App;
