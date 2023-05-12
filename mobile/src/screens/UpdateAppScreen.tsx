import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {BasicText} from '../components/basicViews/BasicText';
import {useTheme} from '../contexts/ThemeContext';

export const UpdateAppScreen = () => {
  const [theme] = useTheme();
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
      <BasicText textVariant="heading" style={{textAlign: 'center'}}>
        Please update Dayto
      </BasicText>
      <BasicText color="textSecondary" style={{textAlign: 'center'}}>
        We made some changes that are not compatible with this version
      </BasicText>
    </View>
  );
};
