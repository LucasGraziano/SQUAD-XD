/**
 * Generate images for Zero Diastasis site using OpenAI DALL-E 3
 * Usage: node scripts/generate-images.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.OPENAI_API_KEY;
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images');

const images = [
  {
    name: 'hero-mama.webp',
    prompt: `Professional lifestyle photography of a confident Latina mother in her early 30s, warm natural smile, wearing a comfortable cream-colored fitted top, standing in a bright sunlit living room with warm tones. Soft golden hour lighting, shallow depth of field. She looks empowered and relaxed. The aesthetic is warm, nurturing, editorial quality like Ritual vitamins or Calm app branding. Color palette: warm whites (#FFFAF5), soft pinks, and cream tones. No text overlays.`,
    size: '1024x1792',
    quality: 'hd',
  },
  {
    name: 'product-mockup.webp',
    prompt: `Clean product mockup on a soft cream/warm white background (#FFFAF5): an iPad showing an elegant ebook cover with the title "Zero Diastasis" in serif font, next to an iPhone displaying a minimal audio player interface with a play button and waveform, and a small printed progress tracker card with checkboxes. Soft shadows, premium feel, editorial product photography style. Warm tones, blush pink (#D4A5A5) and gold (#A8893E) accent colors. Minimal, Apple-like aesthetic. No hands, no people.`,
    size: '1792x1024',
    quality: 'hd',
  },
  {
    name: 'mechanism-breathing.webp',
    prompt: `Lifestyle photography of a young Latina woman doing a gentle breathing exercise, lying on a yoga mat in her cozy living room. Her hands rest softly on her lower abdomen, eyes peacefully closed. She wears comfortable neutral-toned athleisure. Warm ambient lighting, soft focus background with houseplants and natural wood. The mood is calm, gentle, and nurturing — not athletic or intense. Color palette: warm cream, soft blush pink, natural wood tones. Editorial wellness style similar to Calm or Headspace imagery. No text.`,
    size: '1024x1024',
    quality: 'hd',
  },
  {
    name: 'og-image.webp',
    prompt: `Social media card design with warm cream background (#FFFAF5). Left side: elegant serif text "Tu barriga de mamá NO es gordura. Es un músculo dormido." in dark brown (#2D2D2D). Right side: a soft abstract organic shape in blush pink (#D4A5A5) with gold (#A8893E) accents. Bottom: small text "Zero Diastasis™ — Protocolo de 28 días". Premium, minimal, editorial feel. The design should look like a high-end wellness brand social media post.`,
    size: '1792x1024',
    quality: 'hd',
  },
];

async function generateImage(imageConfig) {
  console.log(`\n🎨 Generating: ${imageConfig.name}...`);

  const body = JSON.stringify({
    model: 'dall-e-3',
    prompt: imageConfig.prompt,
    n: 1,
    size: imageConfig.size,
    quality: imageConfig.quality || 'standard',
    response_format: 'url',
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.openai.com',
        path: '/v1/images/generations',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', async () => {
          if (res.statusCode !== 200) {
            console.error(`❌ Error for ${imageConfig.name}: ${res.statusCode}`);
            console.error(data);
            reject(new Error(`API error ${res.statusCode}`));
            return;
          }

          try {
            const json = JSON.parse(data);
            const imageUrl = json.data[0].url;
            const revisedPrompt = json.data[0].revised_prompt;
            console.log(`✅ Generated! Revised prompt: ${revisedPrompt?.substring(0, 100)}...`);

            // Download the image
            const outputPath = path.join(OUTPUT_DIR, imageConfig.name);
            await downloadImage(imageUrl, outputPath);
            console.log(`💾 Saved to: ${outputPath}`);
            resolve(outputPath);
          } catch (err) {
            reject(err);
          }
        });
      }
    );

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(outputPath);
    https.get(url, (res) => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, (redirectRes) => {
          redirectRes.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        });
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

async function main() {
  if (!API_KEY) {
    console.error('❌ OPENAI_API_KEY not set. Run with: OPENAI_API_KEY=... node scripts/generate-images.js');
    process.exit(1);
  }

  console.log('🚀 Zero Diastasis Image Generator');
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`📷 Images to generate: ${images.length}`);

  for (const img of images) {
    try {
      await generateImage(img);
    } catch (err) {
      console.error(`❌ Failed: ${img.name} — ${err.message}`);
    }
    // Small delay between requests to avoid rate limits
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log('\n✨ Done! Check public/images/ for the generated images.');
}

main();
