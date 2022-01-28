import { YearMonth } from "./YearMonth";

export interface BasicExperienceItem {
  uuid: string;
  start: YearMonth;
  end: YearMonth;
  company: string;
  isUsed: boolean;
}
