const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

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
  await new Promise(r => setTimeout(r, 1500)); // Wait for fonts + render

  await page.screenshot({ path: outputPng, type: 'png' });
  await browser.close();
  console.log(`  ✅ ${path.basename(outputPng)}`);
}

async function main() {
  // 4-card carousel (compact version for Meta Ads)
  const cards = ['card-0-cover', 'card-A-fases12', 'card-B-fases34', 'card-5-cta'];

  // Square 1080x1080
  console.log('\n📸 Capturing SQUARE (1080x1080)...');
  for (const card of cards) {
    await captureCard(
      path.join(__dirname, `${card}-1080x1080.html`),
      path.join(__dirname, `${card}-1080x1080.png`),
      1080, 1080
    );
  }

  // Story 1080x1920
  console.log('\n📸 Capturing STORY (1080x1920)...');
  for (const card of cards) {
    await captureCard(
      path.join(__dirname, `${card}-1080x1920.html`),
      path.join(__dirname, `${card}-1080x1920.png`),
      1080, 1920
    );
  }

  console.log('\n✅ All carousel cards captured!');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
