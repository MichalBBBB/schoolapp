import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {v4} from 'uuid';
import {BasicButton} from '../../../components/basicViews/BasicButton';
import {BasicCard} from '../../../components/basicViews/BasicCard';
import {BasicText} from '../../../components/basicViews/BasicText';
import {SettingsItem} from '../../../components/listItems/settingsItem';
import BasicInputWindow from '../../../components/modals/basicInputWindow';
import {useGetAllSchedulesQuery} from '../../../generated/graphql';
import {useCreateSchedule} from '../../../mutationHooks/schedule/createSchedule';
import {SettingsStackScreenProps} from '../../../utils/types';

export const TimeTableHomeScreen: React.FC<
  SettingsStackScreenProps<'TimeTableHomeScreen'>
> = ({navigation}) => {
  const [createSchedule] = useCreateSchedule();
  const {data: schedules} = useGetAllSchedulesQuery();
  const [newScheduleWindowVisible, setNewScheduleWindowVisible] =
    useState(false);
  return (
    <>
      <ScrollView style={{padding: 10}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 5,
            paddingHorizontal: 5,
            alignItems: 'center',
          }}>
          <BasicText color="textSecondary">Schedules</BasicText>
          <BasicButton
            variant="unstyled"
            onPress={() => {
              setNewScheduleWindowVisible(true);
            }}>
            <BasicText textVariant="button" spacing="none">
              Add
            </BasicText>
          </BasicButton>
        </View>
        <BasicCard backgroundColor="accentBackground1">
          {schedules?.getAllSchedules.map((item, index) => (
            <SettingsItem
              key={index}
              text={item.name}
              onPress={() => {
                navigation.navigate('LessonTimesScreen', {schedule: item});
              }}
            />
          ))}
        </BasicCard>
      </ScrollView>
      <BasicInputWindow
        visible={newScheduleWindowVisible}
        onClose={() => {
          setNewScheduleWindowVisible(false);
        }}
        onSubmit={value => {
          createSchedule({name: value, id: v4()});
          setNewScheduleWindowVisible(false);
        }}
      />
    </>
  );
};
