import {avatarSizes, layoutScale, shadowTokens, typographyScale} from './tokens';

export const commonLayoutWrappers = {
  appBackground: 'bg-background',
  screen: 'flex-1 bg-background',
  screenContent: layoutScale.screenPadding,
  screenContentDense: layoutScale.screenPaddingDense,
  sectionStack: 'gap-6',
  contentStack: 'gap-4',
  rowBetween: 'flex-row items-center justify-between',
  rowStart: 'flex-row items-center',
  surfaceInset: 'rounded-[24px] bg-surfaceMuted',
  divider: 'border-border',
};

export const buttonVariants = {
  base: 'items-center justify-center flex-row gap-2 active:scale-[0.99]',
  sizes: {
    md: 'min-h-[52px] rounded-[20px] px-4 py-3.5',
    lg: 'min-h-[58px] rounded-[24px] px-5 py-4',
  },
  variants: {
    primary: `bg-primary-500 ${shadowTokens.floating.className} active:bg-primary-600`,
    secondary: 'border border-border bg-surfaceMuted active:bg-primary-50',
    accent: 'bg-accent-300 active:bg-accent-400',
    ghost: 'bg-transparent active:bg-primary-50',
  },
  text: {
    primary: 'text-white',
    secondary: 'text-textPrimary',
    accent: 'text-textPrimary',
    ghost: 'text-primary-600',
  },
  states: {
    disabled: 'opacity-60',
    fullWidth: 'w-full',
  },
};

export const inputVariants = {
  wrapper: 'gap-2.5',
  fieldBase: `${layoutScale.fieldHeight} flex-row items-center border px-4`,
  shape: 'rounded-[24px]',
  variants: {
    default: 'bg-surface border-border',
    filled: 'bg-surfaceMuted border-transparent',
    quiet: 'bg-transparent border-border',
  },
  states: {
    error: 'border-danger',
    focused: 'border-primary-300 bg-surfaceElevated',
    disabled: 'opacity-60',
  },
  inputText: `${typographyScale.body.className} flex-1 py-4 text-textPrimary`,
  inputMultiline: 'min-h-[120px] py-4 text-top',
  label: 'pl-1 text-textSecondary',
  helper: 'pl-1 text-textMuted',
  error: 'pl-1 text-danger',
};

export const cardStyles = {
  base: `border rounded-[28px] ${shadowTokens.card.className}`,
  padding: {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  },
  variants: {
    default: 'border-border bg-surface',
    muted: 'border-transparent bg-surfaceMuted',
    accent: 'border-accent-200 bg-accent-50',
    elevated: 'border-borderStrong bg-surfaceElevated',
  },
};

export const badgeStyles = {
  base: 'rounded-full px-3 py-1.5 self-start',
  variants: {
    neutral: {
      container: 'bg-surfaceMuted',
      text: 'text-textSecondary',
    },
    primary: {
      container: 'bg-primary-100',
      text: 'text-primary-700',
    },
    accent: {
      container: 'bg-accent-100',
      text: 'text-textPrimary',
    },
    success: {
      container: 'bg-[#e9f6ef]',
      text: 'text-success',
    },
    warning: {
      container: 'bg-[#fff8e1]',
      text: 'text-warning',
    },
    danger: {
      container: 'bg-[#fdecef]',
      text: 'text-danger',
    },
  },
};

export const tabBarStylingRules = {
  container:
    `absolute bottom-4 left-4 right-4 rounded-[30px] border border-border bg-surface/95 px-3 pb-4 pt-3 shadow-float`,
  row: 'flex-row items-end justify-between gap-2',
  itemWrap: 'flex-1',
  item: 'min-h-[58px] items-center justify-center rounded-[22px] px-2 py-2',
  activeItem: 'bg-primary-50',
  inactiveItem: 'bg-transparent',
  icon: 'mb-1',
  iconText: 'text-[11px] font-semibold uppercase',
  activeLabel: 'text-primary-600',
  inactiveLabel: 'text-textMuted',
  fab: `${layoutScale.fabSize} -mt-9 items-center justify-center rounded-full bg-primary-500 shadow-float`,
  fabOuter: 'min-w-[84px] items-center justify-center px-1',
  fabIcon: 'text-white',
  fabLabel: 'mt-1.5 text-caption text-textSecondary',
};

