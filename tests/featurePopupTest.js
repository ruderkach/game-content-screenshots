const { ensureScreenshotFolder, takeDeviceScreenshots } = require("../utils/screenshotUtils");
const { pressKey } = require("../utils/keyboardUtils");
const { openGamePage } = require("../utils/gameUtils");
const { waitForMultipleRequests, executePostRequest, waitForMultipleRequestsAttribut } = require("../utils/networkUtils");

async function featurePopupTest(page, lang, config) {
    console.log(`🚀 Running Feature Popup Test for ${config.gameName} in ${lang}`);

    const testName = "featurePopupTest"; // Имя теста

    await openGamePage(page, config, lang);
    const session = await waitForMultipleRequestsAttribut(page, ["connect?", "reconnect?"], "session");
    await page.waitForLoadState("networkidle");

    await pressKey(page, "Space");

    const responseText = await executePostRequest(page, config, session, config.shifts.startBonus);

    if (responseText.includes('status="ok"')) {
        console.log("✅ POST request completed with status OK, proceeding...");
        
        await pressKey(page, "Enter");

        await waitForMultipleRequests(page, ["bet?"]);

        await page.waitForTimeout(10000);
        ensureScreenshotFolder(lang);  
        await takeDeviceScreenshots(page, config.gameName, lang, config.iPadMini, testName);
        await takeDeviceScreenshots(page, config.gameName, lang, config.galaxyZFold5, testName);


    } else {
        console.error("❌ POST request did not return status OK. Test aborted.");
    }
}

module.exports = { featurePopupTest };