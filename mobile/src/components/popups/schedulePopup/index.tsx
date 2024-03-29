import dayjs from 'dayjs';
import React from 'react';
import {FlatList, View} from 'react-native';
import {
  ScheduleFragment,
  useGetAllSchedulesQuery,
} from '../../../generated/graphql';
import {BasicButton} from '../../basicViews/BasicButton';
import {BasicCard} from '../../basicViews/BasicCard';
import {BasicText} from '../../basicViews/BasicText';
import {PopupProps} from '../../popup';

export interface SchedulesWindowProps {
  selectedScheduleId: string;
  onSubmit: (schedule: ScheduleFragment) => void;
  animateClose?: () => void;
}
export const SchedulesWindow: React.FC<SchedulesWindowProps> = ({
  selectedScheduleId,
  onSubmit,
  animateClose,
}) => {
  const {data: schedules} = useGetAllSchedulesQuery();
  const sortedSchedules = [...(schedules?.getAllSchedules || [])].sort((a, b) =>
    dayjs(a.createdAt).diff(b.createdAt),
  );
  return (
    <BasicCard backgroundColor="accentBackground2" style={{maxHeight: 250}}>
      <View style={{width: '100%'}}>
        <BasicText spacing="s" textVariant="button">
          Choose a schedule
        </BasicText>
      </View>
      <View style={{flexDirection: 'row'}}>
        <FlatList
          initialNumToRender={schedules?.getAllSchedules.length}
          keyboardShouldPersistTaps="handled"
          data={sortedSchedules}
          renderItem={({item}) => (
            <BasicButton
              spacing="none"
              backgroundColor="selection"
              variant={selectedScheduleId == item.id ? 'filled' : 'unstyled'}
              style={{
                marginBottom: 5,
                alignItems: 'center',
                paddingHorizontal: 30,
                padding: 10,
              }}
              onPress={() => {
                onSubmit(item);
                animateClose?.();
              }}>
              <BasicText>{item.name}</BasicText>
            </BasicButton>
          )}
        />
      </View>
    </BasicCard>
  );
};
