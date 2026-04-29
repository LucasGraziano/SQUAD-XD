# Feature Spec — Notas Clínicas + IA de Linhagem Terapêutica

**Prioridade:** P0 — Diferencial único do MVP  
**Status:** Spec  
**Por que isso importa:** Nenhum concorrente identifica a abordagem terapêutica do psicólogo a partir das suas próprias notas. Isso cria um espelho clínico que nenhuma ferramenta oferece hoje.

---

## Parte 1 — Notas Clínicas Seguras

### O Problema Atual
O psicólogo anota a sessão no Word, caderno ou em campos de texto genérico em outros sistemas. Esses registros são:
- Sem estrutura → difíceis de revisitar
- Sem segurança real → Word não é criptografado
- Sem inteligência → dados que entram, não saem como insights

### O Que Construímos

#### Estrutura da Nota por Sessão
```
Sessão: [data/hora — preenchido automático]
Modalidade: [Presencial / Online]
Status: [Realizada / Falta / Reagendada]

━━━ NOTA CLÍNICA ━━━
[campo de texto rico — principal]
Suporte a: texto, negrito, listas, itálico
Voz para texto: botão de microfone (Web Speech API — sem custo adicional)

━━━ TAGS ━━━
Abordagem utilizada: [TCC] [ACT] [Psicanálise] [EMDR] [Gestalt] [Sistêmica] [IFS] [DBT] [+]
Temas da sessão:     [ansiedade] [família] [trabalho] [trauma] [relacionamento] [+]
Tarefas prescritas:  [lista de itens — enviadas ao portal do paciente futuramente]

━━━ PRÓXIMA SESSÃO ━━━
Data sugerida: [campo]
Objetivos para próxima sessão: [campo opcional]
```

#### Regras de Imutabilidade
- **Dentro de 24h:** campo editável com registro de "editado às HH:mm"
- **Após 24h:** apenas notas adicionais (append-only) — nunca sobrescrever
- **Trigger no banco:** bloqueia UPDATE após 24h no PostgreSQL (vide `regulatory-compliance.md`)
- **Audit log:** toda visualização e modificação registrada com timestamp + IP

#### Criptografia Client-Side
```typescript
// A chave é derivada da senha do usuário (PBKDF2)
// O servidor armazena apenas o ciphertext — nunca o texto claro
// Nem a equipe da plataforma consegue ler as notas

const userKey = await deriveKey(userPassword, salt); // PBKDF2
const encrypted = await encryptNote(sessionContent, userKey); // AES-256-GCM
// Apenas `encrypted` vai para o banco
```

---

## Parte 2 — IA de Linhagem Terapêutica

### A Ideia Central
Cada psicólogo tem uma **linhagem** — uma abordagem teórica predominante que guia como ele trabalha:
- Cognitivo-Comportamental (TCC, ACT, DBT)
- Psicodinâmica / Psicanalítica
- Humanista / Existencial / Gestalt
- Sistêmica / Familiar
- Integrativa (mistura de abordagens)

Hoje o psicólogo sabe qual é a sua linhagem pela sua formação. Mas na prática, ao longo do tempo, a abordagem real pode derivar — ele vai usando mais de uma coisa sem perceber, vai evoluindo o estilo clínico.

**A IA lê as notas e devolve um espelho:** "Com base nas suas últimas 30 sessões, você está trabalhando predominantemente com técnicas de ACT + elementos Gestalt. Sua abordagem com temas de ansiedade tem viés TCC. Com temas de relacionamento, você usa mais escuta humanista."

Isso é novo. Nenhum produto faz isso.

---

### Treinamento sem Copyright

#### Corpus de Domínio Público por Linhagem

