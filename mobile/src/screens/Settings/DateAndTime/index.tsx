import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {BasicCard} from '../../../components/basicViews/BasicCard';
import {SettingsItem} from '../../../components/listItems/settingsItem';
import {SettingsStackScreenProps} from '../../../types/navigationTypes';

export const DateSettingsScreen: React.FC<
  SettingsStackScreenProps<'DateSettingsScreen'>
> = ({navigation}) => {
  return (
    <ScrollView style={styles.container}>
      <BasicCard
        backgroundColor="accentBackground1"
        spacing="s"
        gap={10}
        marginBottom={10}>
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
