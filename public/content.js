const messagesFromReactAppListener = (request, sender, response) => {
  if (request.type === "get") {
    response({ data: main() });
  } else {
    console.error("unknown type");
  }
};
function main() {
  console.log("XXX main called");
  const ymc = new YearMonthContainer();
  const dataArray = [];
  const spanTexts = getAllSpanText();
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
  return dataArray;
}

function getAllSpanText() {
  const ls = [];
  document.querySelectorAll("span").forEach((span) => {
    if (span.children.length === 0) {
      ls.push(span.innerText);
    }
  });
  return ls;
}

function uniqueize(ls) {
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

function parseAsDuration(text) {
  if (!text) return null;
  const result = text.match(
    /^(\d{4}년 \d{1,2}월) [-–~] (현재|\d{4}년 \d{1,2}월)/,
  );
  console.log("XXX parseAsDuration", text, result);
  if (result) {
    return {
      start: parseStringToYearMonth(result[1]),
      end: parseStringToYearMonth(result[2]),
    };
  } else {
    return null;
  }
}
class YearMonthContainer {
  constructor() {
    this.container = new Set();
  }
  addDuration(start, end) {
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

function parseStringToYearMonth(str) {
  if (str == "현재") {
    return { year: new Date().getFullYear(), month: new Date().getMonth() + 1 };
  }
  const res = str.match(/(\d{4})년 (\d{1,2})월/);
  return { year: parseInt(res[1]), month: parseInt(res[2]) };
}

function enumerateDiffOfTwoYearMonth(yearMonthStart, yearMonthEnd) {
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

function diffTwoYearMonth(yearMonthStart, yearMonthEnd) {
  return (
    yearMonthEnd.year * 12 +
    yearMonthEnd.month -
    (yearMonthStart.year * 12 + yearMonthStart.month) +
    1
  );
}

console.log("content.js loaded");
/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
