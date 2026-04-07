const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function extractFrame(htmlFile, width, height, delaySec = 3) {
  const baseName = path.basename(htmlFile, '.html');
  const outputDir = path.join(__dirname, 'first-frames');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputPng = path.join(outputDir, `${baseName}-thumb.png`);
  const filePath = path.resolve(htmlFile);
  const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`;

  console.log(`📸 Capturing: ${baseName} at ${delaySec}s`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);

  // Wait for animations to reach desired point
  await new Promise(r => setTimeout(r, delaySec * 1000));

  await page.screenshot({ path: outputPng, type: 'png' });
  await browser.close();

  console.log(`   ✅ Saved: ${outputPng}`);
  return outputPng;
}

async function main() {
  const ads = [
    { file: 'ad-antes-depois-1080x1080.html', w: 1080, h: 1080, t: 3 },
    { file: 'ad-hook-frustrada-1080x1080.html', w: 1080, h: 1080, t: 3 },
    { file: 'ad-espejo-1080x1080.html', w: 1080, h: 1080, t: 3 },
    { file: 'ad-esperanca-1080x1080.html', w: 1080, h: 1080, t: 3 },
    { file: 'ad-mama-real-1080x1080.html', w: 1080, h: 1080, t: 4 },
    { file: 'ad-antes-depois-1080x1920.html', w: 1080, h: 1920, t: 3 },
    { file: 'ad-hook-frustrada-1080x1920.html', w: 1080, h: 1920, t: 3 },
    { file: 'ad-espejo-1080x1920.html', w: 1080, h: 1920, t: 3 },
    { file: 'ad-esperanca-1080x1920.html', w: 1080, h: 1920, t: 3 },
    { file: 'ad-mama-real-1080x1920.html', w: 1080, h: 1920, t: 4 },
  ];

  for (const { file, w, h, t } of ads) {
    await extractFrame(path.join(__dirname, file), w, h, t);
  }

  console.log('\n✅ All first-frames extracted!');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
