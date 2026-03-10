'use strict';

const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');

/**
 * Ingestor for PDF files.
 * Uses pdf-parse to extract text content from PDF binary.
 */
async function ingestPdf(filePath) {
  const buffer = await fs.readFile(filePath);
  const data = await pdfParse(buffer);

  const name = path.basename(filePath, '.pdf');

  return {
    type: 'pdf',
    source: filePath,
    title: name,
    rawText: data.text,
    meta: {
      pages: data.numpages,
      info: data.info || {},
    },
  };
}

module.exports = { ingestPdf };
