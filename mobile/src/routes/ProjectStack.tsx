import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import BackButton from '../components/backButton';
import {TabStackParamList} from '../Routes';
import ProjectDetailScreen from '../screens/ProjectDetailScreen';
import ProjectHomeScreen from '../screens/ProjectHomeScreen';

export type ProjectStackParamList = {
  ProjectHomeScreen: undefined;
  ProjectDetailScreen: {projectId: string};
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
    </Stack.Navigator>
  );
};

export default ProjectStack;
