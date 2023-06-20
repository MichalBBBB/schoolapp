import {DefaultTheme} from '@react-navigation/native';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import {TextStyle} from 'react-native';
import {MyTheme, SubjectColorsObject} from '../types/Theme';

const lightSubjectColors: SubjectColorsObject = {
  purple: {primary: '#b981da', secondary: '#b981da55'},
  pink: {primary: '#efa7cf', secondary: '#efa7cf55'},
  darkBlue: {primary: '#698de8', secondary: '#698de855'},
  blue: {primary: '#a2cffe', secondary: '#a2cffe55'},
  darkGreen: {primary: '#479253', secondary: '#47925355'},
  green: {primary: '#95e3c0', secondary: '#95e3c055'},
  yellow: {primary: '#e9d32a', secondary: '#e9d32a55'},
  beige: {primary: '#efc5b5', secondary: '#efc5b555'},
  orange: {primary: '#f6a265', secondary: '#f6a26555'},
  red: {primary: '#f66565', secondary: '#f6656555'},
  brown: {primary: '#ad8d56', secondary: '#ad8d5655'},
  grey: {primary: '#a5a49f', secondary: '#a5a49f55'},
};

export const LightTheme: MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',
    background: '#f5f5f5',
    card: '#f5f5f5',
    accentBackground1: 'white',
    accentBackground2: 'white',
    modal: '#f5f5f5',
    textSecondary: 'grey',
    textTerciary: '#c8c8c8',
    cardView: '#f5f5f5',
    accent: 'black',
    textContrast: 'white',
    dangerous: 'red',
    dangerousBackground: '#FF000055',
    lightBorder: '#aaa',
    icon: 'black',
  },
  spacing: {
    none: 0,
    s: 6,
    m: 12,
    l: 16,
    xl: 24,
  },
  textVariants: {
    heading: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    subHeading: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    body: {},
    subText: {},
    button: {
      fontWeight: 'bold',
    },
  },
  subjectColors: lightSubjectColors,
};

export const DarkTheme: MyTheme = {
  ...LightTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    text: 'white',
    primary: 'white',
    background: 'black',
    card: 'black',
    accentBackground1: '#181818',
    accentBackground2: '#232323',
    modal: '#181818',
    textSecondary: 'grey',
    textTerciary: '#535353',
    cardView: '#eee',
    accent: '#c4c4c4',
    textContrast: 'black',
    dangerous: 'red',
    dangerousBackground: '#FF000055',
    lightBorder: '#aaa',
    icon: 'grey',
  },
};

const ThemeContext = createContext<
  [MyTheme, Dispatch<SetStateAction<MyTheme>>]
>([LightTheme, () => {}]);

export const useTheme = () => {
  const value = useContext(ThemeContext);
  return value;
};

export const ThemeProvider: React.FC<{}> = ({children}) => {
  const [theme, setTheme] = useState<MyTheme>(DarkTheme);
  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};
