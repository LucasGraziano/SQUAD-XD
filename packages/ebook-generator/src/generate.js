const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const OUTPUT_DIR = path.join(__dirname, '..', 'output');

/**
 * Generate a professional PDF from HTML content using Zero Diastasis brand identity.
 *
 * @param {object} options
 * @param {string} options.contentHtml - The inner HTML content (pages)
 * @param {string} options.title - Document title
 * @param {string} options.outputName - Output filename (without .pdf)
 * @param {string} [options.template] - Template name (default: zero-diastasis)
 * @param {boolean} [options.preview] - If true, saves HTML instead of PDF
 */
async function generatePDF({ contentHtml, title, outputName, template = 'zero-diastasis', preview = false }) {
  // Load template
  const templatePath = path.join(TEMPLATES_DIR, `${template}.html`);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  let html = fs.readFileSync(templatePath, 'utf-8');
  html = html.replace('{{TITLE}}', title);
  html = html.replace('{{CONTENT}}', contentHtml);

  // Ensure output dir
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  if (preview) {
    const htmlPath = path.join(OUTPUT_DIR, `${outputName}.html`);
    fs.writeFileSync(htmlPath, html, 'utf-8');
    console.log(`Preview saved: ${htmlPath}`);
    return htmlPath;
  }

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for fonts to load
  await page.evaluateHandle('document.fonts.ready');

  const pdfPath = path.join(OUTPUT_DIR, `${outputName}.pdf`);
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true
  });

  await browser.close();
  console.log(`PDF generated: ${pdfPath}`);
  return pdfPath;
}

module.exports = { generatePDF };
