import {DefaultTheme} from '@react-navigation/native';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import {Theme} from '../types/Theme';

type MyTheme = Theme & {colors: {cardView: string}};

const LighTheme: MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
    card: 'white',
    accentBackground: '#eee',
    textSecondary: 'grey',
    cardView: 'eee',
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
