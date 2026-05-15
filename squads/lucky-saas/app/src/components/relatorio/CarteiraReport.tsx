import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { CarteiraSummary } from '@/lib/portfolio/report-data'

const C = {
  black:     '#0D0D0D',
  green:     '#0BD904',
  greenDark: '#034001',
  greenBg:   '#F0FFF0',
  gray900:   '#111827',
  gray600:   '#4B5563',
  gray400:   '#9CA3AF',
  gray200:   '#E5E7EB',
  gray100:   '#F9FAFB',
  white:     '#FFFFFF',
}

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, color: C.black, backgroundColor: C.white },

  headerBand: {
    backgroundColor: C.black,
    paddingHorizontal: 40,
    paddingVertical: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brokerName:   { fontSize: 20, fontFamily: 'Helvetica-Bold', color: C.white, marginBottom: 4 },
  brokerDetail: { fontSize: 9, color: C.gray400, marginBottom: 2 },
  badgeBox: {
    backgroundColor: C.green,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.black, letterSpacing: 1 },

  body: { paddingHorizontal: 40, paddingTop: 28, paddingBottom: 80 },

  sectionLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: C.gray400,
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 22,
  },

  statRow: { flexDirection: 'row', marginBottom: 4 },
  statBox: {
    flex: 1,
    backgroundColor: C.gray100,
    borderRadius: 6,
    border: `1 solid ${C.gray200}`,
    padding: 14,
    marginRight: 10,
  },
  statBoxLast: {
    flex: 1,
    backgroundColor: C.gray100,
    borderRadius: 6,
    border: `1 solid ${C.gray200}`,
    padding: 14,
  },
  statLabel: { fontSize: 8, color: C.gray400, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5, marginBottom: 4 },
  statValue: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: C.gray900 },
  statValueGreen: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: C.green },

  row: { flexDirection: 'row', marginBottom: 8, alignItems: 'center' },
  ramoLabel: { fontSize: 10, color: C.gray900, width: 90 },
  barBg: { flex: 1, height: 8, backgroundColor: C.gray200, borderRadius: 4 },
  barFill: { height: 8, backgroundColor: C.green, borderRadius: 4 },
  barPct: { fontSize: 9, color: C.gray600, width: 36, textAlign: 'right', fontFamily: 'Helvetica-Bold' },
  barCount: { fontSize: 9, color: C.gray400, width: 40, textAlign: 'right' },

  segRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottom: `1 solid ${C.gray200}` },
  segName: { fontSize: 10, color: C.gray900 },
  segCount: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.gray900 },

  renewBox: {
    backgroundColor: C.greenBg,
    borderRadius: 6,
    border: `2 solid ${C.green}`,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  renewLabel: { fontSize: 9, color: C.greenDark },
  renewValue: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: C.green },

  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
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

function formatBRL(n: number) {
  return `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR')
}

export function CarteiraReport({ data }: { data: CarteiraSummary }) {
  const { broker, totalClients, totalApolices, premioAnualTotal, byRamo, topSeguradoras, renewalRate, generatedAt } = data

  return (
    <Document title={`Relatório de Carteira — ${broker.nome}`} author={broker.nome} creator="Premia">
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.headerBand}>
          <View>
            <Text style={styles.brokerName}>{broker.nome}</Text>
            {broker.susep && <Text style={styles.brokerDetail}>SUSEP: {broker.susep}</Text>}
          </View>
          <View>
            <View style={styles.badgeBox}>
              <Text style={styles.badgeText}>RELATÓRIO DE CARTEIRA</Text>
            </View>
            <Text style={[styles.brokerDetail, { marginTop: 8, textAlign: 'right' }]}>
              Gerado em {formatDate(generatedAt)}
            </Text>
          </View>
        </View>

        <View style={styles.body}>

          {/* Executive Summary */}
          <Text style={styles.sectionLabel}>RESUMO EXECUTIVO</Text>
          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>CLIENTES ATIVOS</Text>
              <Text style={styles.statValue}>{totalClients}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>APÓLICES ATIVAS</Text>
              <Text style={styles.statValue}>{totalApolices}</Text>
            </View>
            <View style={styles.statBoxLast}>
              <Text style={styles.statLabel}>PRÊMIO SOB GESTÃO</Text>
              <Text style={styles.statValueGreen}>{formatBRL(premioAnualTotal)}</Text>
            </View>
          </View>

          {/* By Ramo */}
          {byRamo.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>DISTRIBUIÇÃO POR RAMO</Text>
              {byRamo.map((r) => (
                <View key={r.ramo} style={styles.row}>
                  <Text style={styles.ramoLabel}>{r.label}</Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${r.pct}%` }]} />
                  </View>
                  <Text style={styles.barPct}>{r.pct}%</Text>
                  <Text style={styles.barCount}>{r.count} apól.</Text>
                </View>
              ))}
            </>
          )}

          {/* Top Seguradoras */}
          {topSeguradoras.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>TOP SEGURADORAS POR VOLUME</Text>
              {topSeguradoras.map((s, i) => (
                <View key={s.seguradora} style={styles.segRow}>
                  <Text style={styles.segName}>{i + 1}. {s.seguradora}</Text>
                  <Text style={styles.segCount}>{s.count} apólices</Text>
                </View>
              ))}
            </>
          )}

          {/* Renewal Rate */}
          {renewalRate !== undefined && (
            <>
              <Text style={styles.sectionLabel}>TAXA DE RENOVAÇÃO</Text>
              <View style={styles.renewBox}>
                <Text style={styles.renewLabel}>
                  Apólices renovadas via Premia{'\n'}sobre o total de apólices ativas
                </Text>
                <Text style={styles.renewValue}>{renewalRate}%</Text>
              </View>
            </>
          )}

        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerLeft}>{broker.nome}{broker.susep ? ` · SUSEP ${broker.susep}` : ''}</Text>
          <Text style={styles.footerRight}>Gerado pelo Premia · premia.app · {formatDate(generatedAt)}</Text>
        </View>

      </Page>
    </Document>
  )
}
