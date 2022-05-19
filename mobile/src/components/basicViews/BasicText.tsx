import React from 'react';
import {Text} from 'react-native';

interface BasicTextProps {
  text: string;
  color: string | undefined;
  fontFamily: string | undefined;
}

export const BasicText: React.FC<BasicTextProps> = ({
  text,
  color,
  fontFamily,
}) => {
  return <Text style={{color, fontFamily}}>{text}</Text>;
};
