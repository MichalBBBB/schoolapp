import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {View} from 'react-native';
import {BasicCard} from '../../../components/basicViews/BasicCard';
import {SettingsItem} from '../../../components/settingsItem';
import {SettingsStackParamList} from '../../../routes/SettingsStack';

export const DateSettingsScreen: React.FC<
  NativeStackScreenProps<SettingsStackParamList, 'DateSettingsScreen'>
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
