import { YearMonth } from "./YearMonth";

export interface ExperienceItem {
  uuid: string;
  start: YearMonth;
  end: YearMonth;
  added: number;
  duplicate: number;
  company: string;
  isUsed: boolean;
}
