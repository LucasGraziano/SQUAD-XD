import jsPDF from 'jspdf'
import { decryptNote } from './crypto'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const STATUS_LABEL: Record<string, string> = {
  completed: 'Realizada', cancelled: 'Cancelada', no_show: 'Falta',
  scheduled: 'Agendada', confirmed: 'Confirmada', rescheduled: 'Reagendada',
}

export async function exportProntuarioPDF(
  patient: { full_name: string; birth_date: string | null; notes: string | null } | null,
  sessions: Array<{
    id: string
    scheduled_at: string
    status: string
    session_number: number
    duration_minutes: number
    session_notes: Array<{
      content_encrypted: string
      content_iv: string
      content_salt: string
      is_immutable: boolean
      decryptedContent?: string
    }>
  }>,
  password: string
) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210
  const margin = 20
  const usableW = W - margin * 2
  let y = margin

  function addText(text: string, opts: {
    size?: number
    bold?: boolean
    color?: [number, number, number]
    x?: number
    align?: 'left' | 'center' | 'right'
    maxW?: number
  } = {}) {
    const { size = 10, bold = false, color = [31, 41, 55], x = margin, align = 'left', maxW = usableW } = opts
    doc.setFontSize(size)
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setTextColor(color[0], color[1], color[2])

    const lines = doc.splitTextToSize(text, maxW)
    doc.text(lines, align === 'center' ? W / 2 : x, y, { align })
    y += lines.length * (size * 0.4) + 2
  }

  function line(color: [number, number, number] = [226, 226, 222]) {
    doc.setDrawColor(color[0], color[1], color[2])
    doc.line(margin, y, W - margin, y)
    y += 4
  }

  function newPage() {
    doc.addPage()
    y = margin
    addHeader()
  }

  function checkPage(needed = 20) {
    if (y > 270 - needed) newPage()
  }

  function addHeader() {
    doc.setFillColor(26, 74, 90)
    doc.rect(0, 0, W, 14, 'F')
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('Vínculo — Prontuário Clínico', margin, 9)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(`Exportado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}`, W - margin, 9, { align: 'right' })
    y = 22
  }

  // ── Capa ──────────────────────────────────────────────────────
  addHeader()

  addText('PRONTUÁRIO ELETRÔNICO', { size: 18, bold: true, color: [26, 74, 90], align: 'center', x: 0 })
  addText('Uso exclusivo do profissional responsável — CFP Res. 001/2009', {
    size: 8, color: [107, 114, 128], align: 'center', x: 0,
  })
  y += 6
  line()

  // Dados do paciente
  addText('IDENTIFICAÇÃO DO PACIENTE', { size: 10, bold: true, color: [26, 74, 90] })
  y += 2
  if (patient) {
    addText(`Nome: ${patient.full_name}`, { size: 10 })
    if (patient.birth_date) {
      addText(`Data de nascimento: ${format(new Date(patient.birth_date), 'dd/MM/yyyy')}`, { size: 10 })
    }
    if (patient.notes) {
      addText(`Demanda inicial: ${patient.notes}`, { size: 10, maxW: usableW })
    }
  }
  y += 4
  line()

  // Resumo
  const completedSessions = sessions.filter(s => s.status === 'completed')
  addText('RESUMO DO ATENDIMENTO', { size: 10, bold: true, color: [26, 74, 90] })
  y += 2
  addText(`Total de sessões: ${sessions.length}`, { size: 10 })
  addText(`Sessões realizadas: ${completedSessions.length}`, { size: 10 })
  addText(`Faltas: ${sessions.filter(s => s.status === 'no_show').length}`, { size: 10 })
  y += 6

  // ── Histórico de sessões ──────────────────────────────────────
  for (const session of sessions.sort((a, b) =>
    new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
  )) {
    checkPage(40)
    line([226, 226, 222])

    addText(
      `Sessão #${session.session_number} — ${format(parseISO(session.scheduled_at), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}`,
      { size: 11, bold: true, color: [26, 74, 90] }
    )
    addText(
      `Horário: ${format(parseISO(session.scheduled_at), 'HH:mm')} · Duração: ${session.duration_minutes}min · Status: ${STATUS_LABEL[session.status]}`,
      { size: 9, color: [107, 114, 128] }
    )
    y += 2

    // Notas
    if (session.session_notes.length > 0) {
      const note = session.session_notes[0]
      let noteContent = note.decryptedContent

      if (!noteContent && password) {
        try {
          noteContent = await decryptNote(note, password)
        } catch {
          noteContent = '[Nota criptografada — não foi possível descriptografar]'
        }
      }

      if (noteContent) {
        try {
          const parsed = JSON.parse(noteContent)
          // Strip HTML tags for PDF
          const plainText = parsed.html?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
          if (plainText) {
            checkPage(20)
            addText('Evolução clínica:', { size: 9, bold: true })
            addText(plainText, { size: 9, color: [55, 65, 81], maxW: usableW })
            y += 2
          }

          if (parsed.techniques?.length) {
            addText(`Técnicas: ${parsed.techniques.join(', ')}`, { size: 9, color: [107, 114, 128] })
          }

          if (parsed.themes?.length) {
            addText(`Temas: ${parsed.themes.join(', ')}`, { size: 9, color: [107, 114, 128] })
          }

          if (parsed.tasks?.filter(Boolean).length) {
            addText(`Tarefas prescritas: ${parsed.tasks.filter(Boolean).join(' · ')}`, { size: 9, color: [107, 114, 128] })
          }

          if (parsed.next_objectives) {
            addText(`Próxima sessão: ${parsed.next_objectives}`, { size: 9, color: [107, 114, 128] })
          }
        } catch {
          addText(noteContent.substring(0, 500), { size: 9, maxW: usableW })
        }
      }
    } else if (session.status === 'completed') {
      addText('Sessão realizada sem nota clínica registrada.', { size: 9, color: [107, 114, 128] })
    }

    y += 4
  }

  // ── Rodapé ────────────────────────────────────────────────────
  const totalPages = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(180, 180, 180)
    doc.text(
      `Exportado de Vínculo em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")} — uso exclusivo do profissional responsável — Página ${i}/${totalPages}`,
      W / 2, 292, { align: 'center' }
    )
  }

  doc.save(`prontuario-${patient?.full_name.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
}
