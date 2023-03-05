import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
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
import {BasicText} from '../../components/basicViews/BasicText';
import EditDateModal from '../../components/editDateWindow';
import {Popup} from '../../components/popup';
import {SelectSubjectPopup} from '../../components/selectSubject/selectSubjectPopup';
import Task from '../../components/task';
import {useTheme} from '../../contexts/ThemeContext';
import {
  useGetAllTasksQuery,
  useGetProjectTasksOfUserLazyQuery,
  useGetProjectTasksOfUserQuery,
} from '../../generated/graphql';
import {TaskStackParamList} from '../../routes/TaskStack';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TaskHomeScreen: React.FC<
  NativeStackScreenProps<TaskStackParamList, 'TaskHomeScreen'>
> = ({navigation}) => {
  const {data} = useGetAllTasksQuery();
  const {data: projectTasks} = useGetProjectTasksOfUserQuery({
    fetchPolicy: 'network-only',
  });
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [theme] = useTheme();

  useEffect(() => {
    console.log('projectTasks', projectTasks);
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <SelectSubjectPopup
          onSubmit={() => {}}
          trigger={
            <Pressable>
              <BasicText>Popup</BasicText>
            </Pressable>
          }
        />
      ),
      headerLeft: () => (
        <Pressable
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => {
            navigation.navigate('NotificationScreen');
          }}>
          <Image
            source={require('../../../assets/Mail.png')}
            style={{height: 25, width: 25, resizeMode: 'stretch'}}
          />
        </Pressable>
      ),
    });
  });
  return (
    <View style={{flex: 1}}>
      <FlatList
        contentContainerStyle={{
          borderRadius: 15,
          overflow: 'hidden',
          backgroundColor: theme.colors.accentBackground,
        }}
        style={{padding: 10}}
        data={data?.getAllTasks.filter(item => {
          return item.done == false;
        })}
        renderItem={({item, index}) => (
          <Task task={item} backgroundColor={'accentBackground'} />
        )}
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
