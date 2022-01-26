import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {TaskFragment} from '../generated/graphql';
import {TabStackParamList} from '../Routes';
import AddSubtaskScreen from '../screens/AddSubtaskScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import TaskHomeScreen from '../screens/TaskHomeScreen';

export type TaskStackParamList = {
  TaskHomeScreen: undefined;
  AddTaskScreen: undefined;
  TaskDetailScreen: {task: TaskFragment};
  AddSubtaskScreen: {taskId: string};
};

const TaskStack: React.FC<
  BottomTabScreenProps<TabStackParamList, 'TaskStack'>
> = () => {
  const Stack = createNativeStackNavigator<TaskStackParamList>();
  return (
    <Stack.Navigator>
      <Stack.Screen name="TaskHomeScreen" component={TaskHomeScreen} />
      <Stack.Screen name="AddTaskScreen" component={AddTaskScreen} />
      <Stack.Screen
        name="TaskDetailScreen"
        component={TaskDetailScreen}
        options={({route}) => ({title: route.params.task.name})}
      />
      <Stack.Screen name="AddSubtaskScreen" component={AddSubtaskScreen} />
    </Stack.Navigator>
  );
};

export default TaskStack;
