# Fluxos de UX — Principais Jornadas

**Status:** Draft — validar com entrevistas

---

## Princípios de UX

1. **"Gestão que desaparece"** — o produto deve ser tão intuitivo que o psicólogo esquece que está usando um software
2. **Mobile-first** — psicólogo acessa entre sessões, no celular, com 5 min disponíveis
3. **Zero cliques desnecessários** — cada ação crítica (registrar sessão, cobrar) em no máximo 3 toques
4. **Tom de acolhimento** — mensagens de erro nunca agressivas; microcopy sempre gentil

---

## Fluxo 1: Onboarding (Primeiro Acesso)

```
[Landing Page]
      ↓
[Criar conta] → nome, email, senha, CRP
      ↓
[Verificar email]
      ↓
[Configuração em 3 passos]
  Passo 1: Horários de atendimento (dias, horas)
  Passo 2: Valor padrão por sessão
  Passo 3: Conectar WhatsApp (para lembretes) → opcional
      ↓
[Adicionar primeiro paciente]
  → nome + telefone (mínimo)
  → consentimento digital enviado por WhatsApp
      ↓
[Agendar primeira sessão]
      ↓
[Dashboard principal]

Meta: conta criada → 1ª sessão agendada em < 10 minutos
```

---

## Fluxo 2: Dia a Dia do Psicólogo

```
[Manhã — notificação]
"Você tem 5 sessões hoje. Ana Lima às 09h, Pedro às 10h..."
      ↓
[Durante a sessão — não deve usar o app]
      ↓
[Após a sessão — registrar evolução]
  → Toque em "Registrar sessão de Ana Lima"
  → Texto livre de evolução (voz para texto opcional)
  → Tags de técnicas/temas (opcional, mas incentivado)
  → Confirmar → cobrança enviada automaticamente
      ↓
[Ao fim do dia]
  → Dashboard mostra: sessões realizadas, a receber, alertas de risco
```

---

## Fluxo 3: Alerta de Abandono

```
[Notificação push / email]
"Ana Lima pode estar se afastando — 3 faltas nas últimas 4 semanas"
      ↓
[Toque no alerta]
      ↓
[Tela de detalhe]
  → Score de risco + fatores
  → Histórico de frequência (gráfico)
  → Opções: "Enviar check-in", "Registrar contato", "Dispensar"
      ↓
[Se "Enviar check-in"]
  → Template de mensagem gentil pré-preenchido
  → Psicólogo edita se quiser → envia via WhatsApp
      ↓
[Sistema registra contato realizado]
  → Não envia novo alerta por 72h
```

---

## Fluxo 4: Cobrança

```
[Sessão marcada como Realizada]
      ↓
[Cobrança lançada automaticamente]
  → PIX enviado via WhatsApp (após 1h, configurável)
      ↓
[Paciente paga]
  → Notificação para o psicólogo: "Ana Lima pagou R$ 200 ✓"
  → Recibo gerado e enviado automaticamente
      ↓
[Paciente não paga em 24h]
  → Lembrete automático (1 vez, tom gentil)
      ↓
[Paciente não paga em 72h]
  → Alerta para o psicólogo (sem novo lembrete para o paciente)
  → Psicólogo decide o que fazer
```

---

## Fluxo 5: Consulta ao Prontuário

```
[Lista de pacientes]
      ↓
[Selecionar paciente → Perfil completo]
  → Abas: Histórico | Financeiro | Documentos | Risco
      ↓
[Aba Histórico]
  → Timeline de sessões (mais recente primeiro)
  → Cada sessão: data, status, evolution (clicável para expandir)
  → Busca por palavra-chave dentro das evoluções
```

---

## Wireframes Conceituais

### Dashboard Principal (mobile)

```
┌─────────────────────┐
│  Bom dia, Dra. Ana  │
│  Quarta, 09/04      │
├─────────────────────┤
│ HOJE                │
│ 09:00 Maria Santos  │
│ 10:00 Pedro Rocha   │
│ 14:00 João Lima     │
│ + 2 sessões         │
├─────────────────────┤
│ ⚠️ ATENÇÃO (2)      │
│ Ana: risco abandono │
│ Carlos: pagto 5d    │
├─────────────────────┤
│ ESTE MÊS            │
│ Recebido: R$ 4.800  │
│ Pendente: R$ 1.200  │
└─────────────────────┘
  [+] Registrar Sessão
```

### Tela de Registro Rápido de Sessão

```
┌─────────────────────┐
│ ← Maria Santos      │
│ Hoje, 09:00         │
├─────────────────────┤
│ Como foi a sessão?  │
│                     │
│ [campo de texto     │
│  grande, voz        │
│  disponível]        │
│                     │
├─────────────────────┤
│ Técnicas usadas:    │
│ [TCC] [ACT] [+]     │
│                     │
│ Temas:              │
│ [ansiedade] [+]     │
├─────────────────────┤
│ [Salvar e Cobrar]   │
│ R$ 200 → PIX Maria  │
└─────────────────────┘
```
