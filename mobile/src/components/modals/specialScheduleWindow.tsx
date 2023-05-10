import dayjs from 'dayjs';
import React, {useState} from 'react';
import {FlatList, View} from 'react-native';
import {
  ScheduleFragment,
  useGetAllSchedulesQuery,
} from '../../generated/graphql';
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
  const sortedSchedules = [...(schedules?.getAllSchedules || [])].sort((a, b) =>
    dayjs(a.createdAt).diff(b.createdAt),
  );
  const [selectedSchedule, setSelectedSchedule] =
    useState<ScheduleFragment | null>(null);
  return (
    <BasicModalCard
      isVisible={visible}
      onBackdropPress={onClose}
      alignCard="center">
      <View style={{width: '100%'}}>
        <BasicText textVariant="subHeading" spacing="s">
          Choose a schedule
        </BasicText>
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
              setScheduleWindowVisible(true);
            }}
            style={{marginBottom: 8}}
          />
        )}
      />
      {selectedSchedule && (
        <ScheduleWindow
          visible={scheduleWindowVisible}
          onClose={() => {
            setScheduleWindowVisible(false);
          }}
          onSubmit={() => {
            setScheduleWindowVisible(false);
          }}
          date={date}
          schedule={selectedSchedule}
        />
      )}
    </BasicModalCard>
  );
};
