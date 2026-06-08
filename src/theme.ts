export interface ThemeType {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  onSurface: string;
  onSurfaceVariant: string;
  border: string;
  success: string;
  error: string;
  onError: string;
  borderRadius: string;
  borderRadiusMedium: string;
  borderRadiusFull: string;
}

// Helper per generare i colori di supporto (superfici, contenitori) partendo dai colori base
export const generateTheme = (primary: string, secondary: string, background: string): ThemeType => {
  return {
    primary,
    onPrimary: "#141218",
    primaryContainer: `${primary}33`, // 20% opacità per il contenitore
    onPrimaryContainer: primary,
    
    secondary,
    onSecondary: "#141218",
    secondaryContainer: `${secondary}25`,
    onSecondaryContainer: secondary,

    tertiary: "#FFB1C8",
    onTertiary: "#5E1133",
    tertiaryContainer: "#7D294C",
    onTertiaryContainer: "#FFD8E4",

    background,
    surface: background === "#141218" ? "#211F26" : `${background}e0`, // Superficie leggermente più chiara dello sfondo
    surfaceVariant: "#49454F",
    onSurface: "#E6E1E5",
    onSurfaceVariant: "#CAC4D0",
    
    border: `${primary}40`, // Bordo coordinato col colore primario
    success: "#81C784",
    error: "#F2B8B5",
    onError: "#601410",
    
    borderRadius: "28px",
    borderRadiusMedium: "16px",
    borderRadiusFull: "100px",
  };
};

// Temi predefiniti pronti all'uso
export const themePresets = {
  lavanda: {
    name: "🌌 Lavanda Spaziale",
    primary: "#D0BCFF",
    secondary: "#7FCFFF",
    background: "#141218"
  },
  menta: {
    name: "🌿 Menta Rilassante",
    primary: "#80F3D1",
    secondary: "#80D8FF",
    background: "#0F1F1B"
  },
  arancia: {
    name: "🍊 Arancia Energetica",
    primary: "#FFB74D",
    secondary: "#FF8A65",
    background: "#1F160F"
  },
  rosa: {
    name: "🦄 Rosa Unicorno",
    primary: "#F48FB1",
    secondary: "#CE93D8",
    background: "#1F111A"
  },
  abisso: {
    name: "🌊 Abisso Blu",
    primary: "#90CAF9",
    secondary: "#80CBC4",
    background: "#0B131F"
  }
};
