import { IChromeRepository } from "./chrome.interface";
interface ExperienceItem {
  uuid: string;
  start: YearMonth;
  end: YearMonth;
  added: number;
  duplicate: number;
  prevText: string;
  isUsed: boolean;
}

interface YearMonth {
  year: number;
  month: number;
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
function parseStringToYearMonth(str: string) {
  if (str === "현재") {
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
  while (!(year === yearMonthEnd.year && month === yearMonthEnd.month)) {
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
export class ExperienceItemService {
  constructor(private chromeRepository: IChromeRepository) {}

  async getExperienceItems(): Promise<ExperienceItem[]> {
    const ymc = new YearMonthContainer();
    const dataArray: ExperienceItem[] = [];
    const spanTexts = await this.chromeRepository.getAllSpanText();
    const uniqueSpanTexts = uniqueize(spanTexts);
    for (const [i, text] of uniqueSpanTexts.entries()) {
      const result = parseAsDuration(text);
      if (result) {
        const { start, end } = result;
        const { added, duplicate } = ymc.addDuration(start, end);
        dataArray.push({
          uuid: i.toString(),
          start,
          end,
          added,
          duplicate,
          prevText: uniqueSpanTexts[i - 1],
          isUsed: true,
        });
      }
    }
    console.log("XXX dataArray is: ", dataArray);
    return dataArray;
  }
}
