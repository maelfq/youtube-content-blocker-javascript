console.log('content.js');

const SHORTS_KEY = 'youtube_content_blocker_configuration_disable_shorts';
const SUGGESTED_VIDEOS_KEY = 'youtube_content_blocker_configuration_disable_suggested_videos';

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

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
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

    console.log(disableShorts);
    console.log(disableSuggestedVideos);

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
    console.log('url', currentUrl);
    if(currentUrl.includes('watch')) {
        const secondaryVideos = await waitForElementToExist('#secondary');
    }
    else if(currentUrl.includes('subscriptions')) {
        const shorts = await waitForElementToExist('ytd-rich-shelf-renderer');
    }
    removeContent();
    return;
}

waitForPageInit();

// FIXME: fix location change trigger
/*
const urlChangeEventListener = window.navigation.addEventListener("navigate", (event) => {
    console.log('urlChangeEvent');
    waitForPageInit();
})
*/

function removeWatchNextElement() {
    const watchNextElement = document.getElementById('secondary');
    if(watchNextElement) {
        watchNextElement.style.display = 'none';
    }
}

function setPlayer() {
    console.log('setPlayer');
    // get the rendered size from the player-container
    const player = document.getElementById('player-container-outer');
    if(player) {
        player.style['background-color'] = 'antiquewhite';
    }


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
    console.log('disableShortsOnSubscriptionPage');
    const shorts = document.querySelectorAll('ytd-rich-shelf-renderer');
    shorts.forEach(shortBanner => {
        shortBanner.style['display'] = 'none';
    })  
}


/**
 * @deprecated
 * @unused
 */
function fixDefaultPlayer() {
    const youtubeVideo = document.getElementsByClassName("html5-main-video")[0];
    youtubeVideo.style['width'] = player.offsetWidth + 'px';
    youtubeVideo.style['height'] = player.offsetHeight + 'px';

    const playerButtons = document.getElementsByClassName("ytp-chrome-bottom")[0];
    playerButtons.style['width'] = player.offsetWidth + 'px';

    const playerProgressBar = document.getElementsByClassName("ytp-chapter-hover-container")[0];
    playerProgressBar.style['width'] = player.offsetWidth + 'px';
}