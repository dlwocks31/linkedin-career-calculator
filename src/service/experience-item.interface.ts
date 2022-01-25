export interface ExperienceItem {
  uuid: string;
  start: YearMonth;
  end: YearMonth;
  added: number;
  duplicate: number;
  company: string;
  isUsed: boolean;
}
export interface BasicExperienceItem {
  start: YearMonth;
  end: YearMonth;
  company: string;
}
export interface YearMonth {
  year: number;
  month: number;
}
