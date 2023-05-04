import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {WelcomeScreen} from '../screens/Onboarding/WelcomeScreen';
import {OnboardingStackParamList} from '../utils/types';
import {AddSubjectsScreen} from '../screens/Onboarding/AddSubjectsScreen';
import BackButton from '../components/backButton';
import {LessonTimesScreen} from '../screens/Onboarding/LessonTimesScreen';
import {TimeTableScreen} from '../screens/Onboarding/TimeTableScreen';

export const OnboardingStack = () => {
  const Stack = createNativeStackNavigator<OnboardingStackParamList>();
  return (
    <Stack.Navigator
      screenOptions={({navigation}) => ({
        headerTitle: '',
        headerShadowVisible: false,
        headerLeft: props => {
          if (props.canGoBack) {
            return <BackButton onPress={() => navigation.goBack()} />;
          }
        },
      })}>
      <Stack.Screen component={WelcomeScreen} name="WelcomeScreen" />
      <Stack.Screen component={AddSubjectsScreen} name="AddSubjectsScreen" />
      <Stack.Screen component={LessonTimesScreen} name="LessonTimeScreen" />
      <Stack.Screen component={TimeTableScreen} name="TimeTableScreen" />
    </Stack.Navigator>
  );
};
