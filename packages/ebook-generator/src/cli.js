#!/usr/bin/env node
const { Command } = require('commander');
const { generatePDF } = require('./generate');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .name('ebook-gen')
  .description('Generate professional ebooks/PDFs with Zero Diastasis brand identity')
  .version('1.0.0');

program
  .command('build <input>')
  .description('Build PDF from HTML content file')
  .option('-t, --title <title>', 'Document title', 'Zero Diastasis')
  .option('-o, --output <name>', 'Output filename (without .pdf)')
  .option('--preview', 'Save as HTML instead of PDF')
  .option('--template <name>', 'Template name', 'zero-diastasis')
  .action(async (input, opts) => {
    try {
      const inputPath = path.resolve(input);
      if (!fs.existsSync(inputPath)) {
        console.error(`File not found: ${inputPath}`);
        process.exit(1);
      }

      const contentHtml = fs.readFileSync(inputPath, 'utf-8');
      const outputName = opts.output || path.basename(input, path.extname(input));

      const result = await generatePDF({
        contentHtml,
        title: opts.title,
        outputName,
        template: opts.template,
        preview: opts.preview
      });

      console.log(`Done: ${result}`);
    } catch (err) {
      console.error('Error:', err.message);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List available content files')
  .action(() => {
    const contentDir = path.join(__dirname, '..', 'content');
    if (!fs.existsSync(contentDir)) {
      console.log('No content directory found. Create content/ with HTML files.');
      return;
    }
    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.html'));
    console.log('Available content:');
    files.forEach(f => console.log(`  - ${f}`));
  });

program.parse();
