import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {
  createRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
  Platform,
  UIManager,
} from 'react-native';
import {isOnlineVar} from '../../App';
import AddButton from '../../components/addButton';
import AddTaskWindow from '../../components/addTaskWindow';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicCard} from '../../components/basicViews/BasicCard';
import {BasicIcon} from '../../components/basicViews/BasicIcon';
import {BasicRadio} from '../../components/basicViews/BasicRadio';
import {BasicText} from '../../components/basicViews/BasicText';
import EditDateModal from '../../components/editDateWindow';
import {Menu} from '../../components/menu';
import {MenuItem} from '../../components/menu/MenuItem';
import {Popup} from '../../components/popup';
import {SelectSubjectPopup} from '../../components/selectSubject/selectSubjectPopup';
import Task from '../../components/task';
import TaskListProjectTask from '../../components/taskListProjectTask';
import {TaskScreenOptionsPopup} from '../../components/taskScreenOptionsPopup';
import {useTheme} from '../../contexts/ThemeContext';
import {
  GetAllLessonsQuery,
  GetAllLessonTimesDocument,
  ProjectTaskFragment,
  ProjectTaskWithProjectFragment,
  TaskFragment,
  useGetAllTasksQuery,
  useGetProjectTasksOfUserLazyQuery,
  useGetProjectTasksOfUserQuery,
} from '../../generated/graphql';
import {useSetSettings} from '../../mutationHooks/settings/setSettings';
import {
  TabParamList,
  TaskStackParamList,
  TaskStackScreenProps,
} from '../../utils/types';
import {useSettings} from '../../utils/useSettings';
import {replaceAllData} from '../../Content';
import {NormalizedCacheObject, useApolloClient} from '@apollo/client';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TaskHomeScreen: React.FC<TaskStackScreenProps<'TaskHomeScreen'>> = ({
  navigation,
}) => {
  const {data} = useGetAllTasksQuery();
  const {data: projectTasks} = useGetProjectTasksOfUserQuery({
    fetchPolicy: 'network-only',
  });
  const [setSettings] = useSetSettings();
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [theme] = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const settings = useSettings();
  const client = useApolloClient();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <BasicButton
            variant="unstyled"
            onPress={() => {
              navigation.navigate('PlanDayScreen');
            }}>
            <BasicIcon
              source={require('../../../assets/Today.png')}
              style={{height: 25, width: 25}}
            />
          </BasicButton>
          <TaskScreenOptionsPopup
            trigger={
              <BasicButton variant="unstyled">
                <BasicIcon
                  source={require('../../../assets/Options.png')}
                  style={{height: 20, width: 20}}
                />
              </BasicButton>
            }
          />
        </View>
      ),
    });
  });

  const MyFlatList = FlatList<TaskFragment | ProjectTaskWithProjectFragment>;

  const list: Array<TaskFragment | ProjectTaskWithProjectFragment> = (
    (
      (data?.getAllTasks.filter(item => {
        if (settings?.showCompletedTasks) {
          return true;
        } else {
          return item.done == false;
        }
      }) as Array<TaskFragment | ProjectTaskWithProjectFragment>) || []
    ).concat(
      projectTasks?.getProjectTasksOfUser.filter(item => !item.done) || [],
    ) || []
  ).sort((a, b) => {
    if (settings?.sortTasksBy == 'DUE_DATE') {
      if (a.dueDate && b.dueDate) {
        return dayjs(a.dueDate).diff(b.dueDate);
      } else if (!a.dueDate && !b.dueDate) {
        return 0;
      } else {
        if (a.dueDate) {
          return -1;
        } else {
          return 1;
        }
      }
    } else if (settings?.sortTasksBy == 'DO_DATE') {
      if (a.doDate && b.doDate) {
        return dayjs(a.doDate).diff(b.doDate);
      } else if (!a.doDate && !b.doDate) {
        return 0;
      } else {
        if (a.dueDate) {
          return -1;
        } else {
          return 1;
        }
      }
    } else {
      return dayjs(a.createdAt).diff(b.createdAt);
    }
  });

  return (
    <View style={{flex: 1}}>
      <MyFlatList
        ListEmptyComponent={() => (
          <View
            style={{
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <BasicText textVariant="heading" style={{marginBottom: 10}}>
              No tasks yet
            </BasicText>
            <BasicButton
              spacing="m"
              onPress={() => {
                setAddTaskOpen(true);
              }}>
              <BasicText color="textContrast" textVariant="button">
                Create a new one
              </BasicText>
            </BasicButton>
          </View>
        )}
        onRefresh={() => {
          setRefreshing(true);
          replaceAllData(client).then(() => {
            setRefreshing(false);
          });
        }}
        refreshing={refreshing}
        contentContainerStyle={
          data?.getAllTasks.length == 0
            ? {flexGrow: 1}
            : {
                borderRadius: 15,
                overflow: 'hidden',
                backgroundColor: theme.colors.accentBackground1,
              }
        }
        style={{padding: 10}}
        data={list}
        renderItem={({item, index}) => {
          if ('projectId' in item) {
            return (
              <TaskListProjectTask
                projectTask={item}
                backgroundColor="accentBackground1"
                onPress={() => {
                  navigation.navigate('ProjectDetailScreen', {
                    projectId: item.projectId,
                  });
                }}
              />
            );
          } else {
            return (
              <Task
                showDoDate={settings?.showDoDate}
                task={item}
                backgroundColor={'accentBackground1'}
                onPress={() => {
                  navigation.navigate('TaskDetailScreen', {task: item});
                }}
              />
            );
          }
        }}
        //ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <View style={{position: 'absolute', right: 0, bottom: 0, margin: 20}}>
        <AddButton
          onPress={() => {
            setAddTaskOpen(true);
          }}
        />
      </View>
      <AddTaskWindow
        visible={addTaskOpen}
        onClose={() => {
          setAddTaskOpen(false);
        }}
      />
    </View>
  );
};

export default TaskHomeScreen;
