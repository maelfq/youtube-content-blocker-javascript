console.log('content.js');

const SHORTS_KEY = 'youtube_content_blocker_configuration_disable_shorts';
const SUGGESTED_VIDEOS_KEY = 'youtube_content_blocker_configuration_disable_suggested_videos';

let currentUrl = window.location.href.toLowerCase();

function waitForElementToExist(selector) {
    return new Promise(resolve => {

        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function removeContent() {
    let data = await chrome.storage.local.get([SHORTS_KEY, SUGGESTED_VIDEOS_KEY]);

    const disableShorts = data[SHORTS_KEY];
    const disableSuggestedVideos = data[SUGGESTED_VIDEOS_KEY];

    if(disableSuggestedVideos == true) {
        removeWatchNextElement();
        setPlayer();
    }

    if(disableShorts == true) {
        disableShortsOnSubscriptionPage();
    }
}

async function waitForPageInit() {
    
    const currentUrl = window.location.href.toLowerCase();
    if(currentUrl.includes('watch')) {
        const secondaryVideos = await waitForElementToExist('ytd-watch-next-secondary-results-renderer');
    }
    else if(currentUrl.includes('subscriptions')) {
        const shorts = await waitForElementToExist('ytd-rich-shelf-renderer');
    }
    removeContent();
    return;
}

waitForPageInit();

chrome.runtime.onMessage.addListener(function(request, sender) {
    console.log("URL CHANGED: ", request.data.url);
    if(request.data.url.toLowerCase() != currentUrl); {
        currentUrl = request.data.url.toLowerCase();
        waitForPageInit();
    }
});

function removeWatchNextElement() {
    const watchNextElement = document.querySelector('ytd-watch-next-secondary-results-renderer');
    if(watchNextElement) {
        watchNextElement.style.display = 'none';
    }
}

function setPlayer() {
    // enable cinema display
    const cinemaModeButton = document.getElementsByClassName('ytp-size-button')[0];
    if(cinemaModeButton && cinemaModeButton.getAttribute('aria-label').toLowerCase().includes('cinema')) {
        cinemaModeButton.click();
    }

    // disable autoplay
    const autoplayButton = document.getElementsByClassName('ytp-autonav-toggle-button')[0];
    if(autoplayButton && autoplayButton.getAttribute('aria-checked') == 'true') {
        autoplayButton.click();
    }
}

function disableShortsOnSubscriptionPage() {
    const shorts = document.querySelectorAll('ytd-rich-shelf-renderer');
    shorts.forEach(shortBanner => {
        shortBanner.style['display'] = 'none';
    })  
}