| Linhagem | Autores / Obras (Domínio Público ou Permissão Clara) |
|---------|------------------------------------------------------|
| **Psicanálise** | Freud (obras pré-1928: Interpretação dos Sonhos, Ego e Id, Além do Princípio do Prazer, Estudos sobre Histeria) — PD no Brasil |
| **Behaviorismo / TCC raiz** | Watson (Psychology as the Behaviorist Views It, 1913), Skinner (Science and Human Behavior, 1953 — PD em muitos países), Pavlov |
| **Humanismo** | Carl Rogers (On Becoming a Person — verificar edição PD), Abraham Maslow (artigos originais pré-1970) |
| **Gestalt** | Fritz Perls (artigos fundacionais publicados em periódicos pré-1970) |
| **Sistêmica** | Gregory Bateson (Steps to an Ecology of Mind, 1972 — verificar) |
| **Existencialismo clínico** | Viktor Frankl (Man's Search for Meaning — verificar PD por território) |
| **Junguiana** | Jung (obras pré-1960 publicadas antes do copyright moderno — verificar) |

> **Regra de ouro:** Verificar domínio público para o Brasil (70 anos após morte do autor — Art. 41 da Lei 9.610/98).  
> Freud morreu em 1939 → obra em PD no Brasil desde 2010. ✅  
> Skinner morreu em 1990 → obra em PD no Brasil desde 2061. ⚠️ Usar apenas obras antes de 1955 ou buscar licença.

#### Estratégia de Corpus Seguro

**Opção A — Fine-tuning com embeddings (recomendada):**
- Criar embeddings semânticos das obras de domínio público verificadas
- Usar modelo base open-source (LLaMA 3, Mistral) sem custo de API
- Classificador de linhagem baseado em similaridade semântica com o corpus

**Opção B — Prompt engineering com Claude/GPT (mais rápido para MVP):**
- Não requer treinamento próprio
- Descreve as características linguísticas de cada linhagem no prompt
- Analisa a nota do psicólogo e classifica por aproximação
- Custo: ~R$0,02–0,10 por análise (Claude Haiku ou GPT-4o-mini)
- **Recomendado para MVP** — menos risco técnico, valida a ideia rapidamente

**Opção C — Modelo próprio (longo prazo, v3+):**
- Fine-tuning de LLM open-source com corpus curado + anotação humana (psicólogos validando)
- Total controle, custo marginal zero após treinamento
- Candidato para quando tiver 500+ usuários e dados suficientes

---

### Como Funciona na Prática

#### Fluxo de Análise
```
Psicólogo registra nota da sessão
        ↓
[Após 24h — quando nota está finalizada]
        ↓
Background job envia nota para classificador de linhagem
        ↓
Classificador retorna:
  - Abordagem predominante na sessão
  - Técnicas identificadas
  - Confiança da classificação (%)
        ↓
Acumula por paciente + por período (últimas 4 semanas, 3 meses)
        ↓
Painel de Linhagem atualizado semanalmente
```

#### Prompt de Classificação (Opção B — MVP)
```
Sistema: Você é um especialista em psicoterapia com conhecimento profundo 
das principais abordagens teóricas. Analise a nota clínica abaixo e identifique:

1. A abordagem terapêutica predominante (TCC, ACT, DBT, Psicanálise, Gestalt, 
   Humanista/Rogeriana, Sistêmica, EMDR, Integrativa, Outra)
2. Técnicas específicas identificadas (ex: reestruturação cognitiva, defusão, 
   validação emocional, interpretação, experimento de contato, etc.)
3. Tom da relação terapêutica (diretivo, colaborativo, reflexivo, interpretativo)
4. Nível de confiança (0-100%)

Responda APENAS em JSON. Não invente técnicas que não estejam implícitas no texto.
Nota clínica: {encrypted_note_decrypted_client_side}

⚠️ IMPORTANTE: A nota é decriptografada pelo cliente antes de enviar para análise.
O servidor nunca vê o texto claro — apenas o resultado JSON da classificação.
```

#### Painel de Linhagem (UI)

```
┌─────────────────────────────────────────────────────┐
│  Seu Perfil Clínico                    Últimas 8 sem │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Abordagem Predominante                             │
│  ████████████████░░░░░  TCC / ACT         68%      │
│  ████████░░░░░░░░░░░░░  Humanista         32%      │
│                                                     │
│  Técnicas Mais Usadas                               │
│  • Reestruturação cognitiva    (14 sessões)         │
│  • Defusão cognitiva           (11 sessões)         │
│  • Escuta empática             (9 sessões)          │
│  • Experimento comportamental  (7 sessões)          │
│                                                     │
│  Por Tema de Sessão                                 │
│  Ansiedade      → predominante: TCC                 │
│  Relacionamento → predominante: Humanista           │
│  Trauma         → predominante: ACT + EMDR          │
│                                                     │
│  💡 Insight: Nas últimas 4 semanas você usou mais   │
│  técnicas de ACT do que TCC — tendência de          │
│  integração gradual da abordagem.                   │
└─────────────────────────────────────────────────────┘
```

---

### Valor Clínico Real

**Para o psicólogo:**
- Reflexão sobre a própria prática ("Estou sendo consistente com minha abordagem?")
- Identificação de padrões ("Com pacientes de ansiedade, vou direto pra TCC — estou explorando outras opções?")
- Evidência de evolução profissional ao longo do tempo

**Para o produto:**
- Feature que nenhum concorrente tem
- Dado que só existe porque o psicólogo usa o sistema (lock-in positivo)
- Base para recomendações futuras (supervisão por afinidade de linhagem, literatura relevante)

**Para o marketing:**
- Demonstrável em print screen — visual, tangível, impressionante
- Psicólogo vai mostrar para colegas ("olha o que esse sistema faz")
- Viral orgânico dentro da comunidade

---

### Considerações Éticas e de Privacidade

- A análise de IA ocorre **após decriptografia client-side** — o texto claro nunca sai do dispositivo do psicólogo sem consentimento explícito
- **Alternativa mais segura:** análise ocorre localmente no browser (WebAssembly + modelo leve quantizado) — sem envio de nada para servidor
- Psicólogo pode **optar por não usar** a IA de linhagem — feature é opcional
- Os resultados são **apenas para o psicólogo** — nunca compartilhados com pacientes ou terceiros
- Deixar claro no UI: "Análise baseada em padrões linguísticos — não substitui supervisão clínica"

---

### Roadmap da IA

| Fase | Feature | Quando |
|------|---------|--------|
| MVP | Classificação de linhagem via prompt (Opção B) | Mês 2–3 |
| v1.5 | Análise por paciente (linhagem que funciona melhor com cada perfil) | Mês 5–6 |
| v2.0 | Sugestão de técnicas baseada no padrão de sessões anteriores | Mês 8–10 |
| v3.0 | Modelo próprio fine-tuned com corpus curado | Mês 15+ |

---

### Definition of Done (MVP)

- [ ] Nota clínica salva criptografada — chave não armazenada no servidor
- [ ] Classificação de linhagem funciona para as 6 principais abordagens
- [ ] Painel de linhagem atualiza semanalmente (cron job)
- [ ] Confiança da classificação exibida (psicólogo sabe que não é certeza absoluta)
- [ ] Feature pode ser desativada por configuração
- [ ] Testado com 10 notas reais (fornecidas por beta users anonimizadas)
- [ ] Psicólogo não consegue extrair texto claro de notas antigas sem autenticar
