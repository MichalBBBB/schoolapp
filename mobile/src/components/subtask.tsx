import React from 'react';
import {Image, Text, View, TouchableOpacity} from 'react-native';
import {SubtaskFragment, useDeleteSubtaskMutation} from '../generated/graphql';
import {TaskNavigationProp} from '../utils/types';
import SlidingView from './slidingView';

const Subtask: React.FC<{subtask: SubtaskFragment}> = ({subtask}) => {
  const [deleteSubtask] = useDeleteSubtaskMutation();
  const deleteTaskFunc = async () => {
    await deleteSubtask({
      variables: {id: subtask.id},
      update: cache => {
        const normalizedId = cache.identify({
          id: subtask.id,
          __typename: 'Subtask',
        });
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
          <View style={{padding: 10, backgroundColor: 'white'}}>
            <Text>{subtask.name}</Text>
          </View>
        }
        backView={[back]}
        backViewWidth={70}
        numberOfBackElements={1}
      />
    </View>
  );
};

export default Subtask;
