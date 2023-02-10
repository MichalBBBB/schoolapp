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
  },
  spacing: {
    none: 0,
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    heading: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    subHeading: {},
    body: {},
    subText: {},
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
