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
  blue: {primary: '#a2cffe', secondary: '#a2cffe55'},
  beige: {primary: '#efc5b5', secondary: '#efc5b555'},
  grey: {primary: '#a5a49f', secondary: '#a5a49f55'},
  brown: {primary: '#ad8d56', secondary: '#ad8d5655'},
  pink: {primary: '#efa7cf', secondary: '#efa7cf55'},
  yellow: {primary: '#e9d32a', secondary: '#e9d32a55'},
  green: {primary: '#95e3c0', secondary: '#95e3c055'},
  red: {primary: '#ffa180', secondary: '#ffa18055'},
};

export const LightTheme: MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',
    background: '#eee',
    card: '#eee',
    accentBackground1: 'white',
    accentBackground2: 'white',
    modal: '#eee',
    textSecondary: 'grey',
    cardView: '#eee',
    accent: 'black',
    textContrast: 'white',
    dangerous: 'red',
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
    cardView: '#eee',
    accent: '#a1a1a1',
    textContrast: '',
    dangerous: 'red',
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
