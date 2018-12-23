// Listen for messages from our content script
chrome.runtime.onMessage.addListener(function (msg, sender) {
  if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
    chrome.pageAction.show(sender.tab.id);
  }
  if ((msg.from === 'content') && (msg.subject === 'badge')){
    if (msg.color == "blue"){
        chrome.browserAction.setBadgeBackgroundColor({color:[43, 131, 186, 230],tabId:sender.tab.id});
    }
    else if (msg.color == "green"){
        chrome.browserAction.setBadgeBackgroundColor({color:[38, 114, 38, 230],tabId:sender.tab.id});
    }
    else if  (msg.color == "orange"){
        chrome.browserAction.setBadgeBackgroundColor({color:[255, 128, 0, 230],tabId:sender.tab.id});
    }
    else if  (msg.color == "red"){
        chrome.browserAction.setBadgeBackgroundColor({color:[215, 25, 28, 230],tabId:sender.tab.id});

    }
    else if (msg.color =="na"){
        msg.value = "-Ø-" 
    }
    chrome.browserAction.setBadgeText ( { text: msg.value ,tabId:sender.tab.id} ); 
  }
});

