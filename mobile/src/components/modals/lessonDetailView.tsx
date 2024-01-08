import React from 'react';
import {CalendarEventFragment, LessonFragment} from '../../generated/graphql';
import {CalendarNavigationProp} from '../../utils/types';
import {BasicModalCard} from '../basicViews/BasicModalCard';
import {BasicText} from '../basicViews/BasicText';
import {Lesson} from '../calendarView/lesson';

interface LessonDetailViewProps {
  visible: boolean;
  onClose: () => void;
  lesson: LessonFragment;
  event?: CalendarEventFragment;
  navigation: CalendarNavigationProp;
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({
  visible,
  onClose,
  lesson,
  event,
  navigation,
}) => {
  return (
    <BasicModalCard
      isVisible={visible}
      onBackdropPress={onClose}
      alignCard="center"
      spacing="l">
      <BasicText textVariant="heading" style={{marginBottom: 10}}>
        Lesson
      </BasicText>
      <Lesson
        navigation={navigation}
        lesson={lesson}
        event={event}
        onEventPress={event => {
          onClose();
          navigation.navigate('EventDetailScreen', {event});
        }}
      />
    </BasicModalCard>
  );
};
