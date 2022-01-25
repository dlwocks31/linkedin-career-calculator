import { IChromeRepository } from "./chrome.interface";
import { v4 as uuidv4 } from "uuid";
import {
  YearMonth,
  ExperienceItem,
  BasicExperienceItem,
} from "./experience-item.interface";
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

export class ExperienceItemService {
  constructor(private chromeRepository: IChromeRepository) {}

  async getExperienceItems(): Promise<BasicExperienceItem[]> {
    const basicDataArray: BasicExperienceItem[] = [];
    const spanTexts = await this.chromeRepository.getAllSpanText();
    const uniqueSpanTexts = uniqueize(spanTexts);
    for (const [i, text] of uniqueSpanTexts.entries()) {
      const result = parseAsDuration(text);
      if (result) {
        const { start, end } = result;
        basicDataArray.push({
          start,
          end,
          company: uniqueSpanTexts[i - 1],
          uuid: uuidv4(),
          isUsed: true,
        });
      }
    }
    return basicDataArray;
  }
}
