import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text, StyleSheet, Pressable} from 'react-native';
import {
  Cell,
  Col,
  Row,
  Table,
  TableWrapper,
} from 'react-native-table-component';
import {BasicButton} from '../../../components/basicViews/BasicButton';
import {BasicText} from '../../../components/basicViews/BasicText';
import SelectSubjectWindow from '../../../components/selectSubject';
import {
  LessonFragment,
  useGetAllLessonsQuery,
  useGetAllLessonTimesQuery,
} from '../../../generated/graphql';
import {SettingsStackParamList} from '../../../routes/SettingsStack';
import {WEEK_DAYS} from '../../../types/weekDays';
import {v4 as uuidv4} from 'uuid';
import {useCreateLesson} from '../../../mutationHooks/lesson/createLesson';
import {useEditLesson} from '../../../mutationHooks/lesson/editLesson';
import {useDeleteLesson} from '../../../mutationHooks/lesson/deleteLesson';
import {useTheme} from '../../../contexts/ThemeContext';
import {SubjectColorsObject} from '../../../types/Theme';

const TimeTableScreen: React.FC<
  NativeStackScreenProps<SettingsStackParamList, 'TimeTableScreen'>
> = () => {
  const {data, loading: lessonsLoading} = useGetAllLessonsQuery();
  const {data: lessonTimes} = useGetAllLessonTimesQuery();
  const [createLesson] = useCreateLesson();
  const [editLesson] = useEditLesson();
  const [deleteLesson] = useDeleteLesson();

  const [theme] = useTheme();

  const [subjectModalIsVisible, setSubjectModalIsVisible] = useState(false);
  const [activeWeekDay, setActiveWeekDay] = useState<string | null>(null);
  const [activeLessonTimeId, setActiveLessonTimeId] = useState<string | null>(
    null,
  );

  const lessonNumbers = [
    '',
    ...(lessonTimes?.getAllLessonTimes.map(
      (item, index) => index + 1,
    ) as number[]),
  ];
  const weekDays = Object.keys(WEEK_DAYS);
  const widthArr = [40, ...Array(lessonNumbers.length - 1).fill(100)];
  const tableData:
    | Array<Array<LessonFragment | undefined> | undefined>
    | undefined = weekDays.map((weekDay, weekDayIndex) => {
    return lessonTimes?.getAllLessonTimes.map(lessonTime => {
      const lesson = data?.getAllLessons.find(item => {
        if (
          item.lessonTime.id == lessonTime.id &&
          item.dayOfTheWeek == weekDay
        ) {
          return true;
        } else {
          return false;
        }
      });
      return lesson;
    });
  });

  if (lessonsLoading) {
    return <Text>Loading...</Text>;
  }
  return (
    <View style={styles.container}>
      <ScrollView horizontal={true} style={{paddingHorizontal: 10}}>
        <View>
          <Table
            borderStyle={{borderWidth: 1, borderColor: 'transparent'}}
            style={{backgroundColor: theme.colors.background}}>
            <Row
              data={lessonNumbers}
              widthArr={widthArr}
              style={styles.header}
              textStyle={styles.text}
            />
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table
              borderStyle={{borderWidth: 1, borderColor: 'transparent'}}
              style={{backgroundColor: theme.colors.background}}>
              <TableWrapper
                style={{
                  flexDirection: 'row',
                }}>
                <Col data={weekDays} width={40} heightArr={Array(7).fill(80)} />
                <TableWrapper>
                  {tableData.map((row, rowIndex) => (
                    <TableWrapper key={rowIndex} style={styles.row}>
                      {row?.map((item, itemIndex) => (
                        <Cell
                          style={{
                            width: 100,
                            backgroundColor: theme.colors.background,
                          }}
                          key={itemIndex}
                          data={
                            item ? (
                              <View
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  padding: 2,
                                }}>
                                <BasicButton
                                  variant="subject"
                                  subjectColor={
                                    item.subject
                                      .colorName as keyof SubjectColorsObject
                                  }
                                  borderWidth={1}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                  }}
                                  spacing="s"
                                  onPress={() => {
                                    setActiveLessonTimeId(
                                      lessonTimes?.getAllLessonTimes[itemIndex]
                                        .id || null,
                                    );
                                    setActiveWeekDay(weekDays[rowIndex]);
                                    setSubjectModalIsVisible(true);
                                  }}>
                                  <BasicText numberOfLines={1}>
                                    {item.subject.name}
                                  </BasicText>
                                </BasicButton>
                              </View>
                            ) : (
                              <View
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  padding: 2,
                                }}>
                                <BasicButton
                                  style={{width: '100%', height: '100%'}}
                                  backgroundColor="accentBackground"
                                  onPress={() => {
                                    setActiveLessonTimeId(
                                      lessonTimes?.getAllLessonTimes[itemIndex]
                                        .id || null,
                                    );
                                    setActiveWeekDay(weekDays[rowIndex]);
                                    setSubjectModalIsVisible(true);
                                  }}
                                  spacing="m">
                                  <BasicText>Add</BasicText>
                                </BasicButton>
                              </View>
                            )
                          }
                        />
                      ))}
                    </TableWrapper>
                  ))}
                </TableWrapper>
              </TableWrapper>
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
      <SelectSubjectWindow
        isVisible={subjectModalIsVisible}
        onClose={() => setSubjectModalIsVisible(false)}
        onSubmit={subject => {
          console.log(subject, activeLessonTimeId, activeWeekDay);
          const existingLesson = data?.getAllLessons.find(lesson => {
            return (
              lesson.dayOfTheWeek == activeWeekDay &&
              lesson.lessonTime.id == activeLessonTimeId
            );
          });
          if (existingLesson) {
            if (subject == null) {
              deleteLesson({
                id: existingLesson.id,
              });
            } else {
              editLesson({
                subjectId: subject.id,
                id: existingLesson.id,
              });
            }
          } else if (subject) {
            createLesson({
              id: uuidv4(),
              lessonTimeId: activeLessonTimeId!,
              dayOfTheWeek: activeWeekDay!,
              subjectId: subject.id,
            });
          }

          setSubjectModalIsVisible(false);
          setActiveLessonTimeId(null);
          setActiveWeekDay(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {height: 50},
  text: {textAlign: 'center', fontWeight: '100'},
  dataWrapper: {marginTop: -1},
  row: {backgroundColor: '#fff', flexDirection: 'row', height: 80},
});

export default TimeTableScreen;
