import {TextStyle} from 'react-native';

export type MyTheme = {
  dark: boolean;
  colors: ColorsObject;
  spacing: SpacingObject;
  textVariants: TextVariantsObject;
  subjectColors: SubjectColorsObject;
};

export type ColorsObject = {
  primary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  textTerciary: string;
  border: string;
  notification: string;
  accentBackground1: string;
  accentBackground2: string;
  icon: string;
  modal: string;
  cardView: string;
  accent: string;
  textContrast: string;
  dangerous: string;
  lightBorder: string;
};

export type SubjectColor = {
  primary: string;
  secondary: string;
};

export type SubjectColorsObject = {
  blue: SubjectColor;
  beige: SubjectColor;
  grey: SubjectColor;
  brown: SubjectColor;
  pink: SubjectColor;
  yellow: SubjectColor;
  green: SubjectColor;
  red: SubjectColor;
  purple: SubjectColor;
  darkBlue: SubjectColor;
  darkGreen: SubjectColor;
  orange: SubjectColor;
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
