import { Document, Page, Text, View, StyleSheet, Line, Svg } from '@react-pdf/renderer'
import { RAMO_LABELS, PAYMENT_LABELS, type PaymentFrequency } from '@/types/policy'

const C = {
  black:      '#0D0D0D',
  green:      '#0BD904',
  greenDark:  '#034001',
  greenBg:    '#F0FFF0',
  gray900:    '#111827',
  gray600:    '#4B5563',
  gray400:    '#9CA3AF',
  gray200:    '#E5E7EB',
  gray100:    '#F9FAFB',
  amber:      '#D97706',
  amberBg:    '#FFFBEB',
  amberBorder:'#FDE68A',
  white:      '#FFFFFF',
}

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, color: C.black, backgroundColor: C.white },

  // ── Header band ──────────────────────────────────────────────────────────────
  headerBand: {
    backgroundColor: C.black,
    paddingHorizontal: 40,
    paddingVertical: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brokerName:    { fontSize: 20, fontFamily: 'Helvetica-Bold', color: C.white, marginBottom: 4 },
  brokerDetail:  { fontSize: 9, color: '#9CA3AF', marginBottom: 2 },
  badgeBox: {
    backgroundColor: C.green,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.black, letterSpacing: 1 },

  // ── Body ─────────────────────────────────────────────────────────────────────
  body: { paddingHorizontal: 40, paddingTop: 28, paddingBottom: 80 },

  // ── Section title ────────────────────────────────────────────────────────────
  sectionLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: C.gray400,
    letterSpacing: 1.5,
    marginBottom: 8,
    marginTop: 20,
  },

  // ── Cards ────────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: C.gray100,
    borderRadius: 6,
    border: `1 solid ${C.gray200}`,
    padding: 16,
    marginBottom: 4,
  },
  cardGreen: {
    backgroundColor: C.greenBg,
    borderRadius: 6,
    border: `2 solid ${C.green}`,
    padding: 16,
    marginBottom: 4,
  },
  cardAmber: {
    backgroundColor: C.amberBg,
    borderRadius: 6,
    border: `1 solid ${C.amberBorder}`,
    padding: 14,
    marginBottom: 4,
  },

  // ── Grid ─────────────────────────────────────────────────────────────────────
  row:   { flexDirection: 'row', marginBottom: 10 },
  col:   { flex: 1 },
  col2:  { flex: 2 },

  // ── Typography ───────────────────────────────────────────────────────────────
  label:       { fontSize: 8, color: C.gray400, marginBottom: 3, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },
  value:       { fontSize: 10, color: C.gray900 },
  valueBold:   { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.gray900 },
  valueMono:   { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.gray900 },
  valueGreen:  { fontSize: 22, fontFamily: 'Helvetica-Bold', color: C.green },
  valueAmber:  { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.amber },

  // ── Divider ──────────────────────────────────────────────────────────────────
  divider: { borderBottom: `1 solid ${C.gray200}`, marginVertical: 10 },

  // ── Coverage pills ───────────────────────────────────────────────────────────
  pillRow:  { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  pill: {
    backgroundColor: C.greenBg,
    border: `1 solid ${C.green}`,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  pillText: { fontSize: 8, color: C.greenDark, fontFamily: 'Helvetica-Bold' },

  // ── Sinistro contacts ────────────────────────────────────────────────────────
  contactRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  contactLabel:{ fontSize: 9, color: C.gray400 },
  contactValue:{ fontSize: 10, color: C.gray900, fontFamily: 'Helvetica-Bold' },

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.black,
    paddingHorizontal: 40,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft:  { fontSize: 8, color: '#6B7280' },
  footerRight: { fontSize: 8, color: C.green },
})

export interface ProposalData {
  broker: {
    name: string
    phone?: string | null
    email?: string | null
    creci?: string | null
    susep?: string | null
  }
  client: {
    name: string
    cpf_cnpj?: string | null
    email?: string | null
    phone?: string | null
  }
  policy: {
    ramo: string
    seguradora: string
    policy_number?: string | null
    start_date: string
    end_date: string
    premium_total: number
    payment_frequency: string
    commission_pct: number
    notes?: string | null
    valor_franquia?: number | null
    coberturas?: string | null
    sinistro_tel?: string | null
    sinistro_zap?: string | null
    placa?: string | null
    objeto_segurado?: string | null
  }
  validUntil: string
}

function formatDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR')
}

