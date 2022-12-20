import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {createRef, useLayoutEffect, useRef, useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import AddButton from '../components/addButton';
import AddTaskWindow from '../components/addTaskWindow';
import EditDateWindow from '../components/editDateWindow';
import Task from '../components/task';
import {useGetAllTasksQuery} from '../generated/graphql';
import {TaskStackParamList} from '../routes/TaskStack';

const TaskHomeScreen: React.FC<
  NativeStackScreenProps<TaskStackParamList, 'TaskHomeScreen'>
> = ({navigation}) => {
  const {data} = useGetAllTasksQuery();
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => navigation.navigate('NewProjectScreen')}>
          <Text>New Project</Text>
        </Pressable>
      ),
      headerLeft: () => (
        <Pressable
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => {
            navigation.navigate('NotificationScreen');
          }}>
          <Image
            source={require('../../assets/Mail.png')}
            style={{height: 25, width: 25, resizeMode: 'stretch'}}
          />
        </Pressable>
      ),
    });
  });
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={data?.getAllTasks}
        renderItem={({item, index}) => <Task task={item} />}
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

const styles = StyleSheet.create({
  task: {
    padding: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 10,
  },
  plusButton: {
    resizeMode: 'stretch',
    height: 30,
    width: 30,
  },
});

export default TaskHomeScreen;
