import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {CalendarStackParamList} from '../routes/CalendarStack';
import {ProjectStackParamList} from '../routes/ProjectStack';
import {TaskStackParamList} from '../routes/TaskStack';

export type TaskNavigationProp = NativeStackNavigationProp<TaskStackParamList>;

export type CalendarNavigationProp =
  NativeStackNavigationProp<CalendarStackParamList>;

export type ProjectNavigationProp =
  NativeStackNavigationProp<ProjectStackParamList>;
