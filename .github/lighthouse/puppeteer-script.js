module.exports = async (browser, context) => {
	const page = await browser.newPage();
	await page.goto('http://localhost:3000/');
	await page.type('#emailLoginInput', 'admin');
	await page.type('#passwordLoginInput', 'test');
	await page.click('[type="submit"]');
	await page.waitForNavigation();
};