console.log("Launched YT Blocker");

const SHORTS_KEY = 'youtube_content_blocker_configuration_disable_shorts';
const SUGGESTED_VIDEOS_KEY = 'youtube_content_blocker_configuration_disable_suggested_videos';


document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById("button-settings");
    button.addEventListener('click',handleSettings);
    loadUserStorage()
})

async function loadUserStorage() {
    console.log('loadUserStorage');

    let data = await chrome.storage.local.get([SHORTS_KEY, SUGGESTED_VIDEOS_KEY]);
    console.log(data);
    const savedDisableShorts = data[SHORTS_KEY];
    const savedDisableSuggestedVideos = data[SUGGESTED_VIDEOS_KEY];
    
    console.log(savedDisableShorts);
    console.log(savedDisableSuggestedVideos);

    if(savedDisableShorts != undefined && savedDisableShorts != null) {
        if(savedDisableShorts == true) {
            document.getElementById('shorts').setAttribute('checked', 'true');
        }
        else {
            document.getElementById('shorts').removeAttribute('checked');
        }
        if(savedDisableSuggestedVideos == true) {
            document.getElementById('suggested-videos').setAttribute('checked', 'true');
        }
        else {
            document.getElementById('suggested-videos').removeAttribute('checked');
        }
    }
    else {
        document.getElementById('shorts').removeAttribute('checked');
        document.getElementById('suggested-videos').removeAttribute('checked');
    }
}

function handleSettings() {
    console.log('handleSettings');
    const disableShorts = document.getElementById('shorts').checked;
    const disableSuggestedVideos = document.getElementById('suggested-videos').checked;

    console.log(disableShorts);
    console.log(disableSuggestedVideos);
    
    chrome.storage.local.set({ [SHORTS_KEY]: disableShorts });
    chrome.storage.local.set({ [SUGGESTED_VIDEOS_KEY]: disableSuggestedVideos });
}

