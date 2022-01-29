import { IChromeRepository } from "../service/chrome.interface";

export class ChromeRepository implements IChromeRepository {
  async getAllSpanText(): Promise<string[]> {
    const message = {
      type: "getAllSpanText",
    };
    const queryInfo: chrome.tabs.QueryInfo = {
      active: true,
      currentWindow: true,
    };
    return new Promise((resolve, reject) => {
      chrome.tabs.query(queryInfo, (tabs) => {
        const tabId: number = tabs[0].id as number;
        chrome.tabs.sendMessage(tabId, message, (response = null) => {
          if (!response) {
            reject(chrome.runtime.lastError);
          }
          resolve(response.data);
        });
      });
    });
  }
}
