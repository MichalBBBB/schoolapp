import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import BackButton from '../components/backButton';
import {CalendarEventFragment} from '../generated/graphql';
import {TabStackParamList} from '../Routes';
import AddEventScreen from '../screens/Calendar/AddEventScreen';
import CalendarHomeScreen from '../screens/Calendar/CalendarHomeScreen';
import EventDetailScreen from '../screens/Calendar/EventDetailScreen';
import TaskDetailScreen from '../screens/Tasks/TaskDetailScreen';
import {CalendarStackParamList} from '../utils/types';

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
      <Stack.Screen name="AddEventScreen" component={AddEventScreen} />
      <Stack.Screen name="EventDetailScreen" component={EventDetailScreen} />
      <Stack.Screen name="TaskDetailScreen" component={TaskDetailScreen} />
    </Stack.Navigator>
  );
};
export default CalendarStack;
