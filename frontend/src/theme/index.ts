import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { COLORS } from '@/utils/constants';

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: { main: COLORS.primary },
    secondary: { main: COLORS.secondary },
    success: { main: COLORS.success },
    warning: { main: COLORS.warning },
    error: { main: COLORS.danger },
    background: {
      default: mode === 'light' ? COLORS.background : '#0F172A',
      paper: mode === 'light' ? '#FFFFFF' : '#1E293B',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            mode === 'light'
              ? '0 1px 3px rgba(0,0,0,0.08)'
              : '0 1px 3px rgba(0,0,0,0.3)',
        },
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => createTheme(getDesignTokens(mode));
