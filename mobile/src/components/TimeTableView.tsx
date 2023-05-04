import React from 'react';
import {Pressable, Text, View, ScrollView, StyleSheet} from 'react-native';
import {
  Table,
  Row,
  TableWrapper,
  Col,
  Cell,
} from 'react-native-table-component';
import {useTheme} from '../contexts/ThemeContext';
import {
  useGetAllLessonsQuery,
  useGetAllLessonTimesQuery,
  LessonFragment,
} from '../generated/graphql';
import {useCreateLesson} from '../mutationHooks/lesson/createLesson';
import {SettingsStackScreenProps} from '../utils/types';
import {useSettings} from '../utils/useSettings';
import {BasicButton} from './basicViews/BasicButton';
import {BasicIcon} from './basicViews/BasicIcon';
import {BasicText} from './basicViews/BasicText';
import {TimeTableLesson} from './listItems/timetableLesson';
import {SelectSubjectPopup} from './popups/selectSubject/selectSubjectPopup';
import {v4 as uuidv4} from 'uuid';

export const TimeTableView = () => {
  const {data, loading: lessonsLoading} = useGetAllLessonsQuery();
  const {data: lessonTimes} = useGetAllLessonTimesQuery();
  const [createLesson] = useCreateLesson();

  const [theme] = useTheme();

  const settings = useSettings();

  const lessonNumbers = [
    '',
    ...(lessonTimes?.getAllLessonTimes.map(
      (item, index) => index + 1,
    ) as number[]),
  ];

  const dayNumbers = Array(settings?.lengthOfRotation)
    .fill(0)
    .map((item, index) => index);

  const widthArr = [40, ...Array(lessonNumbers.length - 1).fill(100)];
  const tableData:
    | Array<Array<LessonFragment | undefined> | undefined>
    | undefined = dayNumbers.map((dayNumber, weekDayIndex) => {
    return lessonTimes?.getAllLessonTimes.map(lessonTime => {
      const lesson = data?.getAllLessons.find(item => {
        if (
          item.lessonTime.id == lessonTime.id &&
          item.dayNumber == dayNumber
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
      <ScrollView
        horizontal={true}
        contentContainerStyle={{paddingHorizontal: 20}}>
        <View>
          <Table
            borderStyle={{borderWidth: 1, borderColor: 'transparent'}}
            style={{backgroundColor: theme.colors.background}}>
            <Row
              data={lessonNumbers}
              widthArr={widthArr}
              style={styles.header}
              textStyle={{
                textAlign: 'center',
                fontWeight: '100',
                color: theme.colors.text,
              }}
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
                <Col
                  data={dayNumbers.map(item => `Day ${item + 1}`)}
                  width={50}
                  heightArr={Array(settings?.lengthOfRotation).fill(80)}
                  textStyle={{color: theme.colors.text}}
                />
                <TableWrapper>
                  {tableData.map((row, rowIndex) => (
                    <TableWrapper key={rowIndex} style={styles.row}>
                      {row?.map((item, itemIndex) => (
                        <Cell
                          textStyle={{}}
                          style={{
                            width: 100,
                            backgroundColor: theme.colors.background,
                          }}
                          key={itemIndex}
                          data={
                            item ? (
                              <TimeTableLesson lesson={item} />
                            ) : (
                              <View
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  padding: 2,
                                }}>
                                <SelectSubjectPopup
                                  onSubmit={subject => {
                                    if (subject && lessonTimes) {
                                      createLesson({
                                        id: uuidv4(),
                                        lessonTimeId:
                                          lessonTimes.getAllLessonTimes[
                                            itemIndex
                                          ].id,
                                        dayNumber: rowIndex,
                                        subjectId: subject.id,
                                      });
                                    }
                                  }}
                                  trigger={
                                    <BasicButton
                                      style={{width: '100%', height: '100%'}}
                                      backgroundColor="accentBackground1"
                                      spacing="m">
                                      <BasicText>Add</BasicText>
                                    </BasicButton>
                                  }
                                />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {height: 50},
  dataWrapper: {marginTop: -1},
  row: {backgroundColor: '#fff', flexDirection: 'row', height: 80},
});
