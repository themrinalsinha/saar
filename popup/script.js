async function checkApiKey() {
  const { OPENAI_API_KEY } = await chrome.storage.local.get("OPENAI_API_KEY");

  if (!OPENAI_API_KEY) {
    window.location.href = 'settings.html';
    return;
  }
}

document.addEventListener("DOMContentLoaded", checkApiKey);

document.getElementById("save-api-key").addEventListener("click", async () => {
  const apiKey = document.getElementById("api-key").value;
  await chrome.storage.local.set({ OPENAI_API_KEY: apiKey });
  checkApiKey();
});

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
        document.getElementById("summary").innerHTML = marked.parse(summary);
      }
    }
  );
});

async function summarizeText(text) {
  const { OPENAI_API_KEY, DEFAULT_MODEL } = await chrome.storage.local.get([
    "OPENAI_API_KEY",
    "DEFAULT_MODEL"
  ]);

  const model = DEFAULT_MODEL || "gpt-3.5-turbo"; // Default to GPT-3.5 if no model selected

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: "user", content: `Summarize this: ${text}` }],
      max_tokens: 150,
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

function extractText() {
  return document.body.innerText.substring(0, 10000);
}

document.getElementById("settings-btn").addEventListener("click", () => {
  window.location.href = 'settings.html';
});
