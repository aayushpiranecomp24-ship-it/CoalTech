import puppeteer from 'puppeteer-core';

async function testLaunch() {
  const executablePath = 'C:\\Program Files\\Google\Chrome\\Application\\chrome.exe';
  console.log('Testing launch with executable:', executablePath);

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  const title = await page.title();
  console.log('Successfully connected! Page title:', title);

  await browser.close();
  console.log('Browser test connection successful.');
}

testLaunch().catch((err) => {
  console.error('Launch test error:', err);
  process.exit(1);
});
