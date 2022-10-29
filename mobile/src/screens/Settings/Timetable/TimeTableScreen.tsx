import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text, StyleSheet, Pressable} from 'react-native';
import {
  Cell,
  Col,
  Row,
  Rows,
  Table,
  TableWrapper,
} from 'react-native-table-component';
import {BasicButton} from '../../../components/basicViews/BasicButton';
import SelectSubjectModal from '../../../components/selectSubject';
import {
  GetAllLessonsDocument,
  LessonFragment,
  useCreateLessonMutation,
  useDeleteLessonMutation,
  useEditLessonMutation,
  useGetAllLessonsQuery,
  useGetAllLessonTimesQuery,
} from '../../../generated/graphql';
import {SettingsStackParamList} from '../../../routes/SettingsStack';
import {WEEK_DAYS} from '../../../types/weekDays';

const TimeTableScreen: React.FC<
  NativeStackScreenProps<SettingsStackParamList, 'TimeTableScreen'>
> = () => {
  const [subjectModalIsVisible, setSubjectModalIsVisible] = useState(false);
  const [activeWeekDay, setActiveWeekDay] = useState<string | null>(null);
  const [activeLessonTimeId, setActiveLessonTimeId] = useState<string | null>(
    null,
  );
  const {data, loading: lessonsLoading} = useGetAllLessonsQuery();
  const {data: lessonTimes} = useGetAllLessonTimesQuery();
  const [createLesson] = useCreateLessonMutation();
  const [editLesson] = useEditLessonMutation();
  const [deleteLesson] = useDeleteLessonMutation();

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
      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
            <Row
              data={lessonNumbers}
              widthArr={widthArr}
              style={styles.header}
              textStyle={styles.text}
            />
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              <TableWrapper style={styles.wrapper}>
                <Col data={weekDays} width={40} heightArr={Array(7).fill(80)} />
                <TableWrapper>
                  {tableData.map((row, rowIndex) => (
                    <TableWrapper key={rowIndex} style={styles.row}>
                      {row?.map((item, itemIndex) => (
                        <Cell
                          style={styles.cell}
                          key={itemIndex}
                          data={
                            item ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                }}>
                                <Pressable
                                  style={styles.lesson}
                                  onPress={() => {
                                    setActiveLessonTimeId(
                                      lessonTimes?.getAllLessonTimes[itemIndex]
                                        .id || null,
                                    );
                                    setActiveWeekDay(weekDays[rowIndex]);
                                    setSubjectModalIsVisible(true);
                                  }}>
                                  <Text>{item.subject.name}</Text>
                                </Pressable>
                              </View>
                            ) : (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                }}>
                                <BasicButton
                                  onPress={() => {
                                    setActiveLessonTimeId(
                                      lessonTimes?.getAllLessonTimes[itemIndex]
                                        .id || null,
                                    );
                                    setActiveWeekDay(weekDays[rowIndex]);
                                    setSubjectModalIsVisible(true);
                                  }}
                                  padding={10}>
                                  <Text>Add</Text>
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
      <SelectSubjectModal
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
                variables: {id: existingLesson.id},
                refetchQueries: [GetAllLessonsDocument],
              });
            } else {
              editLesson({
                variables: {subjectId: subject.id, id: existingLesson.id},
                refetchQueries: [GetAllLessonsDocument],
              });
            }
          } else if (subject) {
            createLesson({
              variables: {
                lessonTimeId: activeLessonTimeId!,
                dayOfTheWeek: activeWeekDay!,
                subjectId: subject.id,
              },
              refetchQueries: [GetAllLessonsDocument],
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
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  header: {height: 50, backgroundColor: '#fff'},
  text: {textAlign: 'center', fontWeight: '100'},
  dataWrapper: {marginTop: -1},
  row: {backgroundColor: '#fff', flexDirection: 'row', height: 80},
  cell: {width: 100},
  wrapper: {flexDirection: 'row'},
  lesson: {backgroundColor: '#7c9ab8', padding: 10, borderRadius: 10},
});

export default TimeTableScreen;
