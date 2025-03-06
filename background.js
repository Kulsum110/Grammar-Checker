// background.js

// When the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log('Grammar Corrector Extension Installed');
    // You can initialize any settings or default states here if needed
  });
  
  // Listen for messages from popup.js (e.g., when user clicks "Check" button)
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'correctGrammar') {
      const text = message.text;
      console.log('Received grammar correction request for text:', text);
  
      // Call LanguageTool API for grammar correction (This can also be done in the background if needed)
      fetch('https://api.languagetoolplus.com/v2/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'text': text,
          'language': 'en-US'
        })
      })
        .then(response => response.json())
        .then(result => {
          // Send back the corrected text with highlighted errors
          const correctedText = highlightErrors(text, result.matches);
          sendResponse({ status: 'success', correctedText: correctedText });
        })
        .catch(err => {
          console.error('Error fetching grammar correction:', err);
          sendResponse({ status: 'error', message: 'Error fetching grammar correction' });
        });
  
      // Return true to indicate that we will send the response asynchronously
      return true;
    }
  });
  
  // Function to highlight errors in the text (same as the one in popup.js)
  function highlightErrors(text, matches) {
    let offset = 0;
    matches.forEach(match => {
      const start = match.offset + offset;
      const end = start + match.length;
  
      // Wrap the error in a span with a red underline
      const errorText = `<span style="text-decoration: underline; color: red;" title="${match.message}">${text.substring(start, end)}</span>`;
      text = text.substring(0, start) + errorText + text.substring(end);
      offset += errorText.length - match.length; // Adjust the offset
    });
    return text;
  }
  