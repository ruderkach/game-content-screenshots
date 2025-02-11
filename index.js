const { chromium } = require("playwright");
const fs = require("fs-extra");
const path = require("path");

const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));
// const { openGamePage } = require("./utils/gameUtils");

// 📌 Автоматически загружаем все тесты из папки `tests/`
async function loadTests() {
    const testFiles = fs.readdirSync(path.join(__dirname, "tests"))
        .filter(file => file.endsWith(".js"));

    const tests = {};
    for (const file of testFiles) {
        const testModule = require(`./tests/${file}`);
        Object.assign(tests, testModule);
    }
    return tests;
}

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    const tests = await loadTests(); // Загружаем все тесты

    const testToRun = process.argv[2]; // Можно передать название теста через аргумент  
    
    for (const lang of config.languages) {
        // await openGamePage(page, config, gameName, lang);    
        for (const [testName, testFn] of Object.entries(tests)) {
            if (!testToRun || testToRun === testName) {
                console.log(`🚀 Running test: ${testName}`);
                await testFn(page, lang, config);
            }
        }
    }   
    await browser.close();
    console.log("✅ All tests completed!");
})();