export const listRowStyles = {
  container: 'min-h-[76px] flex-row items-center gap-3 py-3.5',
  divider: 'border-b border-border',
  content: 'flex-1 justify-center',
  title: 'text-textPrimary',
  subtitle: 'mt-1 text-textSecondary',
  trailingText: 'text-right text-primary-600',
  trailingWrap: 'items-end justify-center gap-1',
  sideWrap: 'items-center justify-center',
};

export const headerStyles = {
  container: 'flex-row items-start justify-between gap-4',
  leadingGroup: 'flex-1 flex-row items-start gap-3',
  backButton: 'h-12 w-12 items-center justify-center rounded-full bg-surfaceMuted',
  titleGroup: 'flex-1',
  subtitle: 'mt-1 max-w-[320px]',
  rightWrap: 'min-h-[48px] items-center justify-center',
};

export const emptyStateStyles = {
  container:
    'w-full items-center rounded-[28px] border border-dashed border-border bg-surfaceMuted px-6 py-8',
  icon: 'h-16 w-16 items-center justify-center rounded-full bg-primary-100',
  title: 'mt-4 text-center',
  description: 'mt-2 text-center',
  action: 'mt-5 w-full',
};

export const loaderStyles = {
  base: 'items-center justify-center gap-3',
  inline: 'py-4',
  fullscreen: 'flex-1',
  card: 'rounded-[24px] border border-border bg-surface px-5 py-6',
};

export const uxStateStyles = {
  formStatus: 'rounded-[20px] bg-surfaceMuted px-4 py-3',
  formStatusText: 'text-center',
};

export const avatarStyleMap = avatarSizes;

export const avatarVariants = {
  primary: {
    container: 'bg-primary-100',
    text: 'text-primary-700',
  },
  accent: {
    container: 'bg-accent-100',
    text: 'text-textPrimary',
  },
  muted: {
    container: 'bg-surfaceMuted',
    text: 'text-textSecondary',
  },
};

export const sectionStyles = {
  container: commonLayoutWrappers.contentStack,
  titleGroup: 'gap-1',
};

export const splashStyles = {
  screen: 'bg-background',
  content: 'flex-1 items-center justify-between px-6 py-8',
  topGlow: 'absolute -left-12 top-8 h-40 w-40 rounded-full bg-primary-100/70',
  bottomGlow: 'absolute -right-10 bottom-16 h-48 w-48 rounded-full bg-accent-100/70',
  centerGroup: 'flex-1 items-center justify-center',
  logoShell: 'shadow-float',
  titleGroup: 'mt-8 items-center gap-2',
  footer: 'w-full items-center gap-2 pb-4',
  progressRow: 'flex-row items-center gap-2',
  progressDot: 'h-2 w-2 rounded-full bg-primary-200',
  progressDotActive: 'bg-primary-500',
};

export const authStyles = {
  screen: 'bg-background',
  keyboard: 'flex-1',
  content: 'flex-grow justify-center px-5 py-6',
  hero: 'items-center pb-7 pt-3',
  heroTitle: 'mt-5 text-center',
  heroSubtitle: 'mt-2 max-w-[300px] text-center',
  formCard: 'rounded-[32px]',
  formStack: 'gap-4.5',
  helperRow: 'flex-row items-center justify-between gap-3 py-1',
  checkboxRow: 'flex-row items-center gap-3',
  checkboxBox:
    'h-6 w-6 items-center justify-center rounded-[8px] border border-borderStrong bg-surface',
  checkboxChecked: 'border-primary-500 bg-primary-500',
  inlineLink: 'text-primary-600',
  promptRow: 'mt-2 flex-row items-center justify-center gap-1',
  footerText: 'text-center',
  footerWrap: 'mt-5 items-center gap-2',
};

