import {DefaultTheme} from '@react-navigation/native';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import {TextStyle} from 'react-native';
import {MyTheme} from '../types/Theme';

const LightTheme: MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',
    background: 'white',
    card: 'white',
    accentBackground: '#eee',
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
    l: 20,
    xl: 30,
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
};

const DarkTheme: MyTheme = {
  ...LightTheme,
  colors: {
    ...DefaultTheme.colors,
    text: 'white',
    primary: 'white',
    background: 'black',
    card: 'black',
    accentBackground: '#eee',
    textSecondary: 'green',
    cardView: '#eee',
    accent: 'black',
    textContrast: 'white',
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
