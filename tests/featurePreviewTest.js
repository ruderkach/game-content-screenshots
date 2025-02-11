const { takeDeviceScreenshots } = require("../utils/screenshotUtils");
const { openGamePage } = require("../utils/gameUtils");
const { waitForMultipleRequests } = require("../utils/networkUtils");

async function featurePreviewTest(page, lang, config) {
    console.log(`🚀 Running Feature Preview Test for ${config.gameName} in ${lang}`);

    const testName = "featurePreviewTest"; // Имя теста

    // Открываем игру
    await openGamePage(page, config, lang);
    
    // Ожидание запросов "connect?" и "reconnect?"
    await waitForMultipleRequests(page, ["connect?", "reconnect?"]);

    // Используем цикл для всех устройств из config
    for (const device of [config.iPadMini, config.galaxyZFold5]) {
        await takeDeviceScreenshots(page, config, lang, device, testName);
    }

    // console.log(`✅ Feature Preview Test completed for ${config.gameName} in ${lang}`);
}

module.exports = { featurePreviewTest };