export const dashboardStyles = {
  screen: 'bg-background',
  content: 'gap-5 pb-28',
  heroCard: 'overflow-hidden',
  heroTop: 'flex-row items-start justify-between gap-4',
  heroCopy: 'flex-1 gap-2',
  heroGlowPrimary: 'absolute -right-10 -top-8 h-28 w-28 rounded-full bg-primary-100/80',
  heroGlowAccent: 'absolute -left-8 bottom-2 h-20 w-20 rounded-full bg-accent-100/80',
  summaryGrid: 'flex-row gap-3',
  summaryCard: 'flex-1',
  summaryIcon: 'mb-4 h-12 w-12 items-center justify-center rounded-2xl',
  contactRow: 'gap-3 pr-2',
  contactCard: 'w-[86px] items-center gap-3 rounded-[24px] border border-border bg-surface px-3 py-4',
  contactName: 'text-center',
  contactMeta: 'text-center',
  activityCard: 'gap-1',
  activityHeader: 'mb-1 flex-row items-center justify-between',
  sectionHeader: 'flex-row items-center justify-between',
};

export const reportsStyles = {
  screen: 'bg-background',
  content: 'gap-5 pb-28',
  monthRow: 'gap-3 pr-2',
  monthChip: 'rounded-full border border-border bg-surface px-4 py-2',
  monthChipActive: 'border-primary-200 bg-primary-100',
  chartCard: 'overflow-hidden',
  chartGlowPrimary: 'absolute -left-8 -top-8 h-24 w-24 rounded-full bg-primary-100/70',
  chartGlowAccent: 'absolute -right-10 bottom-6 h-28 w-28 rounded-full bg-accent-100/70',
  chartHeader: 'mb-4 flex-row items-start justify-between gap-4',
  chartWrap: 'items-center justify-center py-2',
  chartCenter: 'items-center justify-center',
  legendRow: 'mt-6 flex-row gap-3',
  legendItem: 'flex-1 rounded-[20px] bg-surface px-4 py-3',
  legendTop: 'mb-2 flex-row items-center gap-2',
  legendDot: 'h-3 w-3 rounded-full',
  summaryGrid: 'flex-row gap-3',
  summaryCard: 'flex-1',
  summaryTop: 'mb-3 flex-row items-center justify-between',
  historyCard: 'gap-1',
  historyHeader: 'mb-1 flex-row items-center justify-between',
};

export const peopleStyles = {
  screen: 'bg-background',
  content: 'gap-5 pb-28',
  searchCard: 'gap-4',
  contactCard: 'gap-1',
  contactRow: 'min-h-[88px] flex-row items-center gap-4 py-4',
  contactMeta: 'mt-1',
  balanceWrap: 'items-end gap-1',
  balancePositive: 'text-success',
  balanceNegative: 'text-primary-600',
  addButtonWrap: 'mt-1',
};

export const contactDetailStyles = {
  screen: 'bg-background',
  content: 'gap-5 pb-28',
  infoCard: 'gap-4 overflow-hidden',
  infoGlowPrimary: 'absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary-100/70',
  infoGlowAccent: 'absolute -left-8 bottom-4 h-20 w-20 rounded-full bg-accent-100/70',
  infoTop: 'flex-row items-center gap-4',
  infoCopy: 'flex-1 gap-1',
  summaryCard: 'gap-4',
  summaryTop: 'flex-row items-start justify-between gap-4',
  summaryAmount: 'mt-2',
  splitRow: 'flex-row gap-3',
  splitCard: 'flex-1 rounded-[20px] px-4 py-4',
  splitGave: 'bg-primary-50',
  splitTook: 'bg-accent-50',
  transactionCard: 'gap-1',
  transactionHeader: 'mb-1 flex-row items-center justify-between',
  transactionRow: 'min-h-[84px] flex-row items-center gap-3 py-4',
  transactionMeta: 'mt-1',
  transactionBadge: 'rounded-full px-3 py-1.5',
  transactionBadgeGave: 'bg-primary-100',
  transactionBadgeTook: 'bg-accent-100',
  amountGave: 'text-primary-600',
  amountTook: 'text-success',
  transactionAmountWrap: 'items-end justify-center gap-1',
};

