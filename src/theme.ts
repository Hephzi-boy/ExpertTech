import type { TextStyle } from 'react-native';

export const palette = {
  background: '#090C11',
  backgroundAlt: '#0E1218',
  surface: '#12161D',
  surfaceRaised: '#171D25',
  surfaceMuted: '#1F2631',
  border: '#242D3B',
  borderSoft: '#1A202A',
  text: '#F7F8FA',
  textSoft: '#AEB7C7',
  textMuted: '#778195',
  accent: '#3BE178',
  accentStrong: '#1FBF61',
  accentGlow: 'rgba(59, 225, 120, 0.18)',
  highlight: '#FF8A3D',
  highlightSoft: '#FFC46C',
  danger: '#F56B6B',
  shadow: '#000000',
  overlay: 'rgba(5, 7, 11, 0.7)',
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  round: 999,
};

export const iconSize = {
  sm: 18,
  md: 22,
  lg: 28,
};

export const openRundeFontFamilies = {
  regular: 'OpenRunde-Regular',
  medium: 'OpenRunde-Medium',
  semibold: 'OpenRunde-Semibold',
  bold: 'OpenRunde-Bold',
} as const;

export const openRundeFontSources = {
  [openRundeFontFamilies.regular]: {
    uri: 'https://cdn.jsdelivr.net/fontsource/fonts/open-runde@latest/latin-400-normal.ttf',
  },
  [openRundeFontFamilies.medium]: {
    uri: 'https://cdn.jsdelivr.net/fontsource/fonts/open-runde@latest/latin-500-normal.ttf',
  },
  [openRundeFontFamilies.semibold]: {
    uri: 'https://cdn.jsdelivr.net/fontsource/fonts/open-runde@latest/latin-600-normal.ttf',
  },
  [openRundeFontFamilies.bold]: {
    uri: 'https://cdn.jsdelivr.net/fontsource/fonts/open-runde@latest/latin-700-normal.ttf',
  },
} as const;

export function resolveOpenRundeFontFamily(fontWeight?: TextStyle['fontWeight']) {
  if (fontWeight === '500' || fontWeight === 500) {
    return openRundeFontFamilies.medium;
  }

  if (fontWeight === '600' || fontWeight === 600) {
    return openRundeFontFamilies.semibold;
  }

  if (
    fontWeight === 'bold' ||
    fontWeight === '700' ||
    fontWeight === 700 ||
    fontWeight === '800' ||
    fontWeight === 800 ||
    fontWeight === '900' ||
    fontWeight === 900
  ) {
    return openRundeFontFamilies.bold;
  }

  return openRundeFontFamilies.regular;
}
