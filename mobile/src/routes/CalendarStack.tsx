import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import BackButton from '../components/backButton';
import {TabStackParamList} from '../Routes';
import AddEventScreen from '../screens/Calendar/AddEventScreen';
import CalendarHomeScreen from '../screens/Calendar/CalendarHomeScreen';

export type CalendarStackParamList = {
  CalendarHomeScreen: undefined;
  AddEventScreen: undefined;
};

const CalendarStack: React.FC<
  BottomTabScreenProps<TabStackParamList, 'CalendarStack'>
> = () => {
  const Stack = createNativeStackNavigator();
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
      <Stack.Screen name="CalendarHomeScreen" component={CalendarHomeScreen} />
      <Stack.Screen name="AddEventScreen" component={AddEventScreen} />
    </Stack.Navigator>
  );
};
export default CalendarStack;
