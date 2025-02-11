
// Pressing key
async function pressKey(page, keys) {
    console.log(`Pressing key(s): ${keys}`);

    if (Array.isArray(keys)) {
        for (const key of keys) {
            await page.keyboard.down(key);
        }
        for (const key of keys) {
            await page.keyboard.up(key);
        }
    } else {
        await page.keyboard.press(keys);
    }

    console.log(`Key(s) pressed: ${keys}`);
}

module.exports = { pressKey };