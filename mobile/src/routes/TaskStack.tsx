import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {TabStackParamList} from '../Routes';
import AddTaskScreen from '../screens/AddTaskScreen';
import TaskHomeScreen from '../screens/TaskHomeScreen';

export type TaskStackParamList = {
  TaskHomeScreen: undefined;
  AddTaskScreen: undefined;
};

const TaskStack: React.FC<
  BottomTabScreenProps<TabStackParamList, 'TaskStack'>
> = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="TaskHomeScreen" component={TaskHomeScreen} />
      <Stack.Screen name="AddTaskScreen" component={AddTaskScreen} />
    </Stack.Navigator>
  );
};

export default TaskStack;
