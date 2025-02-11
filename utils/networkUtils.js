const { XMLParser } = require("fast-xml-parser");
const { request } = require("playwright");
const axios = require("axios");

// Waits for a network request containing the specified keyword
//  await waitForNetworkRequest(page, "connect?");
async function waitForNetworkRequest(page, key) {
    return new Promise((resolve) => {
        page.on("response", async (response) => {
            const url = response.url();
            const status = response.status();

            if (url.includes(key) && status === 200) {
                console.log(`✅ Request detected: ${url} (Status: ${status})`);
                const text = await response.text();
                resolve(text);
            }
        });
    });
}

// Parses XML response into JSON
function parseXmlToJson(xmlString) {
    try {
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@",
        });

        const jsonResponse = parser.parse(xmlString);
        // console.log("XML → JSON:", JSON.stringify(jsonResponse, null, 2));
        return jsonResponse;
    } catch (error) {
        console.error("❌ Error parsing XML:", error.message);
        return null;
    }
}

// Multi Requests
// await waitForMultipleRequests(page, ["connect?", "reconnect?"]);
async function waitForMultipleRequests(page, keys) {
    return Promise.all(keys.map(key => waitForNetworkRequest(page, key)));
}


function extractValueFromXml(xmlString, attributeName) {
    const parser = new XMLParser({ ignoreAttributes: false });
    const jsonObj = parser.parse(xmlString);

    // Рекурсивный поиск атрибута в JSON-структуре
    function findAttribute(obj, key) {
        if (obj && typeof obj === "object") {
            if (obj.hasOwnProperty(key)) {
                return obj[key];
            }
            for (const prop in obj) {
                const result = findAttribute(obj[prop], key);
                if (result) return result;
            }
        }
        return null;
    }

    return findAttribute(jsonObj, `@_${attributeName}`);
}

async function waitForMultipleRequestsAttribut(page, keys, attributeName) {
    return new Promise((resolve) => {
        let lastValue = null;

        page.on("response", async (response) => {
            const url = response.url();
            const status = response.status();

            for (const key of keys) {
                if (url.includes(key) && status === 200) {
                    const text = await response.text();
                    lastValue = extractValueFromXml(text, attributeName);
                    
                    if (lastValue) {
                        console.log(`✅ Extracted ${attributeName}: ${lastValue}`);
                        resolve(lastValue);
                    }
                }
            }
        });
    });
}

function generateR() {
    const timestamp = Date.now(); // Получаем текущий таймстамп в миллисекундах
    const randomValue = Math.floor(Math.random() * 1000000); // Генерируем случайное число
  
    return timestamp + randomValue; // Склеиваем таймстамп и случайное число
  }

/**
 * Sends a POST request to the game server and waits for a 200 response.
 * @param {Object} config - Configuration object.
 * @param {string} session - Session ID from the test.
 * @param {string} gameId - Game ID from the config.
 *  @param {string} value - Shift value from the config (will be encoded).
 */
async function sendPostRequest(config, session, gameId, value) {
    const r = generateR();
    const rnd = generateR();
    const url = `${config.shifter.serverUrl}/pool?r=${r}&wlCode=${config.shifter.wlCode}&partnerId=${config.shifter.partnerId}`;

    const postData = `
        <client rnd="${rnd}" session="${session}" command="pool">
            <game id="${gameId}">
                <shift clear="true" value="${value}"></shift>
            </game>
        </client>
    `.trim();

    try {
        const response = await axios.post(url, postData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "text/plain",
            },
        });

        console.log(`✅ POST request successful: ${url}`);
        return response.data;
    } catch (error) {
        console.error(`❌ POST request failed: ${url} (Status: ${error.response?.status || "unknown"})`);
        throw error;
    }
}

/**
 * Executes a POST request for a specific game with a given value.
 * @param {Object} page - Playwright page object (если не нужен, можно удалить).
 * @param {Object} config - Configuration object.
 * @param {string} session - Session ID from the test.
 * @param {string} gameName - Game name (может содержать "_mob").
 * @param {string} value - Value string for the request.
 */
async function executePostRequest(page, config, session, value) {
    let gameId = '';
    if (config.gameName.indexOf('_mob') != -1) {
        gameId = config.gameName.substring(0, config.gameName.length - 4); // Убираем _mob
    } else { 
        gameId = config.gameName;
    }
   
    try {
        const responseText = await sendPostRequest(config, session, gameId, value);
        console.log(`📨 Server Response for ${gameId} | Value: ${value}:`, responseText);
        return responseText;
    } catch (error) {
        console.error(`❌ POST Request Failed for ${gameId} | Value: ${value}:`, error);
    }
}

module.exports = { executePostRequest, sendPostRequest, waitForNetworkRequest, parseXmlToJson, waitForMultipleRequests, waitForMultipleRequestsAttribut };
