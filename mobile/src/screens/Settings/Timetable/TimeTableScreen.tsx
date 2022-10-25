import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {
  Col,
  Row,
  Rows,
  Table,
  TableWrapper,
} from 'react-native-table-component';
import {
  useGetAllLessonsQuery,
  useGetAllLessonTimesQuery,
} from '../../../generated/graphql';
import {SettingsStackParamList} from '../../../routes/SettingsStack';
import {WEEK_DAYS} from '../../../types/weekDays';

const TimeTableScreen: React.FC<
  NativeStackScreenProps<SettingsStackParamList, 'TimeTableScreen'>
> = () => {
  const {data, loading: lessonsLoading} = useGetAllLessonsQuery();
  const {data: lessonTimes} = useGetAllLessonTimesQuery();
  if (lessonsLoading) {
    return <Text>Loading...</Text>;
  }
  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        <Table borderStyle={{borderWidth: 1}} style={{width: 500}}>
          <Row
            data={['', ...Object.keys(WEEK_DAYS)]}
            style={styles.head}
            flexArr={[1, 2, 1, 1, 1, 1, 1, 1]}
          />
          <ScrollView>
            <TableWrapper style={styles.wrapper}>
              <Col
                heightArr={[28, 28]}
                style={styles.title}
                data={lessonTimes?.getAllLessonTimes.map((item, index) => {
                  return index + 1;
                })}
              />

              <Rows
                flexArr={[2, 1, 1, 1, 1, 1, 1]}
                style={styles.row}
                data={Array(lessonTimes?.getAllLessonTimes.length).fill(
                  Array(7).fill('a'),
                )}
              />
            </TableWrapper>
          </ScrollView>
        </Table>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  head: {height: 40, backgroundColor: '#f1f8ff'},
  wrapper: {flexDirection: 'row'},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 28},
  text: {textAlign: 'center'},
});

export default TimeTableScreen;
