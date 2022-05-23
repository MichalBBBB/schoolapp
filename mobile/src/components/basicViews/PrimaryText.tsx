import React from 'react';
import {StyleSheet, Text, TextStyle} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

interface PrimaryTextProps {
  style?: TextStyle | undefined;
}

export const PrimaryText: React.FC<PrimaryTextProps> = ({style, children}) => {
  const [theme] = useTheme();
  return (
    <Text style={[style, styles.text, {color: theme.colors.text}]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {},
});
