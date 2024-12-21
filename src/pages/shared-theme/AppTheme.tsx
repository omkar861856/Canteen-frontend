import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { inputsCustomizations } from './customizations/inputs';
import { dataDisplayCustomizations } from './customizations/dataDisplay';
import { feedbackCustomizations } from './customizations/feedback';
import { navigationCustomizations } from './customizations/navigation';
import { surfacesCustomizations } from './customizations/surfaces';
import { colorSchemes,shadows, shape } from './themePrimitives';

interface AppThemeProps {
  children: React.ReactNode;
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions['components'];
}

export default function AppTheme({
  children,
  disableCustomTheme,
  themeComponents,
}: AppThemeProps) {
  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
        // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
        cssVariables: {
          colorSchemeSelector: 'data-mui-color-scheme',
          cssVarPrefix: 'template',
        },
        colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
        typography: {
          fontFamily: 'Roboto, Arial, sans-serif',
          h1: {
            fontFamily: 'Roboto, Arial, sans-serif',
            fontWeight: 700,
            fontSize: '2.5rem',
          },
          h2: {
            fontWeight: 700,
            fontSize: '2rem',
          },
          body1: {
            fontFamily: 'Roboto, Arial, sans-serif',
            fontWeight: 400,
            fontSize: '1rem',
          },
          subtitle1: {
            fontFamily: 'Merriweather, Georgia, serif',
            fontWeight: 400,
            fontStyle: 'italic',
          },
        },
        shadows,
        shape,
        components: {
          ...inputsCustomizations,
          ...dataDisplayCustomizations,
          ...feedbackCustomizations,
          ...navigationCustomizations,
          ...surfacesCustomizations,
          ...themeComponents,
        },
      });
  }, [disableCustomTheme, themeComponents]);
  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
