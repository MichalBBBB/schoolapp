import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {
  ScheduleFragment,
  useGetAllSchedulesQuery,
} from '../../generated/graphql';
import {useEditSchedule} from '../../mutationHooks/schedule/editSchedule';
import {useClearLessonsForDay} from '../../utils/useClearLessonsForDay';
import {useClearSchedulesForDay} from '../../utils/useClearSchedulesForDay';
import {useGetSpecialScheduleForDay} from '../../utils/useSpecialScheduleForDay';
import {BasicButton} from '../basicViews/BasicButton';
import {BasicModalCard} from '../basicViews/BasicModalCard';
import {BasicText} from '../basicViews/BasicText';
import {SettingsItem} from '../listItems/settingsItem';
import {ScheduleWindow} from './scheduleWindow';

interface SpecialScheduleWindowProps {
  visible: boolean;
  onClose: () => void;
  date: dayjs.Dayjs;
}

export const SpecialScheduleWindow: React.FC<SpecialScheduleWindowProps> = ({
  date,
  visible,
  onClose,
}) => {
  const [scheduleWindowVisible, setScheduleWindowVisible] = useState(false);
  const {data: schedules} = useGetAllSchedulesQuery();
  const clearLessons = useClearLessonsForDay();
  const clearSchedules = useClearSchedulesForDay();
  const specialSchedule = useGetSpecialScheduleForDay(date);
  const sortedSchedules = [...(schedules?.getAllSchedules || [])].sort((a, b) =>
    dayjs(a.createdAt).diff(b.createdAt),
  );
  const [selectedSchedule, setSelectedSchedule] =
    useState<ScheduleFragment | null>(null);
  const [editSchedule] = useEditSchedule();

  useEffect(() => {
    if (visible && specialSchedule && scheduleWindowVisible == false) {
      setSelectedSchedule(specialSchedule);
      setScheduleWindowVisible(true);
    }
  }, [visible]);

  return (
    <>
      <BasicModalCard
        isVisible={visible}
        onBackdropPress={onClose}
        alignCard="center">
        <View
          style={{
            width: '100%',
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <BasicText textVariant="subHeading">Choose a schedule</BasicText>
          <BasicButton
            variant="unstyled"
            spacing="none"
            onPress={() => {
              clearSchedules(date);
              clearLessons(date);
              onClose();
            }}>
            <BasicText textVariant="button">Clear</BasicText>
          </BasicButton>
        </View>
        <FlatList
          contentContainerStyle={{paddingHorizontal: 10, minHeight: 300}}
          initialNumToRender={schedules?.getAllSchedules.length}
          keyboardShouldPersistTaps="handled"
          data={sortedSchedules}
          renderItem={({item}) => (
            <SettingsItem
              text={item.name}
              onPress={() => {
                setSelectedSchedule(item);
                if (specialSchedule && specialSchedule?.id !== item.id) {
                  clearSchedules(date);
                  clearLessons(date);
                }
                setScheduleWindowVisible(true);
              }}
              style={{marginBottom: 8}}
            />
          )}
        />
      </BasicModalCard>
      {selectedSchedule && (
        <ScheduleWindow
          visible={scheduleWindowVisible}
          onClose={() => {
            setScheduleWindowVisible(false);
          }}
          onSubmit={() => {
            setScheduleWindowVisible(false);
            onClose();
          }}
          date={date}
          schedule={selectedSchedule}
        />
      )}
    </>
  );
};
