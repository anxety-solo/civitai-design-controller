chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && tab.url.match(/^https?:\/\/([^\/]+\.)?civitai\.com\//)) {
        chrome.action.enable(tabId);
    } else {
        chrome.action.disable(tabId);
    }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    let tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url && tab.url.match(/^https?:\/\/([^\/]+\.)?civitai\.com\//)) {
        chrome.action.enable(activeInfo.tabId);
    } else {
        chrome.action.disable(activeInfo.tabId);
    }
});

// Handle popup opening from extension icon
chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url && tab.url.match(/^https?:\/\/([^\/]+\.)?civitai\.com\//)) {
        try {
            await chrome.tabs.sendMessage(tab.id, { action: 'togglePopup' });
        } catch (error) {
            console.warn('Failed to send message to content script:', error);
        }
    }
});