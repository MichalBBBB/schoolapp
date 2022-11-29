import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import BackButton from '../components/backButton';
import {TabStackParamList} from '../Routes';
import ProjectScreen from '../screens/ProjectScreen';

export type ProjectStackParamList = {
  ProjectHomeScreen: undefined;
};

const ProjectStack: React.FC<
  BottomTabScreenProps<TabStackParamList, 'ProjectStack'>
> = () => {
  const Stack = createNativeStackNavigator<ProjectStackParamList>();
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
      <Stack.Screen name="ProjectHomeScreen" component={ProjectScreen} />
    </Stack.Navigator>
  );
};

export default ProjectStack;
