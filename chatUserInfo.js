const config = require('./config.json');

module.exports = (FCADE) => { runPlugin(FCADE) };

const defaultConfig = {
    enableStatus: true,
    enableFlag: true,
    enableRank: true,
    enablePingText: true,
    enablePingBars: true,
};

const runPlugin = (FCADE) => {
    // Plugin code goes here
    setInterval(()=>{
        processMessages(FCADE, config.chatUserInfo);
    }, 1000);
}

const processMessages = (FCADE, chatUserInfoConfig) => {
    if (!chatUserInfoConfig) {
        chatUserInfoConfig = defaultConfig
    }

    const globalUsers = FCADE.globalUsers;
    // Select all message elements and exclude already processed ones
    const messageElements = document.querySelectorAll('#app div.message:not([data-has-flag])') || [];
    messageElements.forEach(messageElement => {
        const authorElement = messageElement.querySelector('span.author');
        if (!authorElement) return;

        const userKey = authorElement.innerText.trim();
        const globalUser = globalUsers[userKey];
        // Check if user data exists
        if (globalUser && globalUsers[userKey].country) {
            const countryData = globalUsers[userKey].country;
            const activeChannelId = FCADE.activeChannelId;
            const usersList = FCADE.$refs[activeChannelId][0]?.$refs?.usersList || [];

            const userFound = (usersList.$children || []).find(child => child?.user?.id === userKey);
            
            const pingImg = userFound?.pingSrc;
            const rankImg = userFound?.rankSrc;
            const ping = globalUser?.ping;
            // create span element for ping
            const pingTextElement = document.createElement('span');
            // set small font size for ping
            pingTextElement.style.fontSize = 'small';
            pingTextElement.style.marginLeft = '5px';
            pingTextElement.style.fontWeight = 'normal';
            pingTextElement.innerHTML = `(ping: ~${ping} ms)`;
            const statusElement = createStatusElement(globalUser?.away);
            // Create and append the flag and ping elements
            const flagElement = createFlagElement(countryData);

            // add status element as first element
            if (chatUserInfoConfig.enableStatus){
                authorElement.parentElement.insertBefore(statusElement, authorElement);
            }
            if (chatUserInfoConfig.enableFlag){
                authorElement.appendChild(flagElement);
            }
            if (chatUserInfoConfig.enableRank && rankImg){
                const rankElement = createRankElement(rankImg, userFound?.rankTitle);
                authorElement.appendChild(rankElement);
            }
            if (chatUserInfoConfig.enablePingBars && pingImg){
                const pingElement = createPingElement(pingImg, userFound?.pingTitle);
                authorElement.appendChild(pingElement);
            }
            if (chatUserInfoConfig.enablePingText){
                authorElement.appendChild(pingTextElement);
            }
                       
            // Mark the message as processed
            messageElement.dataset.hasFlag = "true";
        }
    });
};

function createFlagElement(country) {
    const flagWrapper = document.createElement('span');
    flagWrapper.className = 'flagWrapper';
    flagWrapper.style.width = '20px';
    flagWrapper.style.display = 'inline-block'; // Inline box
    flagWrapper.style.height = '14px';
    flagWrapper.title = country.full_name;
    flagWrapper.style.backgroundImage = `url('static/flags/${country.iso_code.toLowerCase()}.png')`;
    flagWrapper.style.backgroundSize = 'contain'; // Crop image to center
    flagWrapper.style.marginLeft = '5px'; // Add some space from the author name
    return flagWrapper;
}

function createPingElement(pingSrc, title) {
    const pingWrapper = document.createElement('span');
    pingWrapper.className = 'pingWrapper';
    pingWrapper.style.width = '15px';
    pingWrapper.style.display = 'inline-block'; // Inline box
    pingWrapper.style.height = '15px';
    pingWrapper.title = title;
    pingWrapper.style.backgroundImage = `url('${pingSrc}')`;
    pingWrapper.style.backgroundSize = 'contain'; // Crop image to center
    pingWrapper.style.marginLeft = '5px'; // Add some space from the previous element
    return pingWrapper;
}

function createRankElement(rankSrc, title) {
    const pingWrapper = document.createElement('span');
    pingWrapper.className = 'pingWrapper';
    pingWrapper.style.width = '15px';
    pingWrapper.style.display = 'inline-block'; // Inline box
    pingWrapper.style.height = '15px';
    pingWrapper.title = title;
    pingWrapper.style.backgroundImage = `url('${rankSrc}')`;
    pingWrapper.style.backgroundSize = 'contain'; // Crop image to center
    pingWrapper.style.marginLeft = '5px'; // Add some space from the previous element
    return pingWrapper;
}

function createStatusElement(isAway){
    const statusWrapper = document.createElement('div');
    statusWrapper.className = 'statusWrapper';
    statusWrapper.title = isAway ? 'Away' : 'Online';
    statusWrapper.style.width = '10px';
    statusWrapper.style.display = 'inline-block'; // Inline box
    statusWrapper.style.height = '10px';
    statusWrapper.style.borderRadius = '50%';
    statusWrapper.style.backgroundColor = isAway ? 'orange' : 'green';
    statusWrapper.style.marginLeft = '5px'; // Add some space from the previous element
    return statusWrapper;
}
