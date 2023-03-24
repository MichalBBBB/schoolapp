import {
  BottomTabBarProps,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {View} from 'react-native';
import {BasicCard} from '../../../components/basicViews/BasicCard';
import {SettingsItem} from '../../../components/settingsItem';
import {SettingsStackScreenProps} from '../../../utils/types';

export const DateSettingsScreen: React.FC<
  SettingsStackScreenProps<'DateSettingsScreen'>
> = ({navigation}) => {
  return (
    <ScrollView style={styles.container}>
      <BasicCard backgroundColor="accentBackground1" spacing="m" gap={10}>
        <SettingsItem
          text="Start of week"
          onPress={() => {
            navigation.navigate('StartOfWeekScreen');
          }}
        />
      </BasicCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});