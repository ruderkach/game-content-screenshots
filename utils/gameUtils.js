const openGamePage = async (page, config, lang) => {
    const gameURL = `${config.baseUrl}&gameName=${config.gameName}&key=${config.apiKey}&lang=${lang}`;
    console.log(`Opening game: ${config.gameName} | Language: ${lang}`);
    await page.goto(gameURL);
};

module.exports = { openGamePage };
