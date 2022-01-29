import { IChromeRepository } from "./chrome.interface";
import { v4 as uuidv4 } from "uuid";
import { BasicExperienceItem } from "../domain/BasicExperienceItem";
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

  async getExperienceItems(): Promise<{
    experienceItems: BasicExperienceItem[];
    warnings: string[];
  }> {
    try {
      const experienceItems: BasicExperienceItem[] = [];
      const spanTexts = await this.chromeRepository.getAllSpanText();
      const uniqueSpanTexts = uniqueize(spanTexts);
      for (const [i, text] of uniqueSpanTexts.entries()) {
        const result = parseAsDuration(text);
        if (result) {
          const { start, end } = result;
          experienceItems.push({
            start,
            end,
            company: uniqueSpanTexts[i - 1],
            uuid: uuidv4(),
            isUsed: true,
          });
        }
      }
      const warnMoreExperience = uniqueSpanTexts.some((text) =>
        text.includes("직책 모두 보기"),
      );
      const warnNoExperience = experienceItems.length === 0;
      const warnings = warnMoreExperience
        ? [
            '이 페이지에는 누락된 직책이 존재합니다. "직책 모두 보기" 버튼을 클릭해 모든 직책을 확인해 주세요.',
          ]
        : warnNoExperience
        ? ["이 페이지에서 경력사항을 감지하지 못했습니다."]
        : [];
      return {
        experienceItems,
        warnings,
      };
    } catch (e) {
      return {
        experienceItems: [],
        warnings: [
          "데이터를 가져오는 데 실패했습니다. 링크드인 페이지가 맞는지 확인해 주세요.",
        ],
      };
    }
  }
}
