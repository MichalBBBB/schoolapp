import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import BackButton from '../components/backButton';
import {TaskFragment} from '../generated/graphql';
import {TabStackParamList} from '../Routes';
import {NewProjectScreen} from '../screens/Projects/NewProjectScreen';
import {PlanDayScreen} from '../screens/Tasks/PlanDayScreen';
import TaskDetailScreen from '../screens/Tasks/TaskDetailScreen';
import TaskHomeScreen from '../screens/Tasks/TaskHomeScreen';

export type TaskStackParamList = {
  TaskHomeScreen: undefined;
  TaskDetailScreen: {task: TaskFragment};
  PlanDayScreen: undefined;
};

const TaskStack: React.FC<
  BottomTabScreenProps<TabStackParamList, 'TaskStack'>
> = () => {
  const Stack = createNativeStackNavigator<TaskStackParamList>();
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
      <Stack.Screen name="TaskHomeScreen" component={TaskHomeScreen} />
      <Stack.Screen
        name="TaskDetailScreen"
        component={TaskDetailScreen}
        options={({route}) => ({title: route.params.task.name})}
      />
      <Stack.Screen name="PlanDayScreen" component={PlanDayScreen} />
    </Stack.Navigator>
  );
};

export default TaskStack;
