# /ebook - Gerador de Ebooks Profissionais

Gera ebooks/PDFs com qualidade profissional usando a identidade visual do Zero Diastasis.

## Uso

```
/ebook modulo-1          # Gerar Modulo 1: El Desbloqueo (16pp)
/ebook modulo-2          # Gerar Modulo 2: Reconexion (8pp)
/ebook modulo-3          # Gerar Modulo 3: Compresion (8pp)
/ebook modulo-4          # Gerar Modulo 4: Anclaje (10pp)
/ebook tracker           # Gerar Tracker de 28 Dias (2pp)
/ebook bonus-stack       # Gerar Bonus: Stack 360 (12pp)
/ebook bonus-vacuum      # Gerar Bonus: Vacuum Master (8pp)
/ebook custom "Titulo"   # Gerar ebook custom com titulo
```

## Execucao

### 1. Identificar o modulo

Mapear o argumento para o conteudo:

| Argumento | Conteudo HTML | Status |
|-----------|--------------|--------|
| `modulo-1` | `packages/ebook-generator/content/modulo-1-el-desbloqueo.html` | PRONTO |
| `modulo-2` | `packages/ebook-generator/content/modulo-2-reconexion.html` | A criar |
| `modulo-3` | `packages/ebook-generator/content/modulo-3-compresion.html` | A criar |
| `modulo-4` | `packages/ebook-generator/content/modulo-4-anclaje.html` | A criar |
| `tracker` | `packages/ebook-generator/content/tracker-28-dias.html` | A criar |
| `bonus-stack` | `packages/ebook-generator/content/bonus-stack-360.html` | A criar |
| `bonus-vacuum` | `packages/ebook-generator/content/bonus-vacuum-master.html` | A criar |

### 2. Se o conteudo HTML nao existir

Gerar o conteudo automaticamente:

1. Ler a estrutura do modulo em `squads/low-ticket/projects/zero-diastase/pipeline-output-v2/phase4-product/product-blueprint.md`
2. Executar `/research {topico do modulo}` para buscar evidencias cientificas atualizadas
3. Escrever o conteudo em espanhol neutro (LATAM), seguindo:
   - Tom: amiga experiente, calorosa, empática, direta
   - Linguagem: 2a pessoa (tu), nunca formal (usted)
   - Base cientifica: TODA afirmacao deve ter evidencia
   - Escrita autoral: reescrever com voz propria, nunca copiar textos
   - Usar componentes visuais do template: callout, evidence, step, highlight, pillar-card, etc.
4. Salvar em `packages/ebook-generator/content/{nome}.html`

### 3. Gerar o PDF

```bash
cd packages/ebook-generator
node src/cli.js build content/{nome}.html -t "{titulo}" -o {nome}
```

### 4. Gerar preview HTML (opcional)

```bash
node src/cli.js build content/{nome}.html -t "{titulo}" -o {nome} --preview
```

### 5. Informar ao usuario

```
Ebook gerado com sucesso!

PDF: packages/ebook-generator/output/{nome}.pdf
Preview: packages/ebook-generator/output/{nome}.html ({N} paginas)

Para abrir o preview no navegador:
  start packages/ebook-generator/output/{nome}.html
```

### Regras de conteudo

- **Sem plagio:** Todo conteudo deve ser escrito de forma autoral
- **Base cientifica:** Citar estudos reais (autor, ano, journal)
- **Compliance:** Nunca usar "cura", "tratamento", "garantia de resultado"
- **Linguagem:** Espanhol neutro LATAM, 2a pessoa informal (tu)
- **Brand voice:** "Tu cuerpo no necesita fuerza. Necesita reprogramacion."

### Identidade visual

Definida no template `packages/ebook-generator/templates/zero-diastasis.html`:
- Playfair Display (headlines) + Inter (body)
- Coral #E8837C, Branco Quente #FFF8F5, Verde Menta #7ECEC1
- Callout boxes (science, warning, default)
- Evidence boxes com citacoes
- Progress bars, tracker grid, pillar cards
- Step-by-step numerado
- Tabelas com header coral

---
*AIOX Productivity — Ebook Generator Command*
