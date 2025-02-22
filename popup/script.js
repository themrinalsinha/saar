document.getElementById("summarize").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: extractText,
    },
    async (result) => {
      if (result && result[0] && result[0].result) {
        const text = result[0].result;
        const summary = await summarizeText(text);
        document.getElementById("summary").innerText = summary;
      }
    }
  );
});

async function summarizeText(text) {
  const { OPENAI_API_KEY } = await chrome.storage.local.get("OPENAI_API_KEY");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: `Summarize this: ${text}` }],
      max_tokens: 150,
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

function extractText() {
  return document.body.innerText.substring(0, 5000);
}
