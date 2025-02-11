const fs = require("fs");
const path = require("path");

// Проверяем и создаем папку перед скриншотом
function ensureScreenshotFolder(lang) {
    const folderPath = path.join("screenshots", lang);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}

// Takes a screenshot in the specified orientation
async function takeScreenshot(page, config, lang, testName) {
    // Создаем папку для скриншотов, если ее нет
    ensureScreenshotFolder(lang);
    
    await page.screenshot({ path: `screenshots/${lang}/${config.gameName}_${lang}_${testName}.png` });
}

// Takes a screenshot
async function takeDeviceScreenshots(page, config, lang, device, testName) {
    // Создаем папку для скриншотов, если ее нет
    ensureScreenshotFolder(lang);

    const folderPath = `screenshots/${lang}`;

    // Portrait screenshot
    await page.setViewportSize({ width: device.width, height: device.height });
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${folderPath}/${config.gameName}_${lang}_${testName}_${device.name}_portrait.png` });

    // Landscape screenshot
    await page.setViewportSize({ width: device.height, height: device.width });
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${folderPath}/${config.gameName}_${lang}_${testName}_${device.name}_landscape.png` });
}

module.exports = { ensureScreenshotFolder, takeScreenshot, takeDeviceScreenshots };