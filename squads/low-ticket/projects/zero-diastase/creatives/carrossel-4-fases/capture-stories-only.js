const puppeteer = require('puppeteer');
const path = require('path');

async function captureCard(htmlFile, outputPng, width, height) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  const fileUrl = `file:///${path.resolve(htmlFile).replace(/\\/g, '/')}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: outputPng, type: 'png' });
  await browser.close();
  console.log(`  ✅ ${path.basename(outputPng)}`);
}

async function main() {
  const cards = ['card-A-fases12', 'card-B-fases34', 'card-5-cta'];
  console.log('\n📸 Capturing missing STORY PNGs (1080x1920)...');
  for (const card of cards) {
    await captureCard(
      path.join(__dirname, `${card}-1080x1920.html`),
      path.join(__dirname, `${card}-1080x1920.png`),
      1080, 1920
    );
  }
  console.log('\n✅ Done!');
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
