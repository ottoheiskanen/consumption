let currentTab;
console.log("background!");

// Track the active tab
function updateActiveTab(activeInfo) {
  currentTab = activeInfo.tabId;
}

chrome.tabs.onActivated.addListener(updateActiveTab);

// Create an alarm to trigger every 10 seconds
chrome.alarms.create("sendData", { periodInMinutes: 1 / 6 });

// On alarm, send the time spent to the server
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "sendData") {
    sendDataToServer(currentTab);
    console.log("Data sent");
  }
});

// Function to send data to server
function sendDataToServer(tabId, timeSpent) {
  chrome.tabs.get(tabId, function(tab) {

    const url = new URL(tab.url);
    const baseUrl = `${url.protocol}//${url.hostname}`;

    let siteName = tab.title;

    const data = {
        url: baseUrl,
        name: siteName
    };

    fetch('http://localhost:9292/sites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
  });
}