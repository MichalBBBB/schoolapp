import dayjs from 'dayjs';
import React, {useMemo} from 'react';
import {FlatList, View} from 'react-native';
import {v4} from 'uuid';
import {
  LessonTimeFragment,
  ScheduleFragment,
  useGetAllLessonsQuery,
} from '../../generated/graphql';
import {useCreateLesson} from '../../mutationHooks/lesson/createLesson';
import {useEditSchedule} from '../../mutationHooks/schedule/editSchedule';
import {BasicButton} from '../basicViews/BasicButton';
import {BasicModalCard} from '../basicViews/BasicModalCard';
import {BasicText} from '../basicViews/BasicText';
import {calendarConfigWithoutTime} from '../listItems/task';
import {TimeTableLesson} from '../listItems/timetableLesson';
import {SelectSubjectPopup} from '../popups/selectSubject/selectSubjectPopup';

interface ScheduleWindowProps {
  date: dayjs.Dayjs;
  schedule: ScheduleFragment;
  onClose: () => void;
  onSubmit: () => void;
  visible: boolean;
}

export const ScheduleWindow: React.FC<ScheduleWindowProps> = ({
  schedule,
  onClose,
  onSubmit,
  visible,
  date,
}) => {
  const [createLesson] = useCreateLesson();
  const {data: lessons} = useGetAllLessonsQuery();
  const [editSchedule] = useEditSchedule();

  const list = useMemo(() => {
    return schedule.lessonTimes.map(item => {
      const lesson = lessons?.getAllLessons.find(
        lesson =>
          lesson.lessonTime.id == item.id &&
          dayjs(lesson.date).isSame(date, 'day'),
      );
      if (lesson) {
        return lesson;
      } else {
        return item;
      }
    });
  }, [schedule, lessons]);
  return (
    <BasicModalCard
      onBackdropPress={onClose}
      isVisible={visible}
      alignCard="center"
      style={{maxHeight: 500}}>
      <View style={{padding: 10, width: '100%'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 10,
          }}>
          <BasicButton variant="unstyled" spacing="none" onPress={onClose}>
            <BasicText textVariant="button">Back</BasicText>
          </BasicButton>
          <BasicButton
            variant="unstyled"
            spacing="none"
            onPress={() => {
              editSchedule({
                id: schedule.id,
                dates: schedule.dates
                  ? schedule.dates?.concat([date.toDate()])
                  : [date.toDate()],
              });
              onSubmit();
            }}>
            <BasicText textVariant="button">Done</BasicText>
          </BasicButton>
        </View>
        <View>
          <BasicText
            style={{textAlign: 'center'}}
            textVariant="subHeading">{`Schedule for ${date.calendar(
            null,
            calendarConfigWithoutTime,
          )}`}</BasicText>
          <BasicText
            style={{textAlign: 'center'}}
            textVariant="button"
            color="textSecondary">
            {schedule.name}
          </BasicText>
        </View>
      </View>
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={list}
        renderItem={({item, index}) => (
          <View style={{maxHeight: 80, padding: 5}} key={index}>
            {item.__typename == 'Lesson' ? (
              <TimeTableLesson lesson={item} />
            ) : (
              <View
                style={{
                  width: '100%',
                  height: '100%',
                }}>
                <SelectSubjectPopup
                  onSubmit={subject => {
                    if (subject) {
                      createLesson({
                        id: v4(),
                        date: date,
                        lessonTimeId: item.id,
                        subjectId: subject.id,
                      });
                    }
                  }}
                  trigger={
                    <BasicButton
                      style={{width: '100%', height: '100%'}}
                      backgroundColor="accentBackground1"
                      spacing="m">
                      <BasicText textVariant="button">Add</BasicText>
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          padding: 10,
                        }}>
                        <BasicText color="textSecondary">{`${
                          (item as LessonTimeFragment).startTime
                        } - ${
                          (item as LessonTimeFragment).endTime
                        }`}</BasicText>
                      </View>
                    </BasicButton>
                  }
                />
              </View>
            )}
          </View>
        )}
      />
    </BasicModalCard>
  );
};
