export const colorPalette = {
  background: '#f8f6fb',
  surface: '#fffdfd',
  surfaceMuted: '#f0ebf7',
  surfaceElevated: '#ffffff',
  border: '#e8def2',
  borderStrong: '#d6c8e8',
  textPrimary: '#231933',
  textSecondary: '#6e6280',
  textMuted: '#9b91ab',
  primary: '#9442f1',
  primaryDark: '#6528ad',
  primarySoft: '#f3edff',
  accent: '#e5e844',
  accentStrong: '#d3db2a',
  accentSoft: '#fcfce7',
  success: '#4f9f72',
  successSoft: '#e9f6ef',
  warning: '#e5b93c',
  warningSoft: '#fff8e1',
  danger: '#d95f70',
  dangerSoft: '#fdecef',
  white: '#ffffff',
  black: '#000000',
};

export const typographyScale = {
  hero: {
    className: 'text-hero font-bold tracking-[-0.4px]',
    size: 32,
    lineHeight: 38,
  },
  title: {
    className: 'text-title font-bold tracking-[-0.3px]',
    size: 24,
    lineHeight: 30,
  },
  sectionTitle: {
    className: 'text-section font-semibold',
    size: 18,
    lineHeight: 24,
  },
  body: {
    className: 'text-body font-normal',
    size: 15,
    lineHeight: 22,
  },
  caption: {
    className: 'text-caption font-normal',
    size: 13,
    lineHeight: 18,
  },
  button: {
    className: 'text-[15px] leading-5 font-semibold',
    size: 15,
    lineHeight: 20,
  },
  overline: {
    className: 'text-[12px] leading-4 font-semibold uppercase tracking-[1px]',
    size: 12,
    lineHeight: 16,
  },
};

export const spacingScale = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
};

export const radiusScale = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 32,
  pill: 999,
};

export const shadowTokens = {
  soft: {
    className: 'shadow-soft',
    elevation: 2,
    description: 'Subtle surface depth',
  },
  card: {
    className: 'shadow-card',
    elevation: 4,
    description: 'Default card elevation',
  },
  floating: {
    className: 'shadow-float',
    elevation: 8,
    description: 'Primary call-to-action and FAB elevation',
  },
};

export const avatarSizes = {
  xs: {
    container: 'h-8 w-8',
    text: 'text-xs',
  },
  sm: {
    container: 'h-10 w-10',
    text: 'text-sm',
  },
  md: {
    container: 'h-12 w-12',
    text: 'text-base',
  },
  lg: {
    container: 'h-16 w-16',
    text: 'text-xl',
  },
  xl: {
    container: 'h-20 w-20',
    text: 'text-2xl',
  },
};

export const layoutScale = {
  screenPadding: 'px-5 py-4',
  screenPaddingDense: 'px-4 py-4',
  cardInset: 'p-5',
  fieldHeight: 'min-h-[56px]',
  tabBarHeight: 'h-[72px]',
  fabSize: 'h-16 w-16',
};
