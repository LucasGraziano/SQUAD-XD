# Vínculo — Brand Guidelines

**Versão:** 1.0  
**Data:** Abril 2026  
**Agente:** @ux-design-expert (Uma)

---

## 1. Nome e Identidade

### Nome Oficial
**Vínculo**

### Tagline principal
> *"Você cuida das pessoas. A gente cuida de você."*

### Taglines alternativas por contexto
| Contexto | Tagline |
|---------|---------|
| Landing page hero | "Você cuida das pessoas. A gente cuida de você." |
| Comparativo | "A plataforma que entende de terapia, não só de gestão." |
| Feature killer | "Saiba antes que seu paciente vá embora." |
| Onboarding | "Bem-vindo ao seu consultório inteligente." |

### Pronuncia e escrita
- **Correto:** Vínculo (com acento no Í)
- **Em código/domínio:** vinculo (sem acento)
- **Nunca:** VÍNCULO (caixa alta fora do logo), vínculo (minúscula no início de frase)

---

## 2. Logotipo

### Conceito Visual
O logo de Vínculo nasce de uma ideia simples: **dois elementos que se conectam e se sustentam mutuamente** — exatamente como acontece na relação terapêutica.

```
Conceito do símbolo:
  ╭───╮  ╭───╮
  │ V │──│   │   Dois arcos que se tocam no centro
  ╰───╯  ╰───╯   formando uma âncora suave / vínculo

Wordmark:
  V í n c u l o
  ─────────────
  O "Í" com acento circunflexo vira um ícone standalone (•̂)
  que pode ser usado como favicon, app icon e marca d'água
```

### Variações do Logo

| Variação | Uso |
|---------|-----|
| **Horizontal completo** | Header do site, emails, materiais impressos |
| **Símbolo + nome empilhados** | App mobile, redes sociais (1:1) |
| **Símbolo isolado (Í)** | Favicon, app icon 32x32, marca d'água em documentos |
| **Wordmark apenas** | Assinatura de email, textos longos |

### Área de proteção
Espaço mínimo ao redor do logo = altura da letra "V" em todas as direções

### O que nunca fazer com o logo
- ❌ Rotacionar ou distorcer
- ❌ Aplicar sobre fundos que não contrastem (cinza médio)
- ❌ Usar cores fora da paleta oficial
- ❌ Adicionar sombra ou efeitos 3D
- ❌ Usar versão colorida sobre fotografia (sempre usar monocromático)

---

## 3. Paleta de Cores

### Filosofia de Cor
A paleta de Vínculo rejeita o azul hospitalar frio e o roxo clichê da psicologia. Escolhemos cores que comunicam **acolhimento inteligente** — quente o suficiente para o psicólogo confiar, sofisticado o suficiente para ser levado a sério.

### Cores Primárias

```
TEAL PROFUNDO (Primary Brand)
Hex: #1A4A5A
RGB: 26, 74, 90
HSL: 196°, 55%, 23%
Uso: CTAs principais, headers, elementos de destaque

AREIA QUENTE (Secondary Brand)
Hex: #F2E8DC
RGB: 242, 232, 220
HSL: 30°, 43%, 91%
Uso: backgrounds de seções, cards de destaque, hover states suaves

DOURADO SUTIL (Accent)
Hex: #B8955A
RGB: 184, 149, 90
HSL: 34°, 38%, 54%
Uso: badges premium, ícones especiais, hover em elementos Pro
```

### Cores Neutras

```
OFF-WHITE (Background principal)
Hex: #FAFAF8
Uso: Background do app, canvas

CINZA NÉVOA (Background cards)
Hex: #F4F4F2
Uso: Cards, inputs, sidebars

CINZA MÉDIO (Bordas e divisores)
Hex: #E2E2DE
Uso: Borders, separadores, placeholders

CINZA TEXTO SECUNDÁRIO
Hex: #6B7280
Uso: Labels, captions, textos de suporte

CARVÃO (Texto principal)
Hex: #1F2937
Uso: Corpo de texto, títulos de conteúdo
```

### Cores Semânticas

