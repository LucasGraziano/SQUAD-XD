const { execSync } = require('child_process');
const path = require('path');

const stories = [
  'ad-antes-depois-1080x1920',
  'ad-hook-frustrada-1080x1920',
  'ad-espejo-1080x1920',
  'ad-esperanca-1080x1920',
  'ad-mama-real-1080x1920',
];

async function main() {
  for (const name of stories) {
    console.log(`\n🚀 Starting: ${name}`);
    execSync(`node record-creative.js ${name}`, {
      cwd: __dirname,
      stdio: 'inherit',
      timeout: 300000,
    });
  }
  console.log('\n✅ All stories recorded!');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
