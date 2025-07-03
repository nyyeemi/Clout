import {Platform} from 'react-native';

import {DarkTheme, DefaultTheme, Theme} from '@react-navigation/native';

/* example theme:
export const DefaultTheme: Theme = {
  dark: false,
  colors: {
    primary: 'rgb(0, 122, 255)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)',
  },
  fonts,
}; */
const WEB_FONT_STACK =
  'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

const fonts = Platform.select({
  web: {
    regular: {
      fontFamily: WEB_FONT_STACK,
      fontWeight: '400',
    },
    medium: {
      fontFamily: WEB_FONT_STACK,
      fontWeight: '500',
    },
    bold: {
      fontFamily: WEB_FONT_STACK,
      fontWeight: '600',
    },
    heavy: {
      fontFamily: WEB_FONT_STACK,
      fontWeight: '700',
    },
  },
  ios: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '600',
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '700',
    },
  },
  default: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'sans-serif',
      fontWeight: '600',
    },
    heavy: {
      fontFamily: 'sans-serif',
      fontWeight: '700',
    },
  },
} as const satisfies Record<string, Theme['fonts']>);

export type ExtendedTheme = Theme & {
  colors: Theme['colors'] & {
    highlighted: string;
    warning: string;
    iosBlue: string;
    textSecondary: string;
  };
};

export const MyLightTheme: ExtendedTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#E74C3C',
    highlighted: 'rgb(215, 193, 193)',
    warning: 'rgb(255, 0, 52)',
    iosBlue: '#007AFF',
    textSecondary: '#6e6e6e', // #999999 #8e8e93
    //background: 'rgb(255, 255, 255)',
    //card: 'rgb(242, 242, 242)',
  },
  fonts,
};

export const MyDarkTheme: ExtendedTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#E74C3C',
    highlighted: 'rgb(64, 64, 64)',
    warning: 'rgb(255, 0, 52)',
    background: 'rgb(12, 12, 12)',
    border: 'rgb(73, 73, 77)',
    iosBlue: '#007AFF',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    card: 'rgb(23, 23, 23)',
  },
  fonts,
};
