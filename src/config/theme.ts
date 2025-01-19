import { Zoom } from '@mui/material';
import { grey, red } from '@mui/material/colors';
import { alpha, createTheme, PaletteMode } from '@mui/material/styles';

export const brand = {
  50: '#F4E5FF', // very light violet
  100: '#E4C1FF', // light violet
  200: '#D39DFF', // slightly darker violet
  300: '#C279FF', // medium violet
  400: '#B153FE', // primary shiny violet
  500: '#9F3AFD', // slightly darker shiny violet
  600: '#8C2ADF', // dark violet
  700: '#7421B8', // medium dark violet
  800: '#5B1991', // darker violet
  900: '#45116A', // deepest violet
};

export const getTheme = (mode: PaletteMode) => {
  return createTheme({
    palette: {
      mode,
      background: {
        default: mode === 'dark' ? '#121212' : undefined,
      },
      primary: {
        main: brand[400],
      },
      secondary: {
        main: brand[500],
      },
    },
    components: {
      MuiAccordion: {
        defaultProps: {
          elevation: 0,
          disableGutters: true,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            padding: 8,
            overflow: 'clip',
            backgroundColor: 'hsl(0, 0%, 100%)',
            border: '1px solid',
            borderColor: grey[100],
            ':before': {
              backgroundColor: 'transparent',
            },
            '&:first-of-type': {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            },
            '&:last-of-type': {
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            },
            ...theme.applyStyles('dark', {
              backgroundColor: grey[900],
              borderColor: grey[800],
            }),
          }),
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: ({ theme }) => ({
            border: 'none',
            borderRadius: 8,
            '&:hover': { backgroundColor: grey[100] },
            '&:focus-visible': { backgroundColor: 'transparent' },
            ...theme.applyStyles('dark', {
              '&:hover': { backgroundColor: grey[800] },
            }),
          }),
        },
      },
      MuiAccordionDetails: {
        styleOverrides: {
          root: { mb: 20, border: 'none' },
        },
      },
      MuiButtonBase: {
        defaultProps: {
          disableTouchRipple: false,
          disableRipple: false,
        },
        styleOverrides: {
          root: {
            boxSizing: 'border-box',
            transition: 'all 100ms ease',
            '&:focus-visible': {
              outline: `3px solid ${alpha(brand[400], 0.5)}`,
              outlineOffset: '2px',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            boxShadow: 'none',
            borderRadius: theme.shape.borderRadius,
            textTransform: 'none',
            '&.Mui-disabled': {
              color: alpha(theme.palette.text.primary, 0.3),
              backgroundColor: alpha(
                theme.palette.action.disabledBackground,
                0.12,
              ),
              borderColor: alpha(theme.palette.action.disabledBackground, 0.15),
              boxShadow: 'none',
            },
            variants: [
              {
                props: {
                  size: 'small',
                },
                style: {
                  height: '2rem',
                  padding: '0 0.5rem',
                },
              },
              {
                props: {
                  size: 'medium',
                },
                style: {
                  height: '2.5rem',
                },
              },
              {
                props: {
                  color: 'primary',
                  variant: 'contained',
                },
                style: {
                  color: 'white',
                  backgroundColor: brand[300],
                  backgroundImage: `linear-gradient(to bottom right, ${alpha(
                    brand[400],
                    0.8,
                  )}, ${brand[500]}, ${brand[700]})`,
                  border: `1px solid ${brand[500]}`,
                  '&:hover': {
                    backgroundImage: `linear-gradient(to bottom right, ${brand[500]}, ${brand[700]})`,
                    boxShadow: 'none',
                  },
                  '&:active': {
                    backgroundImage: `linear-gradient(to bottom right, ${brand[700]}, ${brand[900]})`,
                    boxShadow: `inset 0 2.5px 0 ${alpha(brand[700], 0.4)}`,
                  },
                  '&.Mui-disabled': {
                    backgroundColor: alpha(brand[500], 0.4),
                    color: alpha('#fff', 0.5),
                  },
                },
              },
              {
                props: {
                  color: 'error',
                  variant: 'contained',
                },
                style: {
                  color: 'white',
                  backgroundColor: red[300],
                  backgroundImage: `linear-gradient(to bottom right, ${alpha(
                    red[400],
                    0.8,
                  )}, ${red[500]}, ${red[700]})`,
                  border: `1px solid ${red[500]}`,
                  '&:hover': {
                    backgroundImage: `linear-gradient(to bottom right, ${red[500]}, ${red[700]})`,
                    boxShadow: 'none',
                  },
                  '&:active': {
                    backgroundImage: `linear-gradient(to bottom right, ${red[700]}, ${red[900]})`,
                    boxShadow: `inset 0 2.5px 0 ${alpha(red[700], 0.4)}`,
                  },
                  '&.Mui-disabled': {
                    backgroundColor: alpha(red[500], 0.4),
                    color: alpha('#fff', 0.5),
                  },
                },
              },
              {
                props: { variant: 'outlined' },
                style: {
                  color: brand[700],
                  backgroundColor: alpha(brand[300], 0.1),
                  borderColor: alpha(brand[200], 0.8),
                  boxShadow: `inset 0 2px ${alpha(
                    brand[50],
                    0.5,
                  )}, inset 0 -2px ${alpha(brand[200], 0.2)}`,
                  '&:hover': {
                    backgroundColor: alpha(brand[300], 0.2),
                    borderColor: alpha(brand[300], 0.5),
                    boxShadow: 'none',
                  },
                  '&:active': {
                    backgroundColor: alpha(brand[300], 0.3),
                    boxShadow: `inset 0 2.5px 0 ${alpha(brand[400], 0.2)}`,
                    backgroundImage: 'none',
                  },
                  ...theme.applyStyles('dark', {
                    color: brand[200],
                    backgroundColor: alpha(brand[600], 0.1),
                    borderColor: alpha(brand[600], 0.6),
                    boxShadow: `inset 0 2.5px ${alpha(
                      brand[400],
                      0.1,
                    )}, inset 0 -2px ${alpha(grey[900], 0.5)}`,
                    '&:hover': {
                      backgroundColor: alpha(brand[700], 0.2),
                      borderColor: alpha(brand[700], 0.5),
                      boxShadow: 'none',
                    },
                    '&:active': {
                      backgroundColor: alpha(brand[800], 0.2),
                      boxShadow: `inset 0 2.5px 0 ${alpha(brand[900], 0.4)}`,
                      backgroundImage: 'none',
                    },
                    '&.Mui-disabled': {
                      color: alpha(brand[700], 0.4),
                      backgroundColor: alpha(brand[50], 0.1),
                      borderColor: alpha(brand[200], 0.2),
                    },
                  }),
                },
              },
              {
                props: { color: 'secondary', variant: 'outlined' },
                style: {
                  backgroundColor: alpha(grey[300], 0.1),
                  borderColor: alpha(grey[300], 0.5),
                  color: grey[700],
                  '&:hover': {
                    backgroundColor: alpha(grey[300], 0.3),
                    borderColor: alpha(grey[300], 0.5),
                    boxShadow: 'none',
                  },
                  '&:active': {
                    backgroundColor: alpha(grey[300], 0.4),
                    boxShadow: `inset 0 2.5px 0 ${alpha(grey[400], 0.2)}`,
                    backgroundImage: 'none',
                  },
                  ...theme.applyStyles('dark', {
                    color: grey[300],
                    backgroundColor: alpha(grey[600], 0.1),
                    borderColor: alpha(grey[700], 0.5),
                    boxShadow: `inset 0 2.5px ${alpha(
                      grey[600],
                      0.1,
                    )}, inset 0 -2px ${alpha(grey[900], 0.5)}`,
                    '&:hover': {
                      backgroundColor: alpha(grey[700], 0.2),
                      borderColor: alpha(grey[700], 0.5),
                      boxShadow: 'none',
                    },
                    '&:active': {
                      backgroundColor: alpha(grey[800], 0.2),
                      boxShadow: `inset 0 2.5px 0 ${alpha(grey[900], 0.4)}`,
                      backgroundImage: 'none',
                    },
                    '&.Mui-disabled': {
                      color: alpha(grey[700], 0.3),
                      backgroundColor: alpha(grey[200], 0.1),
                      borderColor: alpha(grey[200], 0.4),
                    },
                  }),
                },
              },
              {
                props: {
                  color: 'primary',
                  variant: 'text',
                },
                style: {
                  color: brand[700],
                  '&:hover': {
                    backgroundColor: alpha(brand[300], 0.3),
                  },
                  ...theme.applyStyles('dark', {
                    color: brand[200],
                    '&:hover': {
                      backgroundColor: alpha(brand[700], 0.3),
                    },
                    '&.Mui-disabled': {
                      color: alpha(brand[700], 0.4),
                    },
                  }),
                },
              },
              {
                props: {
                  color: 'info',
                  variant: 'text',
                },
                style: {
                  color: grey[700],
                  '&:hover': {
                    backgroundColor: alpha(grey[300], 0.3),
                  },
                  ...theme.applyStyles('dark', {
                    color: grey[200],
                    '&:hover': {
                      backgroundColor: alpha(grey[700], 0.3),
                    },
                    '&.Mui-disabled': {
                      color: alpha(grey[500], 0.4),
                    },
                  }),
                },
              },
            ],
          }),
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            transition: 'all 100ms ease',
            backgroundColor: grey[50],
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${alpha(grey[200], 0.5)}`,
            boxShadow: 'none',
            ...theme.applyStyles('dark', {
              backgroundColor: alpha(grey[800], 0.6),
              border: `1px solid ${alpha(grey[700], 0.3)}`,
            }),
            variants: [
              {
                props: {
                  variant: 'outlined',
                },
                style: {
                  border: `2px solid ${alpha(grey[700], 0.4)}`,
                  boxShadow: 'none',
                  background: 'transparent',
                },
              },
            ],
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: ({ theme }) => ({
            py: 1.5,
            px: 0.5,
            border: '1px solid',
            borderColor: brand[100],
            fontWeight: 600,
            backgroundColor: brand[50],
            '&:focus-visible': {
              borderColor: brand[300],
              backgroundColor: brand[200],
            },
            '& .MuiChip-label': {
              color: brand[500],
            },
            '& .MuiChip-icon': {
              color: brand[500],
            },
            ...theme.applyStyles('dark', {
              borderColor: `${alpha(brand[500], 0.2)}`,
              backgroundColor: `${alpha(brand[900], 0.5)}`,
              '&:focus-visible': {
                borderColor: brand[500],
                backgroundColor: brand[800],
              },
              '& .MuiChip-label': {
                color: '#fff',
              },
              '& .MuiChip-icon': {
                color: brand[200],
              },
            }),
          }),
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderColor: `${alpha(grey[200], 0.8)}`,
            ...theme.applyStyles('dark', {
              borderColor: `${alpha(grey[700], 0.4)}`,
            }),
          }),
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          asterisk: {
            color: red[500],
          },
          root: ({ theme }) => ({
            typography: theme.typography.caption,
            marginBottom: 8,
          }),
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            variants: [
              {
                props: {
                  size: 'small',
                },
                style: {
                  height: '2rem',
                  width: '2rem',
                },
              },
              {
                props: {
                  size: 'medium',
                },
                style: {
                  height: '2.5rem',
                  width: '2.5rem',
                },
              },
            ],
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            border: 'none',
          },
        },
      },
      MuiLink: {
        defaultProps: {
          underline: 'none',
        },
        styleOverrides: {
          root: {
            fontWeight: 500,
            position: 'relative',
            textDecoration: 'none',
            '&::before': {
              content: '""',
              position: 'absolute',
              width: 0,
              height: '1px',
              bottom: 0,
              left: 0,
              backgroundColor: brand[400],
              opacity: 0.7,
              transition: 'width 0.3s ease, opacity 0.3s ease',
            },
            '&:hover::before': {
              width: '100%',
              opacity: 1,
            },
            '&:focus-visible': {
              outline: `3px solid ${alpha(brand[500], 0.5)}`,
              outlineOffset: '4px',
              borderRadius: '2px',
            },
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
      },
      MuiStack: {
        defaultProps: {
          useFlexGap: true,
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            padding: 0,
            width: 54,
            height: 30,
            '& .MuiSwitch-track': {
              borderRadius: 14,
              backgroundColor: brand[500],
              opacity: 1,
              transition: 'background-color 200ms ease-in-out',
            },
            '& .MuiSwitch-switchBase': {
              padding: 3,
              '&.Mui-checked': {
                transform: 'translateX(25px)',
                '& + .MuiSwitch-track': {
                  backgroundColor: brand[700],
                },
              },
            },
            '& .MuiSwitch-thumb': {
              width: 24,
              height: 26,
              boxShadow: 'none',
              backgroundColor: brand[900],
            },
          },
        },
      },
      MuiTooltip: {
        defaultProps: {
          arrow: true,
          slots: {
            transition: Zoom,
          },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            boxShadow: `0 1px 2px hsla(210, 0%, 0%, 0.05), 0 2px 12px ${alpha(
              brand[200],
              0.5,
            )}`,
            '& .Mui-selected': {
              color: brand[500],
            },
            ...theme.applyStyles('dark', {
              '& .Mui-selected': {
                color: 'hsl(0, 0%, 100%)',
              },
              boxShadow: `0 0 0 1px hsla(210, 0%, 0%, 0.5), 0 2px 12px ${alpha(
                brand[700],
                0.5,
              )}`,
            }),
          }),
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: '12px 16px',
            textTransform: 'none',
            borderRadius: theme.shape.borderRadius,
            fontWeight: 500,
            ...theme.applyStyles('dark', {
              color: grey[400],
              '&.Mui-selected': { color: brand[300] },
            }),
          }),
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            minWidth: 200,
            borderRadius: 8,
            padding: '4px 0',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: '8px 16px',
            fontSize: '0.875rem',
            '&:hover': {
              backgroundColor: grey[100],
            },
            borderRadius: 4,
            margin: '4px 8px',
            ...theme.applyStyles('dark', {
              '&:hover': {
                backgroundColor: grey[900],
              },
            }),
          }),
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            '&.Mui-selected, &.Mui-selected:hover': {
              backgroundColor: brand[100],
              ...theme.applyStyles('dark', {
                backgroundColor: brand[600],
              }),
            },
          }),
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: '32px',
            color: grey[500],
          },
        },
      },
    },
  });
};
