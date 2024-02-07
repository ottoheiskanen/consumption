let currentTab;

console.log("background!");

// Track the active tab
function updateActiveTab(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        // Validate tab URL before updating currentTab
        if (isUrlAllowed(tab.url)) {
            currentTab = activeInfo.tabId;
        } else {
            currentTab = null; // Reset or nullify currentTab if URL is not allowed
        }
    });
}

chrome.tabs.onActivated.addListener(updateActiveTab);

// Create an alarm to trigger every 10 seconds
chrome.alarms.create("sendData", { periodInMinutes: 1 / 6 });

// On alarm, send the time spent to the server
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "sendData" && currentTab !== null) {
        sendDataToServer(currentTab);
        console.log("Data sent for tab ID:", currentTab);
    }
});

// Function to send data to server
function sendDataToServer(tabId) {
    chrome.tabs.get(tabId, function(tab) {
        // Additional check to ensure the tab URL is allowed before sending data
        if (!isUrlAllowed(tab.url)) {
            console.error("Attempted to send data for an unauthorized URL:", tab.url);
            return;
        }

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

// Helper function to validate if a URL is allowed based on predefined patterns
function isUrlAllowed(url) {
    const allowedPatterns = [
        /^https:\/\/(www\.)?ylilauta\.org\/.*/,
        /^https:\/\/(www\.)?reddit\.com\/.*/,
        /^https:\/\/(www\.)?twitter\.com\/.*/
    ];
    return allowedPatterns.some(pattern => pattern.test(url));
}