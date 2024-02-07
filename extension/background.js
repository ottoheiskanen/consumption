let currentTab;
let startTime = Date.now();

// Track the active tab
function updateActiveTab(activeInfo) {
  currentTab = activeInfo.tabId;
  startTime = Date.now(); // Reset start time on tab change
}

chrome.tabs.onActivated.addListener(updateActiveTab);

// Create an alarm to trigger every 10 seconds
chrome.alarms.create("sendData", { periodInMinutes: 1 / 6 });

// On alarm, send the time spent to the server
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "sendData") {
    const timeSpent = Date.now() - startTime;
    sendDataToServer(currentTab, timeSpent);
    startTime = Date.now(); // Reset start time after sending data
  }
});

// Function to send data to server
function sendDataToServer(tabId, timeSpent) {
  chrome.tabs.get(tabId, function(tab) {
    // Assuming you have an API endpoint ready to receive data
    fetch('https://yourserver.com/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: tab.url,
        timeSpent: timeSpent
      }),
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
  });
}