import { create } from 'zustand';
import { ThemeType, generateTheme, themePresets } from '../theme.ts';

interface AppState {
  currentPage: 'home' | 'math' | 'italian' | 'geometry';
  mathGrade: number;
  italianGrade: number;
  geometryGrade: number;
  // Stato del Tema
  currentTheme: ThemeType;
  themeConfig: {
    primary: string;
    secondary: string;
    background: string;
    presetKey: string;
  };
  
  setCurrentPage: (page: 'home' | 'math' | 'italian' | 'geometry') => void;
  setMathGrade: (grade: number) => void;
  setItalianGrade: (grade: number) => void;
  setGeometryGrade: (grade: number) => void;
  
  // Azioni del Tema
  applyPreset: (presetKey: keyof typeof themePresets) => void;
  updateCustomColor: (type: 'primary' | 'secondary' | 'background', color: string) => void;
}

const defaultPreset = themePresets.lavanda;

export const useStore = create<AppState>((set) => ({
  currentPage: 'home',
  mathGrade: 1,
  italianGrade: 1,
  geometryGrade: 1,
  
  // Tema iniziale
  currentTheme: generateTheme(defaultPreset.primary, defaultPreset.secondary, defaultPreset.background),
  themeConfig: {
    primary: defaultPreset.primary,
    secondary: defaultPreset.secondary,
    background: defaultPreset.background,
    presetKey: 'lavanda'
  },

  setCurrentPage: (page) => set({ currentPage: page }),
  setMathGrade: (grade) => set({ mathGrade: grade }),
  setItalianGrade: (grade) => set({ italianGrade: grade }),
  setGeometryGrade: (grade) => set({ geometryGrade: grade }),

  applyPreset: (presetKey) => set((state) => {
    const preset = themePresets[presetKey];
    return {
      currentTheme: generateTheme(preset.primary, preset.secondary, preset.background),
      themeConfig: {
        primary: preset.primary,
        secondary: preset.secondary,
        background: preset.background,
        presetKey
      }
    };
  }),

  updateCustomColor: (type, color) => set((state) => {
    const newConfig = {
      ...state.themeConfig,
      [type]: color,
      presetKey: 'custom' // Imposta su custom se l'utente modifica manualmente
    };
    return {
      themeConfig: newConfig,
      currentTheme: generateTheme(newConfig.primary, newConfig.secondary, newConfig.background)
    };
  })
}));
