import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { RAMO_LABELS, PAYMENT_LABELS, type PaymentFrequency } from '@/types/policy'
import type { QuoteItem } from '@/types/quote'

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  black:       '#0D0D0D',
  white:       '#FFFFFF',
  green:       '#0BD904',
  greenDark:   '#034001',
  greenBg:     '#F0FFF0',
  greenBorder: '#0BD904',
  gray900:     '#111827',
  gray700:     '#374151',
  gray500:     '#6B7280',
  gray300:     '#D1D5DB',
  gray100:     '#F9FAFB',
  amber:       '#D97706',
  amberBg:     '#FFFBEB',
  amberBorder: '#FDE68A',
  red:         '#DC2626',
  redBg:       '#FEF2F2',
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: C.black,
    backgroundColor: C.white,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  headerBand: {
    backgroundColor: C.black,
    paddingHorizontal: 36,
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brokerName:    { fontSize: 18, fontFamily: 'Helvetica-Bold', color: C.white },
  brokerSub:     { fontSize: 8, color: '#9CA3AF', marginTop: 2 },
  docBadge:      { backgroundColor: C.green, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 4 },
  docBadgeText:  { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.black, letterSpacing: 1 },

  // ── Body ────────────────────────────────────────────────────────────────────
  body: { paddingHorizontal: 36, paddingTop: 24, paddingBottom: 72 },

  // ── Meta strip ──────────────────────────────────────────────────────────────
  metaStrip: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  metaCard: {
    flex: 1,
    backgroundColor: C.gray100,
    borderRadius: 6,
    padding: 12,
    border: `1 solid ${C.gray300}`,
  },
  metaLabel:  { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.gray500, letterSpacing: 1, marginBottom: 3 },
  metaValue:  { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.gray900 },
  metaSub:    { fontSize: 8, color: C.gray500, marginTop: 2 },

  // ── Recommendation callout ───────────────────────────────────────────────────
  recCallout: {
    backgroundColor: C.greenBg,
    border: `2 solid ${C.green}`,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recCalloutIcon:  { fontSize: 18, color: C.green, marginRight: 10 },
  recCalloutTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: C.greenDark },
  recCalloutSub:   { fontSize: 9, color: C.gray700, marginTop: 2 },

  // ── Section label ────────────────────────────────────────────────────────────
  sectionLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: C.gray500,
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 4,
  },

  // ── Quote card ───────────────────────────────────────────────────────────────
  quoteCard: {
    borderRadius: 8,
    border: `1 solid ${C.gray300}`,
    marginBottom: 12,
    overflow: 'hidden',
  },
  quoteCardRec: {
    borderRadius: 8,
    border: `2 solid ${C.green}`,
    marginBottom: 12,
    overflow: 'hidden',
  },
  // Card header bar
  cardHeaderBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.gray100,
    borderBottom: `1 solid ${C.gray300}`,
  },
  cardHeaderBarRec: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.greenBg,
    borderBottom: `2 solid ${C.green}`,
  },
  insurerName:   { fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.gray900 },
  recPill: {
    backgroundColor: C.green,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  recPillText: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.black, letterSpacing: 0.5 },

  // Card body
  cardBody: { padding: 16, flexDirection: 'row' },

  // Price column
  priceCol: { width: 140, paddingRight: 16, borderRight: `1 solid ${C.gray300}` },
  priceLabel:  { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.gray500, letterSpacing: 1, marginBottom: 4 },
  priceValue:  { fontSize: 26, fontFamily: 'Helvetica-Bold', color: C.green, lineHeight: 1 },
  priceFreq:   { fontSize: 8, color: C.gray500, marginTop: 3 },
  priceMonthly:{ fontSize: 9, color: C.gray700, marginTop: 4 },
  franchiseRow:{ marginTop: 10, paddingTop: 10, borderTop: `1 solid ${C.gray300}` },
  franchiseLabel: { fontSize: 7, color: C.gray500, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 2 },
  franchiseVal:{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.gray900 },

  // Coverage column
  coverageCol: { flex: 1, paddingLeft: 16 },
  covTitle:    { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.gray500, letterSpacing: 1, marginBottom: 8 },
  covRow:      { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 5 },
  covCheck:    { fontSize: 9, color: C.green, marginRight: 5, fontFamily: 'Helvetica-Bold', lineHeight: 1.2 },
  covText:     { fontSize: 9, color: C.gray700, flex: 1, lineHeight: 1.4 },
  brokerNote:  { fontSize: 9, color: C.gray500, fontStyle: 'italic', marginTop: 10, paddingTop: 8, borderTop: `1 solid ${C.gray300}` },

  // ── Comparison matrix ────────────────────────────────────────────────────────
  matrixSection: { marginTop: 20 },
  matrixTable:   { border: `1 solid ${C.gray300}`, borderRadius: 6, overflow: 'hidden' },
  matrixHeaderRow: {
    flexDirection: 'row',
    backgroundColor: C.black,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  matrixRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderBottom: `1 solid ${C.gray300}`,
  },
  matrixRowAlt: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderBottom: `1 solid ${C.gray300}`,
    backgroundColor: C.gray100,
  },
  matrixCovLabel: { flex: 2, fontSize: 8, color: C.gray700 },
  matrixCovLabelH: { flex: 2, fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.white },
  matrixCell:  { flex: 1, fontSize: 9, textAlign: 'center', color: C.green, fontFamily: 'Helvetica-Bold' },
  matrixCellH: { flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.white, textAlign: 'center' },
  matrixCellNo:{ flex: 1, fontSize: 9, textAlign: 'center', color: C.gray300 },

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.black,
    paddingHorizontal: 36,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft:  { fontSize: 8, color: '#6B7280' },
  footerRight: { fontSize: 8, color: C.green },
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatBRL(n: number) {
  return `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

function monthlyEquiv(total: number, freq: string): string | null {
  const map: Record<string, number> = { anual: 12, semestral: 6, trimestral: 3, mensal: 1 }
  const div = map[freq]
  if (!div || div === 1) return null
  return `≈ ${formatBRL(total / div)}/mês`
}

// All unique coverages across all items
function allCoverages(items: QuoteItem[]): string[] {
  const set = new Set<string>()
  items.forEach(item => item.coverages?.forEach(c => set.add(c)))
  return Array.from(set)
}

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface QuoteData {
  broker: { name: string; phone?: string | null; creci?: string | null; susep?: string | null }
  client: { name: string; phone?: string | null }
  quote: { ramo: string; object_description?: string | null; notes?: string | null }
  items: QuoteItem[]
  generatedAt: string
}

// ─── Component ────────────────────────────────────────────────────────────────
export function QuoteComparisonDocument({ data }: { data: QuoteData }) {
  const { broker, client, quote, items, generatedAt } = data

  const sortedItems = [...items].sort((a, b) => {
    if (a.is_recommended && !b.is_recommended) return -1
    if (!a.is_recommended && b.is_recommended) return 1
    return (a.sort_order ?? 0) - (b.sort_order ?? 0)
  })

  const recommended = sortedItems.find(i => i.is_recommended)
  const coverages = allCoverages(sortedItems)
  const showMatrix = coverages.length > 0 && sortedItems.length > 1

  return (
    <Document title={`Cotação — ${client.name}`} author={broker.name} creator="Premia">
      <Page size="A4" style={styles.page}>

        {/* ── Header ── */}
        <View style={styles.headerBand}>
          <View>
            <Text style={styles.brokerName}>{broker.name}</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
              {broker.creci && <Text style={styles.brokerSub}>CRECI {broker.creci}</Text>}
              {broker.susep && <Text style={styles.brokerSub}>SUSEP {broker.susep}</Text>}
              {broker.phone && <Text style={styles.brokerSub}>{broker.phone}</Text>}
            </View>
          </View>
          <View style={styles.docBadge}>
            <Text style={styles.docBadgeText}>COMPARATIVO DE COTAÇÕES</Text>
          </View>
        </View>

        <View style={styles.body}>

          {/* ── Meta ── */}
          <View style={styles.metaStrip}>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>CLIENTE</Text>
              <Text style={styles.metaValue}>{client.name}</Text>
              {client.phone && <Text style={styles.metaSub}>{client.phone}</Text>}
            </View>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>TIPO DE SEGURO</Text>
              <Text style={styles.metaValue}>{RAMO_LABELS[quote.ramo] ?? quote.ramo}</Text>
              {quote.object_description && <Text style={styles.metaSub}>{quote.object_description}</Text>}
            </View>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>OPÇÕES ANALISADAS</Text>
              <Text style={styles.metaValue}>{sortedItems.length} seguradora{sortedItems.length !== 1 ? 's' : ''}</Text>
              <Text style={styles.metaSub}>Emitido em {generatedAt}</Text>
            </View>
          </View>

          {/* ── Recommendation callout ── */}
          {recommended && (
            <View style={styles.recCallout}>
              <Text style={styles.recCalloutIcon}>★</Text>
              <View>
                <Text style={styles.recCalloutTitle}>
                  Nossa recomendação: {recommended.seguradora}
                </Text>
                <Text style={styles.recCalloutSub}>
                  {recommended.broker_note
                    ? recommended.broker_note
                    : `Melhor custo-benefício para o seu perfil — ${formatBRL(recommended.premium_total)} ${(PAYMENT_LABELS[recommended.payment_frequency as PaymentFrequency] ?? recommended.payment_frequency).toLowerCase()}`}
                </Text>
              </View>
            </View>
          )}

          {/* ── Quote cards ── */}
          <Text style={styles.sectionLabel}>TODAS AS OPÇÕES</Text>

          {sortedItems.map((item) => {
            const monthly = monthlyEquiv(item.premium_total, item.payment_frequency)
            const isRec = !!item.is_recommended
            return (
              <View key={item.id} style={isRec ? styles.quoteCardRec : styles.quoteCard} wrap={false}>
                {/* Card header */}
                <View style={isRec ? styles.cardHeaderBarRec : styles.cardHeaderBar}>
                  <Text style={styles.insurerName}>{item.seguradora}</Text>
                  {isRec && (
                    <View style={styles.recPill}>
                      <Text style={styles.recPillText}>★ RECOMENDADO</Text>
                    </View>
                  )}
                </View>

                {/* Card body: price left | coverages right */}
                <View style={styles.cardBody}>
                  {/* Price */}
                  <View style={styles.priceCol}>
                    <Text style={styles.priceLabel}>PRÊMIO</Text>
                    <Text style={styles.priceValue}>{formatBRL(item.premium_total)}</Text>
                    <Text style={styles.priceFreq}>
                      {(PAYMENT_LABELS[item.payment_frequency as PaymentFrequency] ?? item.payment_frequency)}
                    </Text>
                    {monthly && <Text style={styles.priceMonthly}>{monthly}</Text>}

                    {item.franchise_value && item.franchise_value > 0 && (
                      <View style={styles.franchiseRow}>
                        <Text style={styles.franchiseLabel}>FRANQUIA</Text>
                        <Text style={styles.franchiseVal}>{formatBRL(item.franchise_value)}</Text>
                      </View>
                    )}
                  </View>

                  {/* Coverages */}
                  <View style={styles.coverageCol}>
                    {item.coverages && item.coverages.length > 0 ? (
                      <>
                        <Text style={styles.covTitle}>COBERTURAS INCLUÍDAS</Text>
                        {item.coverages.map((c, i) => (
                          <View key={i} style={styles.covRow}>
                            <Text style={styles.covCheck}>✓</Text>
                            <Text style={styles.covText}>{c}</Text>
                          </View>
                        ))}
                      </>
                    ) : (
                      <Text style={[styles.covTitle, { marginTop: 4 }]}>Coberturas não especificadas</Text>
                    )}
                    {item.broker_note && (
                      <Text style={styles.brokerNote}>"{item.broker_note}"</Text>
                    )}
                  </View>
                </View>
              </View>
            )
          })}

          {/* ── Comparison matrix ── */}
          {showMatrix && (
            <View style={styles.matrixSection} wrap={false}>
              <Text style={styles.sectionLabel}>TABELA COMPARATIVA DE COBERTURAS</Text>
              <View style={styles.matrixTable}>
                {/* Header row */}
                <View style={styles.matrixHeaderRow}>
                  <Text style={styles.matrixCovLabelH}>Cobertura</Text>
                  {sortedItems.map(item => (
                    <Text key={item.id} style={styles.matrixCellH}>
                      {item.seguradora.split(' ')[0]}
                      {item.is_recommended ? ' ★' : ''}
                    </Text>
                  ))}
                </View>
                {/* Coverage rows */}
                {coverages.map((cov, i) => (
                  <View key={cov} style={i % 2 === 0 ? styles.matrixRow : styles.matrixRowAlt}>
                    <Text style={styles.matrixCovLabel}>{cov}</Text>
                    {sortedItems.map(item => {
                      const has = item.coverages?.includes(cov)
                      return (
                        <Text key={item.id} style={has ? styles.matrixCell : styles.matrixCellNo}>
                          {has ? '✓' : '—'}
                        </Text>
                      )
                    })}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── Observações do corretor ── */}
          {quote.notes && (
            <View style={{ marginTop: 16, padding: 12, backgroundColor: C.gray100, borderRadius: 6, border: `1 solid ${C.gray300}` }}>
              <Text style={styles.sectionLabel}>OBSERVAÇÕES DO CORRETOR</Text>
              <Text style={{ fontSize: 9, color: C.gray700, lineHeight: 1.6 }}>{quote.notes}</Text>
            </View>
          )}

        </View>

        {/* ── Footer ── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerLeft}>
            {broker.name}{broker.creci ? ` · CRECI ${broker.creci}` : ''}{broker.phone ? ` · ${broker.phone}` : ''}
          </Text>
          <Text style={styles.footerRight}>Gerado por Premia · premia.app</Text>
        </View>

      </Page>
    </Document>
  )
}