```
SUCESSO (Verde)
Hex: #2D7D4F
Uso: Pagamento confirmado, sessão realizada, status positivo

ATENÇÃO (Âmbar)
Hex: #D97706
Uso: Alertas médios, avisos, confirmações pendentes

RISCO (Vermelho-Quente — não agressivo)
Hex: #C0392B
Uso: Alerta de abandono CRÍTICO, erros, inadimplência grave

INFORMAÇÃO (Azul suave)
Hex: #2563EB
Uso: Links, informações neutras, badges informativos
```

### Modos de Aplicação

| Combinação | Contraste | Uso |
|-----------|----------|-----|
| Texto Carvão (#1F2937) sobre Off-White (#FAFAF8) | 16:1 ✓ AAA | Corpo de texto |
| Branco sobre Teal Profundo (#1A4A5A) | 8.5:1 ✓ AAA | CTAs |
| Carvão sobre Areia Quente (#F2E8DC) | 12:1 ✓ AAA | Cards de destaque |

---

## 4. Tipografia

### Filosofia Tipográfica
Dois pesos de trabalho: uma serifa humanista para **criar autoridade e acolhimento** nos títulos, uma sans-serif ultra-legível para **clareza e velocidade** no produto.

### Família Principal — DM Serif Display
```
Uso: Headlines (H1, H2), taglines, elementos de impacto
Weights: Regular (400) apenas — a serifa já tem peso visual suficiente
Estilo: Não usar italic exceto em citações
```

**Por que DM Serif Display:**
- Humanista — não clínica, não gelada
- Premium sem ser inacessível
- Contrasta bem com a sans-serif do produto
- Gratuita (Google Fonts) — zero custo

### Família Secundária — Inter
```
Uso: Corpo de texto, UI, labels, botões, inputs, navegação
Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
```

**Por que Inter:**
- Desenvolvida especificamente para interfaces digitais
- Legibilidade perfeita em telas pequenas (mobile-first)
- Disponível via Google Fonts, sem custo
- Suporte completo a caracteres especiais PT-BR (ç, ã, õ, etc.)

### Escala Tipográfica (rem base = 16px)

| Token | Tamanho | Peso | Line-height | Uso |
|-------|---------|------|-------------|-----|
| `display-2xl` | 4.5rem (72px) | 400 DM Serif | 1.1 | Hero principal, landing page |
| `display-xl` | 3rem (48px) | 400 DM Serif | 1.2 | Section titles |
| `display-lg` | 2.25rem (36px) | 400 DM Serif | 1.25 | Card headers grandes |
| `text-xl` | 1.25rem (20px) | 600 Inter | 1.4 | Subheadings, destaques |
| `text-lg` | 1.125rem (18px) | 400 Inter | 1.6 | Corpo de texto principal |
| `text-base` | 1rem (16px) | 400 Inter | 1.5 | UI geral, labels |
| `text-sm` | 0.875rem (14px) | 400 Inter | 1.5 | Captions, metadados |
| `text-xs` | 0.75rem (12px) | 500 Inter | 1.4 | Badges, timestamps |

### Regras de Uso Tipográfico

```
Landing page:
  H1 → DM Serif Display, display-2xl, Carvão ou Teal Profundo
  H2 → DM Serif Display, display-xl
  Corpo → Inter Regular, text-lg, Cinza Texto

Produto (dashboard, app):
  Page titles → Inter SemiBold, text-xl
  Card titles → Inter Medium, text-base
  Labels → Inter Regular, text-sm, Cinza Texto Secundário
  Dados numéricos → Inter Bold (tabular nums ativado)
```

---

## 5. Iconografia e Ilustração

### Sistema de Ícones
**Lucide Icons** — open source, consistente, linha única, estilo moderno

```bash
npm install lucide-react
```

- Stroke width: 1.5px (padrão) — não usar 2px (fica pesado)
- Tamanhos: 16px (inline), 20px (UI), 24px (destaque)
- Nunca: ícones filled misturados com ícones de linha

### Estilo de Ilustração
- **Quando usar:** onboarding, estados vazios, erros 404, sucesso
- **Estilo:** minimalista, traço único, paleta reduzida (máximo 3 cores da marca)
- **Pessoas:** sempre representadas de forma abstrata — sem rostos definidos, apenas silhuetas ou formas geométricas (evita representação excludente)
- **Referência:** estilo Storyset (Freepik) na linha "Pana"

### Emojis no produto
- Usar com moderação — apenas em contextos de celebração (meta batida, primeiro paciente, etc.)
- Nunca em mensagens de erro ou alertas de risco

---

## 6. Voz e Tom

### Persona da Marca
Vínculo fala como **um colega de carreira muito competente que também é empático**. Não é um robô, não é uma startup entusiasmada, não é um banco.

| Situação | Tom | Exemplo |
|---------|-----|---------|
| Bem-vindo ao produto | Acolhedor + confiante | "Pronto. Seu consultório está configurado." |
| Alerta de abandono | Cuidadoso + preciso | "Ana pode estar se afastando. Última sessão há 18 dias." |
| Pagamento confirmado | Objetivo | "R$ 200 recebido de Pedro. Recibo enviado automaticamente." |
| Erro no sistema | Honesto + calmo | "Algo não funcionou aqui. Já estamos verificando." |
| Feature nova | Entusiasmado mas contido | "Novo: agora você vê a evolução do paciente ao longo do tempo." |

### Palavras que usamos
cuidar · proteger · acompanhar · perceber · evoluir · clareza · segurança · vínculo · confiança

### Palavras que nunca usamos
escalar · converter · lead · funil · otimizar · maximizar · engajar (no sentido de marketing)

---

## 7. Motion e Micro-interações

### Princípio
Animações são **funcionais, não decorativas**. Existem para guiar atenção e confirmar ações — nunca para impressionar.

### Tokens de Animação
```css
--transition-fast: 150ms ease-out;    /* hover states, focus rings */
--transition-base: 250ms ease-out;    /* modals, dropdowns */
--transition-slow: 400ms ease-in-out; /* page transitions, loaders */
```

### Regras
- Nada dura mais de 400ms
- Nenhum elemento "quica" ou faz efeito de bounce (parece gamificação)
- Alertas de risco entram com fade — nunca com flash ou shake

---

## 8. Responsive e Acessibilidade

### Breakpoints
```css
--mobile:  375px  /* iPhone SE */
--tablet:  768px  /* iPad */
--desktop: 1280px /* padrão */
--wide:    1536px /* monitores grandes */
```

### Acessibilidade (WCAG 2.1 AA mínimo)
- Contraste texto/fundo: mínimo 4.5:1 (texto normal), 3:1 (texto grande)
- Focus ring visível em todos os elementos interativos
- Todos os ícones têm aria-label quando standalone
- Formulários: label sempre visível (não só placeholder)
- Prontuário: tamanho de fonte mínimo 16px (psicóloga mais velha lendo no celular)

---

## 9. Aplicação da Marca — Exemplos

### Header do app
```
[Vínculo logo]                    [Notificações 🔴] [Avatar]
```

### Card de Alerta de Abandono
```
┌─────────────────────────────────────┐
│ 🟠  Ana Lima                        │ ← borda esquerda amber
│     Risco de afastamento            │ ← Inter Medium, text-base
│     Última sessão: 18 dias atrás    │ ← Inter Regular, text-sm, cinza
│                                     │
│ [Ver detalhes]                      │ ← link, Teal Profundo
└─────────────────────────────────────┘
background: Off-White | border-radius: 12px | shadow: sm
```

### Botão primário (CTA)
```css
background: #1A4A5A;          /* Teal Profundo */
color: white;
border-radius: 8px;
padding: 12px 24px;
font: Inter SemiBold 16px;
hover: brightness(1.1);
transition: 150ms ease-out;
```

---

## 10. Assets e Recursos

### Fontes (Google Fonts — gratuitas)
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Tailwind Config
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          teal:   '#1A4A5A',
          sand:   '#F2E8DC',
          gold:   '#B8955A',
        },
        neutral: {
          'off-white': '#FAFAF8',
          mist:        '#F4F4F2',
          border:      '#E2E2DE',
          secondary:   '#6B7280',
          charcoal:    '#1F2937',
        },
        semantic: {
          success: '#2D7D4F',
          warning: '#D97706',
          danger:  '#C0392B',
          info:    '#2563EB',
        }
      },
      fontFamily: {
        serif: ['DM Serif Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        input: '8px',
        badge: '6px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        modal: '0 20px 60px rgba(0,0,0,0.15)',
      },
    }
  }
}
```

---

*Brand Guidelines v1.0 — Vínculo | @ux-design-expert (Uma)*
