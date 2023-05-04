import {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {CalendarEventFragment, TaskFragment} from '../generated/graphql';

export type TabParamList = {
  TaskStack: NavigatorScreenParams<TaskStackParamList>;
  CalendarStack: NavigatorScreenParams<CalendarStackParamList>;
  ProjectStack: NavigatorScreenParams<ProjectStackParamList>;
  SettingsStack: NavigatorScreenParams<SettingsStackParamList>;
};

export type TaskStackParamList = {
  TaskHomeScreen: undefined;
  TaskDetailScreen: {task: TaskFragment};
  PlanDayScreen: undefined;
  ProjectDetailScreen: {projectId: string};
  ProjectMembersScreen: {projectId: string};
};

export type TaskStackScreenProps<T extends keyof TaskStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<TaskStackParamList, T>,
    BottomTabScreenProps<TabParamList, 'TaskStack'>
  >;

export type CalendarStackParamList = {
  CalendarHomeScreen: undefined;
  EventDetailScreen: {event?: CalendarEventFragment};
  TaskDetailScreen: {task: TaskFragment};
  ProjectDetailScreen: {projectId: string};
  ProjectMembersScreen: {projectId: string};
};

export type CalendarStackScreenProps<T extends keyof CalendarStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<CalendarStackParamList, T>,
    BottomTabScreenProps<TabParamList, 'CalendarStack'>
  >;

export type ProjectStackParamList = {
  ProjectHomeScreen: undefined;
  ProjectDetailScreen: {projectId: string};
  ProjectMembersScreen: {projectId: string};
  NewProjectScreen: undefined;
};

export type ProjectStackScreenProps<T extends keyof ProjectStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ProjectStackParamList, T>,
    BottomTabScreenProps<TabParamList, 'ProjectStack'>
  >;

export type SettingsStackParamList = {
  SettingsHomeScreen: undefined;
  TimeTableScreen: undefined;
  LessonTimesScreen: undefined;
  AdvancedTimeTableScreen: undefined;
  DateSettingsScreen: undefined;
  StartOfWeekScreen: undefined;
  ProfileScreen: undefined;
  ChangePasswordScreen: undefined;
};

export type OnboardingStackParamList = {
  WelcomeScreen: undefined;
  AddSubjectsScreen: undefined;
  LessonTimeScreen: undefined;
  TimeTableScreen: undefined;
};

export type OnboardingStackScreenProps<
  T extends keyof OnboardingStackParamList,
> = NativeStackScreenProps<OnboardingStackParamList, T>;

export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;

export type SettingsStackScreenProps<T extends keyof SettingsStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<SettingsStackParamList, T>,
    BottomTabScreenProps<TabParamList, 'SettingsStack'>
  >;

export type TaskNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'TaskStack'>,
  NativeStackNavigationProp<TaskStackParamList>
>;

export type CalendarNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'CalendarStack'>,
  NativeStackNavigationProp<CalendarStackParamList>
>;

export type ProjectNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'ProjectStack'>,
  NativeStackNavigationProp<ProjectStackParamList>
>;
