'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bold, Italic, List, Mic, MicOff, Lock, Save,
  Tag, Target, CheckSquare, Clock,
} from 'lucide-react'
import { encryptNote } from '@/lib/crypto'
import { getSessionPassword } from '@/lib/session-key'

const TECHNIQUES = [
  'TCC', 'ACT', 'DBT', 'EMDR', 'Gestalt', 'Psicanálise',
  'Humanista', 'Sistêmica', 'IFS', 'SFBT', 'Schema', 'Mindfulness',
]

const THEME_SUGGESTIONS = [
  'Ansiedade', 'Autoestima', 'Relacionamentos', 'Trauma', 'Luto',
  'Identidade', 'Limites', 'Família', 'Trabalho', 'Depressão', 'Fobia',
]

interface NoteEditorProps {
  sessionId: string
  patientName: string
  sessionNumber: number
  existingNote?: {
    content_encrypted: string
    content_iv: string
    content_salt: string
    is_immutable: boolean
    decryptedContent?: string
  }
  onSave: (encrypted: {
    content_encrypted: string
    content_iv: string
    content_salt: string
    techniques: string[]
    themes: string[]
    tasks: string[]
    next_objectives: string
  }) => Promise<void>
}

export function NoteEditor({
  sessionId, patientName, sessionNumber, existingNote, onSave,
}: NoteEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [content, setContent] = useState(existingNote?.decryptedContent ?? '')
  const [techniques, setTechniques] = useState<string[]>([])
  const [themes, setThemes] = useState<string[]>([])
  const [themeInput, setThemeInput] = useState('')
  const [tasks, setTasks] = useState<string[]>([''])
  const [nextObjectives, setNextObjectives] = useState('')
  const [recording, setRecording] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const isImmutable = existingNote?.is_immutable ?? false

  // Voice to text (Web Speech API)
  const toggleVoice = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voz para texto não suportado neste navegador.')
      return
    }

    if (recording) {
      recognitionRef.current?.stop()
      setRecording(false)
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new SpeechRecognitionAPI() as any
    recognition.lang = 'pt-BR'
    recognition.continuous = true
    recognition.interimResults = true

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((r: any) => r[0].transcript)
        .join('')
      if (editorRef.current) {
        editorRef.current.textContent = content + ' ' + transcript
      }
    }

    recognition.onend = () => setRecording(false)
    recognition.start()
    recognitionRef.current = recognition
    setRecording(true)
  }, [recording, content])

  function execCommand(cmd: string) {
    document.execCommand(cmd, false)
    editorRef.current?.focus()
  }

  function toggleTechnique(t: string) {
    setTechniques(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  function addTheme() {
    const t = themeInput.trim()
    if (t && !themes.includes(t)) {
      setThemes(prev => [...prev, t])
      setThemeInput('')
    }
  }

  function updateTask(i: number, value: string) {
    setTasks(prev => { const n = [...prev]; n[i] = value; return n })
  }

  function addTask() {
    setTasks(prev => [...prev, ''])
  }

  async function handleSave() {
    const password = getSessionPassword()
    if (!password) return

    const rawContent = editorRef.current?.innerHTML ?? content
    if (!rawContent.trim()) return

    setSaving(true)

    // Monta o conteúdo completo da nota
    const fullContent = JSON.stringify({
      html: rawContent,
      techniques,
      themes,
      tasks: tasks.filter(Boolean),
      next_objectives: nextObjectives,
    })

    const encrypted = await encryptNote(fullContent, password)

    await onSave({
      ...encrypted,
      techniques,
      themes,
      tasks: tasks.filter(Boolean),
      next_objectives: nextObjectives,
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (isImmutable) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-neutral-secondary bg-neutral-mist px-3 py-2 rounded-lg">
          <Lock size={12} />
          Nota bloqueada após 24h — CFP Res. 001/2009
        </div>
        {existingNote?.decryptedContent && (
          <div
            className="prose prose-sm max-w-none text-neutral-charcoal bg-white rounded-xl p-4 border border-neutral-border min-h-[120px]"
            dangerouslySetInnerHTML={{ __html: (() => {
              try { return JSON.parse(existingNote.decryptedContent).html }
              catch { return existingNote.decryptedContent }
            })() }}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Encryption badge */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-xs text-brand-teal bg-brand-teal/8 px-3 py-2 rounded-lg border border-brand-teal/20"
      >
        <Lock size={12} />
        Nota criptografada — apenas você pode ler (AES-256-GCM)
      </motion.div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 pb-2 border-b border-neutral-border flex-wrap">
        {[
          { icon: Bold,   cmd: 'bold',       tip: 'Negrito' },
          { icon: Italic, cmd: 'italic',     tip: 'Itálico' },
          { icon: List,   cmd: 'insertUnorderedList', tip: 'Lista' },
        ].map(({ icon: Icon, cmd, tip }) => (
          <button
            key={cmd}
            onClick={() => execCommand(cmd)}
            title={tip}
            className="p-2 rounded-lg hover:bg-neutral-mist text-neutral-secondary hover:text-neutral-charcoal transition-all"
          >
            <Icon size={15} strokeWidth={2} />
          </button>
        ))}

        <div className="w-px h-5 bg-neutral-border mx-1" />

        <motion.button
          onClick={toggleVoice}
          animate={recording ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            recording
              ? 'bg-semantic-danger text-white'
              : 'border border-neutral-border text-neutral-secondary hover:border-brand-teal/40 hover:text-brand-teal'
          }`}
        >
          {recording ? <MicOff size={13} /> : <Mic size={13} />}
          {recording ? 'Parar' : 'Voz'}
        </motion.button>

        <div className="ml-auto">
          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              saved
                ? 'bg-semantic-success text-white'
                : 'bg-brand-teal text-white hover:bg-brand-teal-dark'
            }`}
          >
            <Save size={13} />
            {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar nota'}
          </motion.button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
        data-placeholder="Escreva as evoluções da sessão..."
        className="min-h-[180px] text-sm text-neutral-charcoal leading-relaxed focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-neutral-secondary/50"
        dangerouslySetInnerHTML={{ __html: existingNote?.decryptedContent
          ? (() => { try { return JSON.parse(existingNote.decryptedContent).html } catch { return existingNote.decryptedContent } })()
          : '' }}
      />

      {/* Techniques */}
      <div className="pt-4 border-t border-neutral-border">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Tag size={13} strokeWidth={1.5} className="text-brand-teal" />
          <p className="text-xs font-semibold text-neutral-charcoal">Técnicas utilizadas</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TECHNIQUES.map((t) => (
            <motion.button
              key={t}
              onClick={() => toggleTechnique(t)}
              whileTap={{ scale: 0.93 }}
              className={`px-2.5 py-1 rounded-badge text-xs font-medium transition-all ${
                techniques.includes(t)
                  ? 'bg-brand-teal text-white'
                  : 'bg-neutral-mist text-neutral-secondary hover:bg-neutral-border/50'
              }`}
            >
              {t}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Themes */}
      <div className="pt-4 border-t border-neutral-border">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Tag size={13} strokeWidth={1.5} className="text-brand-teal" />
          <p className="text-xs font-semibold text-neutral-charcoal">Temas da sessão</p>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {THEME_SUGGESTIONS.filter(t => !themes.includes(t)).map((t) => (
            <button
              key={t}
              onClick={() => setThemes(prev => [...prev, t])}
              className="px-2.5 py-1 rounded-badge text-xs text-neutral-secondary bg-neutral-mist hover:bg-neutral-border/50 transition-all"
            >
              + {t}
            </button>
          ))}
        </div>
        {themes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {themes.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1 px-2.5 py-1 rounded-badge text-xs bg-brand-sand text-brand-teal font-medium"
              >
                {t}
                <button onClick={() => setThemes(prev => prev.filter(x => x !== t))} className="hover:opacity-60">×</button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={themeInput}
            onChange={(e) => setThemeInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTheme() } }}
            placeholder="Adicionar tema personalizado..."
            className="flex-1 px-3 py-1.5 rounded-input border border-neutral-border bg-white text-xs focus:outline-none focus:ring-1 focus:ring-brand-teal"
          />
          <button onClick={addTheme} className="px-3 py-1.5 rounded-input bg-neutral-mist text-xs font-medium hover:bg-neutral-border/50 transition-all">
            + Add
          </button>
        </div>
      </div>

      {/* Tasks */}
      <div className="pt-4 border-t border-neutral-border">
        <div className="flex items-center gap-1.5 mb-2.5">
          <CheckSquare size={13} strokeWidth={1.5} className="text-brand-teal" />
          <p className="text-xs font-semibold text-neutral-charcoal">Tarefas prescritas</p>
        </div>
        <div className="space-y-2">
          {tasks.map((task, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded border-2 border-neutral-border flex-shrink-0" />
              <input
                value={task}
                onChange={(e) => updateTask(i, e.target.value)}
                placeholder={`Tarefa ${i + 1}...`}
                className="flex-1 px-3 py-1.5 rounded-input border border-neutral-border bg-white text-xs focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
          ))}
          <button onClick={addTask} className="text-xs text-brand-teal hover:text-brand-teal-dark">
            + Adicionar tarefa
          </button>
        </div>
      </div>

      {/* Next objectives */}
      <div className="pt-4 border-t border-neutral-border">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Target size={13} strokeWidth={1.5} className="text-brand-teal" />
          <p className="text-xs font-semibold text-neutral-charcoal">Objetivos para a próxima sessão</p>
        </div>
        <textarea
          value={nextObjectives}
          onChange={(e) => setNextObjectives(e.target.value)}
          rows={2}
          placeholder="O que trabalhar na próxima sessão..."
          className="w-full px-3.5 py-2.5 rounded-input border border-neutral-border bg-white text-xs text-neutral-charcoal placeholder:text-neutral-secondary/60 focus:outline-none focus:ring-1 focus:ring-brand-teal resize-none"
        />
      </div>
    </div>
  )
}