function formatBRL(n: number) {
  return `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

function LabelValue({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.col}>
      <Text style={styles.label}>{label}</Text>
      <Text style={accent ? styles.valueBold : styles.value}>{value}</Text>
    </View>
  )
}

export function ProposalDocument({ data }: { data: ProposalData }) {
  const { broker, client, policy, validUntil } = data
  const ramoLabel = RAMO_LABELS[policy.ramo] ?? policy.ramo
  const payLabel = PAYMENT_LABELS[policy.payment_frequency as PaymentFrequency] ?? policy.payment_frequency
  const coberturas = policy.coberturas ? policy.coberturas.split(',').map(s => s.trim()).filter(Boolean) : []

  return (
    <Document title={`Proposta — ${client.name}`} author={broker.name} creator="Premia">
      <Page size="A4" style={styles.page}>

        {/* ── Header ── */}
        <View style={styles.headerBand}>
          <View>
            <Text style={styles.brokerName}>{broker.name}</Text>
            {broker.creci && <Text style={styles.brokerDetail}>CRECI: {broker.creci}</Text>}
            {broker.susep && <Text style={styles.brokerDetail}>SUSEP: {broker.susep}</Text>}
            {broker.phone && <Text style={styles.brokerDetail}>{broker.phone}</Text>}
            {broker.email && <Text style={styles.brokerDetail}>{broker.email}</Text>}
          </View>
          <View>
            <View style={styles.badgeBox}>
              <Text style={styles.badgeText}>PROPOSTA COMERCIAL</Text>
            </View>
            <Text style={[styles.brokerDetail, { marginTop: 8, textAlign: 'right' }]}>
              Emitido em {formatDate(new Date().toISOString().split('T')[0])}
            </Text>
          </View>
        </View>

        <View style={styles.body}>

          {/* ── Dados do Cliente ── */}
          <Text style={styles.sectionLabel}>Dados do Cliente</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <LabelValue label="NOME COMPLETO" value={client.name} accent />
              {client.cpf_cnpj && <LabelValue label="CPF / CNPJ" value={client.cpf_cnpj} />}
            </View>
            <View style={[styles.row, { marginBottom: 0 }]}>
              {client.phone && <LabelValue label="TELEFONE" value={client.phone} />}
              {client.email && <LabelValue label="E-MAIL" value={client.email} />}
            </View>
          </View>

          {/* ── Objeto Segurado ── */}
          {(policy.objeto_segurado || policy.placa) && (
            <>
              <Text style={styles.sectionLabel}>Objeto Segurado</Text>
              <View style={styles.card}>
                <View style={[styles.row, { marginBottom: 0 }]}>
                  {policy.objeto_segurado && <LabelValue label="DESCRIÇÃO" value={policy.objeto_segurado} accent />}
                  {policy.placa && <LabelValue label="PLACA" value={policy.placa} />}
                </View>
              </View>
            </>
          )}

          {/* ── Detalhes da Cobertura ── */}
          <Text style={styles.sectionLabel}>Detalhes da Cobertura</Text>
          <View style={styles.cardGreen}>
            <View style={styles.row}>
              <LabelValue label="RAMO" value={ramoLabel} accent />
              <LabelValue label="SEGURADORA" value={policy.seguradora} accent />
              {policy.policy_number && <LabelValue label="Nº DA APÓLICE" value={`#${policy.policy_number}`} />}
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>PRÊMIO TOTAL</Text>
                <Text style={styles.valueGreen}>{formatBRL(policy.premium_total)}</Text>
                <Text style={[styles.value, { fontSize: 9, color: C.gray400, marginTop: 2 }]}>{payLabel}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>VIGÊNCIA</Text>
                <Text style={styles.valueBold}>{formatDate(policy.start_date)}</Text>
                <Text style={[styles.value, { fontSize: 9, color: C.gray400, marginTop: 1 }]}>até {formatDate(policy.end_date)}</Text>
              </View>
              {policy.valor_franquia && policy.valor_franquia > 0 ? (
                <View style={styles.col}>
                  <Text style={styles.label}>FRANQUIA</Text>
                  <Text style={styles.valueBold}>{formatBRL(policy.valor_franquia)}</Text>
                </View>
              ) : null}
            </View>

            {/* Coberturas */}
            {coberturas.length > 0 && (
              <>
                <View style={styles.divider} />
                <Text style={styles.label}>COBERTURAS INCLUÍDAS</Text>
                <View style={styles.pillRow}>
                  {coberturas.map((c, i) => (
                    <View key={i} style={styles.pill}>
                      <Text style={styles.pillText}>✓ {c}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>

          {/* ── Contatos de Sinistro ── */}
          {(policy.sinistro_tel || policy.sinistro_zap) && (
            <>
              <Text style={styles.sectionLabel}>Contatos de Sinistro</Text>
              <View style={styles.card}>
                <View style={styles.row}>
                  {policy.sinistro_tel && (
                    <View style={styles.col}>
                      <Text style={styles.label}>TELEFONE 24H</Text>
                      <Text style={styles.valueBold}>{policy.sinistro_tel}</Text>
                    </View>
                  )}
                  {policy.sinistro_zap && (
                    <View style={styles.col}>
                      <Text style={styles.label}>WHATSAPP</Text>
                      <Text style={styles.valueBold}>{policy.sinistro_zap}</Text>
                    </View>
                  )}
                </View>
              </View>
            </>
          )}

          {/* ── Observações ── */}
          {policy.notes && (
            <>
              <Text style={styles.sectionLabel}>Observações</Text>
              <View style={styles.card}>
                <Text style={[styles.value, { lineHeight: 1.6 }]}>{policy.notes}</Text>
              </View>
            </>
          )}

          {/* ── Validade da Proposta ── */}
          <View style={[styles.cardAmber, { marginTop: 16 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={[styles.label, { color: '#92400E' }]}>PROPOSTA VÁLIDA ATÉ</Text>
                <Text style={styles.valueAmber}>{formatDate(validUntil)}</Text>
              </View>
              <View style={{ flex: 2, paddingLeft: 20 }}>
                <Text style={{ fontSize: 9, color: '#92400E', lineHeight: 1.5 }}>
                  Para aceitar esta proposta ou esclarecer dúvidas, entre em contato com seu corretor.
                  {broker.phone ? `\n${broker.name} — ${broker.phone}` : ''}
                </Text>
              </View>
            </View>
          </View>

        </View>

        {/* ── Footer ── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerLeft}>{broker.name}{broker.creci ? ` · CRECI ${broker.creci}` : ''}{broker.phone ? ` · ${broker.phone}` : ''}</Text>
          <Text style={styles.footerRight}>Gerado por Premia · premia.app</Text>
        </View>

      </Page>
    </Document>
  )
}
