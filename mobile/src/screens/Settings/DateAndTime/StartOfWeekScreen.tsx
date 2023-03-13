import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useEffect, useLayoutEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import BackButton from '../../../components/backButton';
import {BasicCard} from '../../../components/basicViews/BasicCard';
import {BasicRadio} from '../../../components/basicViews/BasicRadio';
import {BasicText} from '../../../components/basicViews/BasicText';
import {useMeQuery} from '../../../generated/graphql';
import {useSetSettings} from '../../../mutationHooks/settings/setSettings';
import {SettingsStackParamList} from '../../../routes/SettingsStack';
import {useSettings} from '../../../utils/useSettings';

const startOfWeekOptions = [
  ['MON', 'Monday'],
  ['SUN', 'Sunday'],
  ['SAT', 'Saturday'],
];

export const StartOfWeekScreen: React.FC<
  NativeStackScreenProps<SettingsStackParamList, 'StartOfWeekScreen'>
> = ({navigation}) => {
  const settings = useSettings();
  const [selectedDay, setSelectedDay] = useState<string>('MON');
  const [setSettings] = useSetSettings();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackButton
          onPress={() => {
            navigation.goBack();
            setSettings({startOfWeek: selectedDay});
          }}
        />
      ),
    });
  });

  useEffect(() => {
    setSelectedDay(settings?.startOfWeek || 'MON');
  }, [settings]);
  return (
    <View style={styles.container}>
      <BasicCard backgroundColor="accentBackground" gap={10} spacing="m">
        {startOfWeekOptions.map((item, index) => (
          <View style={styles.item} key={index}>
            <BasicRadio
              onToggle={() => {
                setSelectedDay(item[0]);
              }}
              toggled={selectedDay == item[0]}
              style={{marginRight: 10}}
            />
            <BasicText>{item[1]}</BasicText>
          </View>
        ))}
      </BasicCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
