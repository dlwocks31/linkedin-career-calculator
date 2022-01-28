import { BasicExperienceItem } from "../domain/BasicExperienceItem";
import { ExperienceItem } from "../domain/ExperienceItem";
import { YearMonth } from "../domain/YearMonth";

function diffTwoYearMonth(yearMonthStart: YearMonth, yearMonthEnd: YearMonth) {
  return (
    yearMonthEnd.year * 12 +
    yearMonthEnd.month -
    (yearMonthStart.year * 12 + yearMonthStart.month) +
    1
  );
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

export function experienceItemMapper(
  basicExperienceItems: BasicExperienceItem[],
): ExperienceItem[] {
  // 링크드인에서 온 순서를 유지해야 하기 때문에, 정렬은 따로 하지 않는 것이 맞음.
  const yearMonthContainer = new YearMonthContainer();
  const experienceItems: ExperienceItem[] = [];
  for (const item of basicExperienceItems) {
    if (item.isUsed) {
      const { start, end } = item;
      const { added, duplicate } = yearMonthContainer.addDuration(start, end);
      experienceItems.push({ ...item, added, duplicate });
    } else {
      experienceItems.push({ ...item, added: 0, duplicate: 0 });
    }
  }
  return experienceItems;
}
