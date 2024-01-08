import React, {useState} from 'react';
import {View} from 'react-native';
import {LessonFragment} from '../../generated/graphql';
import {useDeleteLesson} from '../../mutationHooks/lesson/deleteLesson';
import {useEditLesson} from '../../mutationHooks/lesson/editLesson';
import {SubjectColorsObject} from '../../types/Theme';
import {BasicButton} from '../basicViews/BasicButton';
import {BasicCard} from '../basicViews/BasicCard';
import {BasicText} from '../basicViews/BasicText';
import {BasicTextInput} from '../basicViews/BasicTextInput';
import {SelectSubjectPopup} from '../popups/selectSubject/selectSubjectPopup';

interface TimeTableLessonProps {
  lesson: LessonFragment;
}

export const TimeTableLesson: React.FC<TimeTableLessonProps> = ({lesson}) => {
  const [editLesson] = useEditLesson();
  const [deleteLesson] = useDeleteLesson();
  const [extraInfo, setExtraInfo] = useState(lesson.extraInfo);
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
      }}>
      <SelectSubjectPopup
        onSubmit={subject => {
          if (subject == null) {
            deleteLesson({
              id: lesson.id,
            });
          } else {
            editLesson({
              subjectId: subject.id,
              id: lesson.id,
            });
          }
        }}
        trigger={
          <BasicButton backgroundColor="background" spacing="none">
            <BasicCard
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              borderWidth={1}
              spacing="s"
              subjectColor={
                lesson.subject.colorName as keyof SubjectColorsObject
              }>
              <View style={{alignItems: 'center'}}>
                <BasicText numberOfLines={1}>{lesson.subject.name}</BasicText>
                <BasicTextInput
                  placeholder="Description"
                  variant="unstyled"
                  defaultValue={lesson.extraInfo || ''}
                  onChangeText={value => {
                    setExtraInfo(value);
                  }}
                  onBlur={() => {
                    editLesson({
                      subjectId: lesson.subject.id,
                      id: lesson.id,
                      extraInfo,
                    });
                  }}
                />
              </View>
            </BasicCard>
          </BasicButton>
        }
      />
    </View>
  );
};
