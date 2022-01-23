import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

const App = () => {
  const [url, setUrl] = useState<string>("");
  const [responseFromContent, setResponseFromContent] =
    useState<string>("Initial State");

  /**
   * Get current URL
   */
  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true };

    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        const url = tabs[0].url || "";
        setUrl(url);
      });
  }, []);

  const sendTestMessage = () => {
    const message = {
      type: "get",
    };

    const queryInfo: chrome.tabs.QueryInfo = {
      active: true,
      currentWindow: true,
    };

    chrome.tabs.query(queryInfo, (tabs) => {
      const tabId: number = tabs[0].id as number;
      chrome.tabs.sendMessage(tabId, message, (response) => {
        setResponseFromContent(response.data);
      });
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hot build</p>
        <p>{url}</p>
        <button onClick={sendTestMessage}>SEND MESSAGE</button>
        <p>{responseFromContent}</p>
      </header>
    </div>
  );
};

export default App;