export const addTransactionStyles = {
  screen: 'bg-background',
  content: 'gap-5 pb-28',
  summaryCard: 'gap-4 overflow-hidden',
  summaryGlowPrimary: 'absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary-100/70',
  summaryGlowAccent: 'absolute -left-8 bottom-5 h-20 w-20 rounded-full bg-accent-100/70',
  toggleWrap: 'rounded-[24px] bg-surfaceMuted p-1',
  toggleRow: 'flex-row gap-2',
  toggleButton: 'flex-1 items-center justify-center rounded-[20px] px-4 py-3',
  toggleButtonActiveGave: 'bg-primary-500',
  toggleButtonActiveTook: 'bg-accent-300',
  toggleButtonInactive: 'bg-transparent',
  selectedContact: 'flex-row items-center gap-3 rounded-[24px] border border-border bg-surface px-4 py-4',
  uploadBox:
    'items-center justify-center rounded-[24px] border border-dashed border-borderStrong bg-surfaceMuted px-5 py-8',
  uploadIcon: 'mb-3 h-14 w-14 items-center justify-center rounded-full bg-surface',
  formCard: 'gap-4',
};

export const profileStyles = {
  screen: 'bg-background',
  content: 'gap-5 pb-28',
  heroCard: 'gap-5 overflow-hidden',
  heroGlowPrimary: 'absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary-100/70',
  heroGlowAccent: 'absolute -left-8 bottom-5 h-20 w-20 rounded-full bg-accent-100/70',
  heroTop: 'items-center gap-4',
  heroText: 'items-center gap-1',
  infoCard: 'gap-1',
  infoRow: 'min-h-[72px] flex-row items-center justify-between border-b border-border py-4',
  infoRowLast: 'border-b-0',
  actionCard: 'gap-4',
  logoutButton: 'border-dangerSoft bg-dangerSoft',
};

export const editProfileStyles = {
  screen: 'bg-background',
  content: 'gap-5 pb-28',
  heroCard: 'gap-4 overflow-hidden items-center',
  heroGlowPrimary: 'absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary-100/70',
  heroGlowAccent: 'absolute -left-8 bottom-5 h-20 w-20 rounded-full bg-accent-100/70',
  heroText: 'items-center gap-1',
  imageButton: 'mt-1',
  formCard: 'gap-4',
};

export const changePasswordStyles = {
  screen: 'bg-background',
  content: 'gap-5 pb-28',
  heroCard: 'gap-4 overflow-hidden',
  heroGlowPrimary: 'absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary-100/70',
  heroGlowAccent: 'absolute -left-8 bottom-5 h-20 w-20 rounded-full bg-accent-100/70',
  heroTop: 'items-center gap-3',
  heroText: 'items-center gap-1',
  formCard: 'gap-4',
};

export const transactionHistoryStyles = {
  screen: 'bg-background',
  content: 'gap-5 pb-28',
  filterRow: 'gap-3 pr-2',
  filterChip: 'rounded-full border border-border bg-surface px-4 py-2',
  filterChipActive: 'border-primary-200 bg-primary-100',
  searchCard: 'gap-4',
  listCard: 'gap-1',
  listHeader: 'mb-1 flex-row items-center justify-between',
  row: 'min-h-[88px] flex-row items-center gap-3 py-4',
  rowMeta: 'mt-1',
  statusBadge: 'rounded-full px-3 py-1.5',
  statusGave: 'bg-primary-100',
  statusTook: 'bg-accent-100',
  amountGave: 'text-primary-600',
  amountTook: 'text-success',
  amountWrap: 'items-end justify-center gap-1',
};
