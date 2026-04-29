export type ProtocolModule = {
  id: number;
  titleKey: string;
  descriptionKey: string;
  days: [number, number];
  audioDuration: string;
  level: 'beginner' | 'intermediate-light' | 'intermediate';
};

// Module 1 is the e-book (no daily audio). Modules 2-4 are the audio-guided protocol.
// Per briefing: Mod1=ebook(day0), Mod2=days1-7, Mod3=days8-14, Mod4=days15-28
export const PROTOCOL_MODULES: ProtocolModule[] = [
  {
    id: 1,
    titleKey: 'Fundamentos — O E-book',
    descriptionKey: 'Entende a diástase abdominal, causas e o mecanismo do protocolo',
    days: [1, 7],
    audioDuration: '—',
    level: 'beginner',
  },
  {
    id: 2,
    titleKey: 'Reposicionamento',
    descriptionKey: 'Ativação do transverso abdominal deitada — construindo a base',
    days: [1, 7],
    audioDuration: '8 min',
    level: 'beginner',
  },
  {
    id: 3,
    titleKey: 'Compressão',
    descriptionKey: 'Progressão em pé + técnicas de compressão intra-abdominal',
    days: [8, 14],
    audioDuration: '10 min',
    level: 'intermediate-light',
  },
  {
    id: 4,
    titleKey: 'Ancoragem',
    descriptionKey: 'Movimentos funcionais + integração postural completa',
    days: [15, 28],
    audioDuration: '12 min',
    level: 'intermediate',
  },
];

export type DayStatus = 'locked' | 'available' | 'completed';
