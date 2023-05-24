import {FetchResult} from '@apollo/client';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {v4} from 'uuid';
import {BasicButton} from '../../../components/basicViews/BasicButton';
import {BasicCard} from '../../../components/basicViews/BasicCard';
import {BasicText} from '../../../components/basicViews/BasicText';
import {SettingsItem} from '../../../components/listItems/settingsItem';
import BasicInputWindow from '../../../components/modals/basicInputWindow';
import {
  CreateScheduleMutation,
  useGetAllSchedulesQuery,
} from '../../../generated/graphql';
import {useCreateSchedule} from '../../../mutationHooks/schedule/createSchedule';
import {SettingsStackScreenProps} from '../../../types/navigationTypes';
import {usePremiumFeature} from '../../../utils/hooks/usePremiumFeature';

export const TimeTableHomeScreen: React.FC<
  SettingsStackScreenProps<'TimeTableHomeScreen'>
> = ({navigation}) => {
  const [createSchedule] = useCreateSchedule();
  const {data: schedules} = useGetAllSchedulesQuery();
  const [newScheduleWindowVisible, setNewScheduleWindowVisible] =
    useState(false);
  const sortedSchedules = [...(schedules?.getAllSchedules || [])].sort((a, b) =>
    dayjs(a.createdAt).diff(b.createdAt),
  );
  const premiumFeature = usePremiumFeature();
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
              console.log(schedules?.getAllSchedules.length);
              if ((schedules?.getAllSchedules.length || 0) >= 3) {
                console.log('here');
                premiumFeature(() => {
                  setNewScheduleWindowVisible(true);
                });
              } else {
                setNewScheduleWindowVisible(true);
              }
            }}>
            <BasicText textVariant="button" spacing="none">
              Add
            </BasicText>
          </BasicButton>
        </View>
        <BasicCard backgroundColor="accentBackground1" marginBottom={20}>
          {sortedSchedules?.map((item, index) => (
            <SettingsItem
              key={index}
              text={item.name}
              onPress={() => {
                navigation.navigate('LessonTimesScreen', {schedule: item});
              }}
            />
          ))}
        </BasicCard>
        <BasicCard backgroundColor="accentBackground1">
          <SettingsItem
            text="Timetable"
            onPress={() => {
              navigation.navigate('TimeTableScreen');
            }}
          />
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
