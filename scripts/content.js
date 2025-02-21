chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extract") {
    sendResponse({ text: document.body.innerText.substring(0, 5000) });
  }
});
