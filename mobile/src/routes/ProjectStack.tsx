import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import BackButton from '../components/backButton';
import {TabStackParamList} from '../Routes';
import ProjectDetailScreen from '../screens/ProjectDetailScreen';
import ProjectHomeScreen from '../screens/ProjectHomeScreen';
import {ProjectMembersScreen} from '../screens/ProjectMembersScreen';

export type ProjectStackParamList = {
  ProjectHomeScreen: undefined;
  ProjectDetailScreen: {projectId: string};
  ProjectMembersScreen: {projectId: string};
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
      <Stack.Screen name="ProjectHomeScreen" component={ProjectHomeScreen} />
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

export default ProjectStack;
