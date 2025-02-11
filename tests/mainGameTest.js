const { takeDeviceScreenshots } = require("../utils/screenshotUtils");
const { waitForMultipleRequests } = require("../utils/networkUtils");
const { pressKey } = require("../utils/keyboardUtils");
const { openGamePage } = require("../utils/gameUtils");

async function mainGameTest(page, lang, config) {
    console.log(`🚀 Running Main Game Test for ${config.gameName} in ${lang}`);

    const testName = "mainGameTest"; // Имя теста

    await openGamePage(page, config, lang);

    await waitForMultipleRequests(page, ["connect?", "reconnect?"]);
    await page.waitForLoadState("networkidle");
    await pressKey(page, "Space");
    
    await takeDeviceScreenshots(page, config, lang, config.iPadMini, testName);
    await takeDeviceScreenshots(page, config, lang, config.galaxyZFold5, testName);
}

module.exports = { mainGameTest };