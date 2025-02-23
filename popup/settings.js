document.addEventListener('DOMContentLoaded', async () => {
  const backBtn = document.getElementById('back-btn');
  const apiKeyInput = document.getElementById('api-key-display');
  const modelSelect = document.getElementById('default-model');

  // Load saved settings
  const { OPENAI_API_KEY, DEFAULT_MODEL } = await chrome.storage.local.get([
    "OPENAI_API_KEY",
    "DEFAULT_MODEL"
  ]);

  // Hide back button if no API key
  if (!OPENAI_API_KEY) {
    backBtn.style.display = 'none';
  }

  if (OPENAI_API_KEY) {
    apiKeyInput.value = OPENAI_API_KEY;
  }

  if (DEFAULT_MODEL) {
    modelSelect.value = DEFAULT_MODEL;
  }

  // Save all settings
  document.getElementById('save-settings').addEventListener('click', async () => {
    const newApiKey = apiKeyInput.value;
    const selectedModel = modelSelect.value;
    
    if (!newApiKey) {
      alert('Please enter an API key');
      return;
    }

    await chrome.storage.local.set({ 
      OPENAI_API_KEY: newApiKey,
      DEFAULT_MODEL: selectedModel 
    });
    
    // Show back button after saving valid API key
    backBtn.style.display = 'block';
    alert('Settings saved successfully!');
  });

  // Back button
  backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});