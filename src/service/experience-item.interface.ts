export interface ExperienceItem {
  uuid: string;
  start: YearMonth;
  end: YearMonth;
  added: number;
  duplicate: number;
  prevText: string;
  isUsed: boolean;
}

export interface YearMonth {
  year: number;
  month: number;
}
