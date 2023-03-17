import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
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
import {SelectSubjectPopup} from '../../../components/selectSubject/selectSubjectPopup';
import {Popup} from '../../../components/popup';
import {BasicCard} from '../../../components/basicViews/BasicCard';
import {useSettings} from '../../../utils/useSettings';
import {BasicIcon} from '../../../components/basicViews/BasicIcon';

const TimeTableScreen: React.FC<
  NativeStackScreenProps<SettingsStackParamList, 'TimeTableScreen'>
> = ({navigation}) => {
  const {data, loading: lessonsLoading} = useGetAllLessonsQuery();
  const {data: lessonTimes} = useGetAllLessonTimesQuery();
  const [createLesson] = useCreateLesson();
  const [editLesson] = useEditLesson();
  const [deleteLesson] = useDeleteLesson();

  const [theme] = useTheme();

  const settings = useSettings();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => {
            navigation.navigate('AdvancedTimeTableScreen');
          }}>
          <BasicText>Advanced</BasicText>
          <BasicIcon
            source={require('../../../../assets/Chevron-right.png')}
            style={{height: 25, width: 25, resizeMode: 'stretch'}}
          />
        </Pressable>
      ),
    });
  });

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
                  data={dayNumbers.map(item => item + 1)}
                  width={40}
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
                              <View
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  padding: 2,
                                }}>
                                <SelectSubjectPopup
                                  onSubmit={subject => {
                                    if (subject == null) {
                                      deleteLesson({
                                        id: item.id,
                                      });
                                    } else {
                                      editLesson({
                                        subjectId: subject.id,
                                        id: item.id,
                                      });
                                    }
                                  }}
                                  trigger={
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
                                      spacing="s">
                                      <BasicText numberOfLines={1}>
                                        {item.subject.name}
                                      </BasicText>
                                    </BasicButton>
                                  }
                                />
                              </View>
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

export default TimeTableScreen;
