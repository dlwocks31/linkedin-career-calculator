export interface IChromeRepository {
  getAllSpanText(): Promise<string[]>;
}
