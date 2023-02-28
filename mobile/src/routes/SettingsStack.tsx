import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import BackButton from '../components/backButton';
import {TabStackParamList} from '../Routes';
import SettingsHomeScreen from '../screens/Settings/SettingsHomeScreen';
import {SubjectScreen} from '../screens/Settings/SubjectScreen';
import LessonTimesScreen from '../screens/Settings/Timetable/LessonTimesScreen';
import TimeTableScreen from '../screens/Settings/Timetable/TimeTableScreen';

export type SettingsStackParamList = {
  SettingsHomeScreen: undefined;
  LessonTimesScreen: undefined;
  TimeTableScreen: undefined;
  SubjectScreen: undefined;
};

const SettingsStack: React.FC<
  BottomTabScreenProps<TabStackParamList, 'SettingsStack'>
> = () => {
  const Stack = createNativeStackNavigator<SettingsStackParamList>();
  return (
    <Stack.Navigator
      screenOptions={({navigation}) => ({
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerBackVisible: false,
        headerLeft: props => {
          if (props.canGoBack) {
            return <BackButton onPress={() => navigation.goBack()} />;
          }
        },
      })}>
      <Stack.Screen
        name="SettingsHomeScreen"
        options={{title: 'Settings'}}
        component={SettingsHomeScreen}
      />
      <Stack.Screen
        name="LessonTimesScreen"
        options={{title: 'Lesson times'}}
        component={LessonTimesScreen}
      />
      <Stack.Screen
        name="TimeTableScreen"
        options={{title: 'Timetable'}}
        component={TimeTableScreen}
      />
      <Stack.Screen
        name="SubjectScreen"
        options={{title: 'Subjects'}}
        component={SubjectScreen}
      />
    </Stack.Navigator>
  );
};

export default SettingsStack;
