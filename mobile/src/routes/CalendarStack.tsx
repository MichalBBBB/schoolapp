import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import BackButton from '../components/backButton';
import {CalendarEventFragment} from '../generated/graphql';
import {TabStackParamList} from '../Routes';
import CalendarHomeScreen from '../screens/Calendar/CalendarHomeScreen';
import EventDetailScreen from '../screens/Calendar/EventDetailScreen';
import ProjectDetailScreen from '../screens/Projects/ProjectDetailScreen';
import {ProjectMembersScreen} from '../screens/Projects/ProjectMembersScreen';
import TaskDetailScreen from '../screens/Tasks/TaskDetailScreen';
import {CalendarStackParamList} from '../types/navigationTypes';

const CalendarStack: React.FC<
  BottomTabScreenProps<TabStackParamList, 'CalendarStack'>
> = () => {
  const Stack = createNativeStackNavigator<CalendarStackParamList>();
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
        name="CalendarHomeScreen"
        options={{title: 'Calendar'}}
        component={CalendarHomeScreen}
      />
      <Stack.Screen
        name="EventDetailScreen"
        component={EventDetailScreen}
        options={{
          title: 'Edit Event',
        }}
      />
      <Stack.Screen name="TaskDetailScreen" component={TaskDetailScreen} />
      <Stack.Screen
        name="ProjectDetailScreen"
        component={ProjectDetailScreen}
      />
      <Stack.Screen
        name="ProjectMembersScreen"
        component={ProjectMembersScreen}
      />
    </Stack.Navigator>
  );
};
export default CalendarStack;
