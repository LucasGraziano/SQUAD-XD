/**
 * check-design-md.js — PreToolUse hook
 * Warns when writing UI files without a DESIGN.md in the squad directory.
 * Only triggers on .tsx/.jsx/.css/.html files inside squads/*/app/
 */

let input = '';
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const filePath = data.tool_input?.file_path || '';

    // Only check for UI files inside squads/**/app/
    const isUiFile = /squads[\\/][^\\/]+[\\/].*\.(tsx|jsx|css|html|vue|svelte)$/.test(filePath);
    if (!isUiFile) {
      process.stdout.write(JSON.stringify({ suppressOutput: true }));
      return;
    }

    // Find squad root (squads/{name}/)
    const squadMatch = filePath.match(/(squads[\\/][^\\/]+)/);
    if (!squadMatch) {
      process.stdout.write(JSON.stringify({ suppressOutput: true }));
      return;
    }

    const path = require('path');
    const fs = require('fs');

    const squadRoot = squadMatch[1];
    const projectRoot = filePath.substring(0, filePath.indexOf(squadRoot));
    const designMdPath = path.join(projectRoot, squadRoot, 'app', 'DESIGN.md');
    const brandGuidePath = path.join(projectRoot, squadRoot, 'docs', 'brand', 'brand-guidelines.md');

    if (!fs.existsSync(designMdPath)) {
      const hasBrandGuide = fs.existsSync(brandGuidePath);
      const msg = hasBrandGuide
        ? `DESIGN.md não encontrado em ${squadRoot}/app/. Brand-guidelines existe em docs/brand/ — considere criar DESIGN.md antes de gerar UI para garantir consistência visual.`
        : `DESIGN.md não encontrado em ${squadRoot}/app/. Sem tokens de design, a IA gerará UI genérica. Crie DESIGN.md primeiro ou use npx getdesign@latest como base.`;

      process.stdout.write(JSON.stringify({
        systemMessage: `⚠️ ${msg}`
      }));
    } else {
      process.stdout.write(JSON.stringify({ suppressOutput: true }));
    }
  } catch {
    process.stdout.write(JSON.stringify({ suppressOutput: true }));
  }
});
