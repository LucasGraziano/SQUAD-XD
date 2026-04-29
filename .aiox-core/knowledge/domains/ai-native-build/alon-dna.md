---
expert: alon
domain: ai-native-build
dna_version: v3
tokens: 420
updated: 2026-04-29
source: "Transcrição: Pare de Queimar Tokens com Design (Alon)"
---

# Alon — DNA v3 (Design Tokens)

## L1: Filosofias Fundamentais

1. **Tokens = dinheiro. DESIGN.md = investimento** — Cada sessão sem DESIGN.md, você paga para a IA reaprender o estilo do seu produto do zero. Um arquivo criado uma vez economiza para sempre.

2. **Design tokens antes de gerar UI** — A IA não "entende" seu design. Ela precisa de variáveis explícitas: hex exatos, família de fonte, escala, espaçamento. Design tokens são a linguagem da IA para UI.

3. **Edição direta > prompting** — Quando você sabe o que quer mudar (cor, fonte, tamanho), edite o código diretamente no Cloud Design/VS Code. Não gaste tokens pedindo para a IA fazer pequenas edições.

## L2: Modelos Mentais

- **DESIGN.md como briefing permanente**: igual a dar um briefing de marca para um designer novo antes de cada sessão, mas automático.
- **Google Stitch como rascunho**: Stitch gera DESIGN.md editável. Não entregar o output bruto — usar como base para refinamento.
- **Cloud Design vs Claude Code**: Cloud Design tem token próprio (não consome o token do Code). Usar Cloud Design para explorar, Code para implementar.
- **Tokenização de identidade visual**: transformar brand-guidelines.md em DESIGN.md é o processo de tokenizar a identidade visual para IA.

## L3: Heurísticas Operacionais

1. **Sempre HEX, nunca nome de cor** — "teal" é ambíguo. `#1A4A5A` é determinístico.
2. **Escala tipográfica completa** — Não só a fonte: tamanho + peso + line-height + letter-spacing por nível
3. **Motion tokens explícitos** — `--transition-fast: 150ms ease-out` evita animações genéricas
4. **Voice tokens** — Palavras proibidas e exemplos de copy definem o tom sem ambiguidade
5. **Anti-patterns explícitos** — "NUNCA usar border-radius > 16px" é mais efetivo que "use estilo minimalista"

## L4: Frameworks Práticos

### Framework: DESIGN.md Construction Protocol
```
Seção 1: Visual Theme & Atmosphere (parágrafo descritivo)
Seção 2: Color Palette & Roles (hex + uso)
Seção 3: Typography (família + escala completa)
Seção 4: Spacing System (base unit + escala)
Seção 5: Border System (largura + radius)
Seção 6: Shadow System (layers + opacidade)
Seção 7: Motion & Animation (tokens + regras)
Seção 8: Component Tokens (botões, inputs, cards)
Seção 9: Icons (sistema + tamanhos)
Seção 10: Voice & Copy (palavras + anti-patterns)
Seção 11: Accessibility (contraste + focus)
```

### Framework: Design Library Setup
```
1. npm install -g getdesign (ou npx)
2. getdesign list → ver 70 brands disponíveis
3. getdesign add {brand} --out ./path/DESIGN.md
4. Para múltiplos: bash scripts/install-design-library.sh
5. Organizar por categoria em _INDEX.md
6. Criar skill design-aware-ui para auto-carregar
```

### Framework: AI Slop Prevention Checklist
```
Antes de aceitar qualquer UI gerada por IA:
□ Cores são apenas da paleta do DESIGN.md?
□ Fontes são apenas as especificadas?
□ Border-radius segue a escala?
□ Sombras são sutis (shadow-sm/md, nunca xl em cards simples)?
□ Não tem gradiente em background de seção?
□ Não tem bento grid com bordas brilhantes?
□ Motion está dentro dos tokens de animação?
□ Copy não usa palavras proibidas?
```

## L5: Metodologias Avançadas

**Método: Brand → DESIGN.md Pipeline**
```
INPUT: brand-guidelines.md (cores, tipografia, voice)
         ↓
PROCESS: Mapear cada elemento para token CSS
         - cores → --color-* variáveis com hex
         - fontes → --font-* com família + fallbacks
         - espaçamento → --space-* com base unit
         - motion → --transition-* com ms + easing
         - voice → tabela de exemplos + anti-patterns
         ↓
OUTPUT: DESIGN.md completo (~500-800 tokens)
         ↓
USE: IA lê DESIGN.md antes de qualquer geração de UI
```

**Quanto isso economiza:**
Sem DESIGN.md: IA gera UI genérica → retrabalho 2-5 iterações → ~2000 tokens extras
Com DESIGN.md: IA gera UI alinhada → 0-1 iteração → ~0 tokens extras
ROI: 1 hora para criar DESIGN.md, economiza horas por projeto
