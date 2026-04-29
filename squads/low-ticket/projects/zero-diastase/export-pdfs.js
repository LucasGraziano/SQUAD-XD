/**
 * export-pdfs.js — Zero Diastasis™
 * Converte todos os 9 entregáveis HTML → PDF (A4, print-ready)
 *
 * COMO USAR:
 *   1. npm install puppeteer   (só na primeira vez)
 *   2. node export-pdfs.js
 *
 * OUTPUT: squads/low-ticket/projects/zero-diastase/materiais/Documentos existentes/PDFs/
 */

const puppeteer = require('puppeteer');
const path      = require('path');
const fs        = require('fs');

const INPUT_DIR  = path.resolve(__dirname, 'materiais/Documentos existentes/Entregaveis');
const OUTPUT_DIR = path.resolve(__dirname, 'materiais/Documentos existentes/PDFs');

// Mapeamento de nomes de arquivo → nomes de exibição (para o log)
const DISPLAY_NAMES = {
  'el-desbloqueo.html'        : 'Módulo 1 — El Desbloqueo',
  'guia-modulo-2 (1).html'    : 'Módulo 2 — Reconexión',
  'guia-modulo-3.html'        : 'Módulo 3 — Compresión',
  'guia-modulo-4.html'        : 'Módulo 4 — Anclaje Total',
  'guia-modulo-5.html'        : 'Módulo 5 — Cierre Total',
  'stack-360.html'            : 'Bônus — Stack 360°',
  'vacuum-master.html'        : 'Bônus — Vacuum Master',
  'tracker-28-dias.html'      : 'Bônus — Tracker 28 Días',
  'pack-recetas.html'         : 'Order Bump — Pack de Recetas',
};

async function exportPDFs() {
  // Criar pasta de output se não existir
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const htmlFiles = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.html'));

  if (htmlFiles.length === 0) {
    console.error('❌ Nenhum arquivo .html encontrado em:', INPUT_DIR);
    process.exit(1);
  }

  console.log(`\n🖨️  Zero Diastasis™ — Export PDF`);
  console.log(`📂 Input:  ${INPUT_DIR}`);
  console.log(`📂 Output: ${OUTPUT_DIR}`);
  console.log(`📄 ${htmlFiles.length} arquivos encontrados\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let success = 0;
  let failed  = 0;

  for (const file of htmlFiles) {
    const displayName = DISPLAY_NAMES[file] || file.replace('.html', '');
    const inputPath   = path.join(INPUT_DIR, file);
    const outputName  = file.replace('.html', '.pdf').replace(' (1)', '');
    const outputPath  = path.join(OUTPUT_DIR, outputName);

    try {
      const page = await browser.newPage();

      // Viewport A4 em 96dpi
      await page.setViewport({ width: 794, height: 1123 });

      // Carregar o arquivo HTML (usa file:// para acesso local)
      await page.goto(`file:///${inputPath.replace(/\\/g, '/')}`, {
        waitUntil: 'networkidle0',  // espera fontes do Google carregarem
        timeout: 30000,
      });

      // Aguardar 1s extra para fontes e animações carregarem
      await new Promise(r => setTimeout(r, 1000));

      // Exportar como PDF A4
      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        preferCSSPageSize: true, // respeita o @page do CSS
      });

      await page.close();

      console.log(`  ✅  ${displayName}`);
      console.log(`       → ${outputName}`);
      success++;

    } catch (err) {
      console.error(`  ❌  ${displayName} — ERRO: ${err.message}`);
      failed++;
    }
  }

  await browser.close();

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✨ ${success}/${htmlFiles.length} PDFs exportados com sucesso`);
  if (failed > 0) {
    console.log(`⚠️  ${failed} arquivo(s) falharam — verifique o log acima`);
  }
  console.log(`📁 PDFs em: ${OUTPUT_DIR}\n`);
}

exportPDFs().catch(err => {
  console.error('❌ Erro fatal:', err.message);
  process.exit(1);
});
