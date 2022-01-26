import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {TaskFragment, useDeleteTaskMutation} from '../generated/graphql';
import {TaskNavigationProp} from '../utils/types';
import SlidingView from './slidingView';

const Task: React.FC<{task: TaskFragment}> = ({task}) => {
  const [deleteTask] = useDeleteTaskMutation();
  const navigation = useNavigation<TaskNavigationProp>();

  const deleteTaskFunc = async () => {
    await deleteTask({
      variables: {id: task.id},
      update: cache => {
        const normalizedId = cache.identify({id: task.id, __typename: 'Task'});
        cache.evict({id: normalizedId});
      },
    });
  };
  const back = (
    <TouchableOpacity
      onPress={() => {
        deleteTaskFunc();
      }}>
      <View
        style={{
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
        <Image
          source={require('../../assets/Delete.png')}
          style={{
            resizeMode: 'stretch',
            height: 25,
            width: 25,
          }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <SlidingView
        frontView={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TaskDetailScreen', {task: task});
            }}>
            <View style={{padding: 10, backgroundColor: 'white'}}>
              <Text>{task.name}</Text>
            </View>
          </TouchableOpacity>
        }
        backView={[back]}
        backViewWidth={70}
        numberOfBackElements={1}
      />
    </View>
  );
};

export default Task;
