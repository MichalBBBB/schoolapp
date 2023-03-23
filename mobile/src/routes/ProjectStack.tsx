import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import BackButton from '../components/backButton';
import {TabStackParamList} from '../Routes';
import {NewProjectScreen} from '../screens/Projects/NewProjectScreen';
import ProjectDetailScreen from '../screens/Projects/ProjectDetailScreen';
import ProjectHomeScreen from '../screens/Projects/ProjectHomeScreen';
import {ProjectMembersScreen} from '../screens/Projects/ProjectMembersScreen';
import {ProjectStackParamList} from '../utils/types';

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
      <Stack.Screen
        name="ProjectHomeScreen"
        component={ProjectHomeScreen}
        options={{
          title: 'Projects',
        }}
      />
      <Stack.Screen
        name="ProjectDetailScreen"
        component={ProjectDetailScreen}
      />
      <Stack.Screen
        name="ProjectMembersScreen"
        component={ProjectMembersScreen}
      />
      <Stack.Screen name="NewProjectScreen" component={NewProjectScreen} />
    </Stack.Navigator>
  );
};

export default ProjectStack;
