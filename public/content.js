const messagesFromReactAppListener = (request, sender, response) => {
  if (request.type === "getAllSpanText") {
    response({ data: getAllSpanText() });
  } else {
    console.error("unknown type");
  }
};
function getAllSpanText() {
  const ls = [];
  document.querySelectorAll("span").forEach((span) => {
    if (span.children.length === 0) {
      ls.push(span.innerText);
    }
  });
  return ls;
}

chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
