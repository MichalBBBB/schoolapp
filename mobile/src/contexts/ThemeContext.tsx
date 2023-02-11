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

const LighTheme: MyTheme = {
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

const ThemeContext = createContext<
  [MyTheme, Dispatch<SetStateAction<MyTheme>>]
>([LighTheme, () => {}]);

export const useTheme = () => {
  const value = useContext(ThemeContext);
  return value;
};

export const ThemeProvider: React.FC<{}> = ({children}) => {
  const [theme, setTheme] = useState<MyTheme>(LighTheme);
  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};
