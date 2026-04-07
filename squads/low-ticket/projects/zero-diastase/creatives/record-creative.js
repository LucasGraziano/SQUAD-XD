const puppeteer = require('puppeteer');
const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

async function recordCreative(htmlFile, width, height, durationSec = 6, fps = 30) {
  const baseName = path.basename(htmlFile, '.html');
  const framesDir = path.join(__dirname, `_frames_${baseName}`);
  const outputMp4 = path.join(__dirname, `${baseName}.mp4`);

  // Clean/create frames dir
  if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true });
  fs.mkdirSync(framesDir, { recursive: true });

  const totalFrames = durationSec * fps;
  const filePath = path.resolve(htmlFile);
  const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`;

  console.log(`\n🎬 Recording: ${baseName}`);
  console.log(`   ${width}x${height} | ${durationSec}s | ${fps}fps | ${totalFrames} frames`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });

  // Load page and wait for fonts
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);

  // Wait a tiny bit for initial render
  await new Promise(r => setTimeout(r, 300));

  // Capture frames
  for (let i = 0; i < totalFrames; i++) {
    const frameNum = String(i).padStart(5, '0');
    const framePath = path.join(framesDir, `frame_${frameNum}.png`);
    await page.screenshot({ path: framePath, type: 'png' });

    // Wait for next frame interval
    await new Promise(r => setTimeout(r, 1000 / fps));

    if ((i + 1) % fps === 0) {
      console.log(`   ⏱️  ${(i + 1) / fps}s / ${durationSec}s captured`);
    }
  }

  await browser.close();
  console.log(`   ✅ ${totalFrames} frames captured`);

  // FFmpeg: stitch frames into MP4
  console.log(`   🎞️  Encoding MP4...`);
  const ffmpegCmd = [
    'ffmpeg', '-y',
    '-framerate', String(fps),
    '-i', `"${path.join(framesDir, 'frame_%05d.png')}"`,
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'slow',
    '-crf', '18',
    '-vf', `scale=${width}:${height}`,
    `"${outputMp4}"`
  ].join(' ');

  execSync(ffmpegCmd, { stdio: 'inherit' });

  // Cleanup frames
  fs.rmSync(framesDir, { recursive: true });

  console.log(`   🎬 Saved: ${outputMp4}\n`);
  return outputMp4;
}

async function main() {
  const creatives = [
    { file: path.join(__dirname, 'el-precio-story-1080x1920.html'), w: 1080, h: 1920, dur: 14 },
    { file: path.join(__dirname, 'el-precio-square-1080x1080.html'), w: 1080, h: 1080, dur: 14 },
    { file: path.join(__dirname, 'no-es-tu-culpa-square-1080x1080.html'), w: 1080, h: 1080, dur: 12 },
    { file: path.join(__dirname, 'la-verdad-square-1080x1080.html'), w: 1080, h: 1080, dur: 10 },
    { file: path.join(__dirname, 'el-espejo-square-1080x1080.html'), w: 1080, h: 1080, dur: 12 },
    { file: path.join(__dirname, 'las-4-fases-square-1080x1080.html'), w: 1080, h: 1080, dur: 10 },
    { file: path.join(__dirname, 'la-garantia-square-1080x1080.html'), w: 1080, h: 1080, dur: 10 },
    { file: path.join(__dirname, 'los-numeros-square-1080x1080.html'), w: 1080, h: 1080, dur: 9 },
    { file: path.join(__dirname, 'las-4-fases-story-1080x1920.html'), w: 1080, h: 1920, dur: 10 },
    { file: path.join(__dirname, 'la-garantia-story-1080x1920.html'), w: 1080, h: 1920, dur: 10 },
    { file: path.join(__dirname, 'la-verdad-story-1080x1920.html'), w: 1080, h: 1920, dur: 10 },
    { file: path.join(__dirname, 'los-numeros-story-1080x1920.html'), w: 1080, h: 1920, dur: 9 },
    { file: path.join(__dirname, 'no-es-tu-culpa-story-1080x1920.html'), w: 1080, h: 1920, dur: 12 },
    { file: path.join(__dirname, 'el-espejo-story-1080x1920.html'), w: 1080, h: 1920, dur: 12 },
    { file: path.join(__dirname, 'la-verdad-35s-1080x1080.html'), w: 1080, h: 1080, dur: 35 },
    { file: path.join(__dirname, 'la-verdad-35s-1080x1920.html'), w: 1080, h: 1920, dur: 35 },
    { file: path.join(__dirname, 'ad-antes-depois-1080x1080.html'), w: 1080, h: 1080, dur: 20 },
    { file: path.join(__dirname, 'ad-hook-frustrada-1080x1080.html'), w: 1080, h: 1080, dur: 20 },
    { file: path.join(__dirname, 'ad-espejo-1080x1080.html'), w: 1080, h: 1080, dur: 20 },
    { file: path.join(__dirname, 'ad-esperanca-1080x1080.html'), w: 1080, h: 1080, dur: 20 },
    { file: path.join(__dirname, 'ad-mama-real-1080x1080.html'), w: 1080, h: 1080, dur: 20 },
    { file: path.join(__dirname, 'ad-antes-depois-1080x1920.html'), w: 1080, h: 1920, dur: 20 },
    { file: path.join(__dirname, 'ad-hook-frustrada-1080x1920.html'), w: 1080, h: 1920, dur: 20 },
    { file: path.join(__dirname, 'ad-espejo-1080x1920.html'), w: 1080, h: 1920, dur: 20 },
    { file: path.join(__dirname, 'ad-esperanca-1080x1920.html'), w: 1080, h: 1920, dur: 20 },
    { file: path.join(__dirname, 'ad-mama-real-1080x1920.html'), w: 1080, h: 1920, dur: 20 },
    { file: path.join(__dirname, 'ad-texto-bold-1080x1080.html'), w: 1080, h: 1080, dur: 10 },
    { file: path.join(__dirname, 'ad-texto-bold-1080x1920.html'), w: 1080, h: 1920, dur: 10 },
    { file: path.join(__dirname, 'ad-texto-abdominales-1080x1080.html'), w: 1080, h: 1080, dur: 10 },
    { file: path.join(__dirname, 'ad-texto-abdominales-1080x1920.html'), w: 1080, h: 1920, dur: 10 },
    { file: path.join(__dirname, 'ad-chat-screenshot-1080x1080.html'), w: 1080, h: 1080, dur: 15 },
    { file: path.join(__dirname, 'ad-chat-screenshot-1080x1920.html'), w: 1080, h: 1920, dur: 15 },
  ];

  // Allow selecting specific creative via CLI arg
  const arg = process.argv[2];
  const filtered = arg
    ? creatives.filter(c => path.basename(c.file).includes(arg))
    : creatives;

  if (filtered.length === 0) {
    console.log('No matching creative found. Available:');
    creatives.forEach(c => console.log(`  - ${path.basename(c.file)}`));
    return;
  }

  for (const { file, w, h, dur } of filtered) {
    await recordCreative(file, w, h, dur || 14, 30);
  }

  console.log('✅ All done!');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
