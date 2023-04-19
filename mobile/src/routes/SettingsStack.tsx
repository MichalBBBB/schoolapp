import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import BackButton from '../components/backButton';
import {TabStackParamList} from '../Routes';
import {DateSettingsScreen} from '../screens/Settings/DateAndTime';
import {StartOfWeekScreen} from '../screens/Settings/DateAndTime/StartOfWeekScreen';
import {ProfileScreen} from '../screens/Settings/Profile';
import {ChangePasswordScreen} from '../screens/Settings/Profile/ChangePasswordScreen';

import SettingsHomeScreen from '../screens/Settings/SettingsHomeScreen';
import {AdvancedTimeTableScreen} from '../screens/Settings/Timetable/AdvancedTimeTableScreen';
import LessonTimesScreen from '../screens/Settings/Timetable/LessonTimesScreen';
import TimeTableScreen from '../screens/Settings/Timetable/TimeTableScreen';
import {SettingsStackParamList} from '../utils/types';

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
        name="DateSettingsScreen"
        options={{title: 'Date and time'}}
        component={DateSettingsScreen}
      />
      <Stack.Screen
        name="StartOfWeekScreen"
        options={{title: 'Start of week'}}
        component={StartOfWeekScreen}
      />
      <Stack.Screen
        name="AdvancedTimeTableScreen"
        options={{title: 'Advanced'}}
        component={AdvancedTimeTableScreen}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{title: 'Change Password'}}
      />
    </Stack.Navigator>
  );
};

export default SettingsStack;
