chrome.runtime.onInstalled.addListener(() => {
  console.log("SAAR Extension Installed.");
});


// load environment variables from .env file
fetch(chrome.runtime.getURL('../.env'))
  .then(response => response.text())
  .then(data => {
    const env = {};
    data.split("\n").forEach(line => {
      const [key, value] = line.split("=");
      if (key && value) {
        env[key.trim()] = value.trim();
      }
    });
    chrome.storage.local.set(env)
    console.log("Environment variables loaded:", env);
  })
  .catch(error => {
    console.error("Error loading .env file:", error);
  });
