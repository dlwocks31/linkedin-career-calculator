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
  uuid: string;
  start: YearMonth;
  end: YearMonth;
  company: string;
  isUsed: boolean;
}
export interface YearMonth {
  year: number;
  month: number;
}
