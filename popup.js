document.getElementById('checkButton').addEventListener('click', async () => {
  const text = document.getElementById('textInput').value;

  // Send a message to the background.js for grammar correction
  chrome.runtime.sendMessage(
    { type: 'correctGrammar', text: text },
    (response) => {
      if (response.status === 'success') {
        // Display the corrected text in the popup
        document.getElementById('corrected').innerHTML = response.correctedText;
      } else {
        console.error('Error during grammar correction:', response.message);
      }
    }
  );
});

  