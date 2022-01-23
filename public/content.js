const messagesFromReactAppListener = (request, sender, response) => {
  if (request.type === "get") {
    response({ data: "hello" });
  } else {
    console.error("unknown type");
  }
};

console.log("content.js loaded");
/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
