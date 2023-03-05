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

const LightTheme: MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',
    background: '#eee',
    card: '#eee',
    accentBackground: 'white',
    textSecondary: 'grey',
    cardView: '#eee',
    accent: 'black',
    textContrast: 'white',
    dangerous: 'red',
    lightBorder: '#aaa',
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
    subHeading: {},
    body: {},
    subText: {},
    button: {
      fontWeight: 'bold',
    },
  },
  subjectColors: lightSubjectColors,
};

const DarkTheme: MyTheme = {
  ...LightTheme,
  colors: {
    ...DefaultTheme.colors,
    text: 'white',
    primary: 'white',
    background: 'black',
    card: 'black',
    accentBackground: '#181818',
    textSecondary: 'grey',
    cardView: '#eee',
    accent: 'grey',
    textContrast: '',
    dangerous: 'red',
    lightBorder: '#aaa',
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
  const [theme, setTheme] = useState<MyTheme>(LightTheme);
  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};
