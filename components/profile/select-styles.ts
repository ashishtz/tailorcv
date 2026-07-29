import type { GroupBase, StylesConfig } from 'react-select'

/** Option shape shared by every skills-related react-select instance. */
export interface SkillOption {
  value: string
  label: string
  __isNew__?: boolean
}

/* Atelier palette values (react-select styles need raw CSS values). */
const STONE = {
  200: '#e7e5e4',
  300: '#d6d3d1',
  400: '#a8a29e',
  500: '#78716c',
  600: '#57534e',
  700: '#44403c',
  900: '#1c1917',
} as const

const BRAND = {
  50: '#f0fbf9',
  100: '#d7f4ef',
  500: '#0e9384',
  700: '#0a655c',
  800: '#0b514a',
  900: '#0a433e',
} as const

const BRAND_RING = 'rgba(14, 147, 132, 0.2)'

/**
 * react-select styles aligned with the kit's Input/Select controls
 * (stone hairlines, brand focus ring). `compact` is the inline quick-add
 * variant used inside skill category panels.
 */
function makeSelectStyles<IsMulti extends boolean>(
  compact: boolean
): StylesConfig<SkillOption, IsMulti, GroupBase<SkillOption>> {
  return {
    control: (base, state) => ({
      ...base,
      minHeight: compact ? 36 : 40,
      fontSize: compact ? 13 : 14,
      borderRadius: 8,
      backgroundColor: '#ffffff',
      borderColor: state.isFocused ? BRAND[500] : STONE[300],
      boxShadow: state.isFocused ? `0 0 0 2px ${BRAND_RING}` : 'none',
      transition: 'border-color 150ms ease, box-shadow 150ms ease',
      '&:hover': { borderColor: state.isFocused ? BRAND[500] : STONE[400] },
    }),
    valueContainer: (base) => ({ ...base, padding: compact ? '0 10px' : '2px 12px' }),
    input: (base) => ({ ...base, margin: 0, padding: 0, color: STONE[900] }),
    placeholder: (base) => ({ ...base, color: STONE[400] }),
    singleValue: (base) => ({ ...base, color: STONE[900] }),
    option: (base, state) => ({
      ...base,
      fontSize: compact ? 13 : 14,
      padding: '8px 12px',
      cursor: 'pointer',
      color: state.isSelected ? BRAND[800] : STONE[700],
      backgroundColor: state.isSelected ? BRAND[100] : state.isFocused ? BRAND[50] : '#ffffff',
      ':active': { backgroundColor: BRAND[100] },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 8,
      border: `1px solid ${STONE[200]}`,
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      overflow: 'hidden',
    }),
    // Menus render in a portal on document.body so they can escape modal
    // and card overflow; sit above the modal (z-50) but below toasts (z-100).
    menuPortal: (base) => ({ ...base, zIndex: 80 }),
    multiValue: (base) => ({ ...base, backgroundColor: BRAND[50], borderRadius: 9999 }),
    multiValueLabel: (base) => ({
      ...base,
      color: BRAND[800],
      fontSize: 13,
      padding: '2px 4px 2px 10px',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: BRAND[700],
      borderRadius: '0 9999px 9999px 0',
      paddingRight: 6,
      ':hover': { backgroundColor: BRAND[100], color: BRAND[900] },
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base) =>
      compact
        ? { ...base, display: 'none' }
        : { ...base, color: STONE[400], ':hover': { color: STONE[600] } },
    clearIndicator: (base) => ({ ...base, color: STONE[400], ':hover': { color: STONE[600] } }),
    noOptionsMessage: (base) => ({ ...base, color: STONE[500], fontSize: compact ? 13 : 14 }),
    loadingMessage: (base) => ({ ...base, color: STONE[500], fontSize: compact ? 13 : 14 }),
  }
}

export const singleSelectStyles = makeSelectStyles<false>(false)
export const multiSelectStyles = makeSelectStyles<true>(false)
export const compactSelectStyles = makeSelectStyles<false>(true)
