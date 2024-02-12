import {DefaultTheme} from '@react-navigation/native';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import {TextStyle} from 'react-native';
import {MyTheme, SubjectColorsObject, TextVariantsObject} from '../types/Theme';

const lightSubjectColors: SubjectColorsObject = {
  green: {primary: '#66e8d7', secondary: '#66e8d755'},
  blue: {primary: '#a2cffe', secondary: '#a2cffe55'},
  darkBlue: {primary: '#698de8', secondary: '#698de855'},
  darkGreen: {primary: '#479253', secondary: '#47925355'},
  grey: {primary: '#a5a49f', secondary: '#a5a49f55'},
  purple: {primary: '#b981da', secondary: '#b981da55'},
  brown: {primary: '#80673d', secondary: '#80673d55'},
  beige: {primary: '#e8c99e', secondary: '#e8c99e55'},
  pink: {primary: '#ffb6cb', secondary: '#ffb6cb55'},
  darkYellow: {primary: '#b28a11', secondary: '#b28a1160'},
  orange: {primary: '#f6a265', secondary: '#f6a26555'},
  darkPink: {primary: '#de4de3', secondary: '#de4de355'},
  yellow: {primary: '#eaed8c', secondary: '#eaed8c55'},
  red: {primary: '#f66565', secondary: '#f6656555'},
};

const textVariants: TextVariantsObject = {
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
  menuItem: {
    fontSize: 15,
  },
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
    accentBackground3: 'white',
    modal: '#f5f5f5',
    textSecondary: 'grey',
    textTerciary: '#c8c8c8',
    cardView: '#f5f5f5',
    accent: '#348465',
    accentBackground: '#34846522',
    // accent: '#32ba78',
    textContrast: 'white',
    dangerous: '#df0000',
    dangerousBackground: '#FF000055',
    lightBorder: '#aaa',
    icon: 'black',
    selection: '#f5f5f5',
  },
  spacing: {
    none: 0,
    s: 6,
    m: 12,
    l: 16,
    xl: 24,
  },
  textVariants: textVariants,
  subjectColors: lightSubjectColors,
};

export const DarkTheme: MyTheme = {
  ...LightTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    text: 'white',
    primary: 'white',
    background: '#0a0a0a',
    card: '#0a0a0a',
    accentBackground1: '#181818',
    accentBackground2: '#232323',
    accentBackground3: '#2d2d2d',
    modal: '#181818',
    textSecondary: 'grey',
    textTerciary: '#535353',
    cardView: '#eee',
    // accent: '#c4c4c4',
    accent: '#3f9c78',
    accentBackground: '#3f9c7822',
    textContrast: 'black',
    dangerous: 'red',
    dangerousBackground: '#FF000055',
    lightBorder: '#aaa',
    icon: 'grey',
    border: '#4f4f4f',
    selection: '#2d2d2d',
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
