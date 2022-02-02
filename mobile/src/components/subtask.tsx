import React, {useRef} from 'react';
import {Image, Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {
  SubtaskFragment,
  useDeleteSubtaskMutation,
  useToggleSubtaskMutation,
} from '../generated/graphql';
import {TaskNavigationProp} from '../utils/types';
import SlidingView from './slidingView';

const Subtask: React.FC<{subtask: SubtaskFragment}> = ({subtask}) => {
  const [deleteSubtask] = useDeleteSubtaskMutation();
  const [toggleSubtask] = useToggleSubtaskMutation();
  const deleteSubtaskFunc = async () => {
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
        deleteSubtaskFunc();
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
          <View
            style={{
              padding: 10,
              backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                toggleSubtask({variables: {id: subtask.id}});
              }}>
              <Image
                source={
                  subtask.done
                    ? require('../../assets/Checkmark.png')
                    : require('../../assets/Circle.png')
                }
                style={styles.checkMark}
              />
            </TouchableOpacity>
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

const styles = StyleSheet.create({
  checkMark: {
    resizeMode: 'stretch',
    width: 25,
    height: 25,
    marginRight: 10,
  },
});

export default Subtask;
