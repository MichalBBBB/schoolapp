import {TextStyle} from 'react-native';

export type MyTheme = {
  dark: boolean;
  colors: ColorsObject;
  spacing: SpacingObject;
  textVariants: TextVariantsObject;
};

export type ColorsObject = {
  primary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  notification: string;
  accentBackground: string;
  cardView: string;
  accent: string;
  textContrast: string;
  dangerous: string;
  lightBorder: string;
};

export type SpacingObject = {
  none: number;
  s: number;
  m: number;
  l: number;
  xl: number;
};

export type TextVariantsObject = {
  heading: TextStyle;
  body: TextStyle;
  subHeading: TextStyle;
  subText: TextStyle;
  button: TextStyle;
  title: TextStyle;
};
