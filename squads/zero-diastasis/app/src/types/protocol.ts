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
  { id: 1, titleKey: 'module1.title', descriptionKey: 'module1.description', days: [1, 7], audioDuration: '8 min', level: 'beginner' },
  { id: 2, titleKey: 'module2.title', descriptionKey: 'module2.description', days: [1, 7], audioDuration: '8 min', level: 'beginner' },
  { id: 3, titleKey: 'module3.title', descriptionKey: 'module3.description', days: [8, 14], audioDuration: '10 min', level: 'intermediate-light' },
  { id: 4, titleKey: 'module4.title', descriptionKey: 'module4.description', days: [15, 28], audioDuration: '12 min', level: 'intermediate' },
];

export type DayStatus = 'locked' | 'available' | 'completed';
