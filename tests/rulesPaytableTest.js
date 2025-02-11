const { takeScreenshot } = require("../utils/screenshotUtils");
const { pressKey } = require("../utils/keyboardUtils");
const { openGamePage } = require("../utils/gameUtils");
const { waitForMultipleRequests } = require("../utils/networkUtils");

async function rulesPaytableTest(page, lang, config) {
    console.log(`🚀 Running Rules Paytable Test for ${config.gameName} in ${lang}`);

    const testName = "rulesPaytableTest"; // Имя теста

    await openGamePage(page, config, lang);
    await waitForMultipleRequests(page, ["connect?", "reconnect?"]);
    await page.waitForLoadState("networkidle");
    await pressKey(page, "Space");
    await page.waitForLoadState("networkidle");
    await pressKey(page, "i");
    
    await page.setViewportSize({ width: config.paytableSize.width, height: config.paytableSize.height });
    // await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    await takeScreenshot(page, config, lang, testName) ;
}

module.exports = { rulesPaytableTest };