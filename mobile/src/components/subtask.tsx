import React, {useRef} from 'react';
import {Image, Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {
  SubtaskFragment,
  useDeleteSubtaskMutation,
  useToggleSubtaskMutation,
} from '../generated/graphql';
import {useDeleteSubtask} from '../mutationHooks/task/deleteSubtask';
import {useToggleSubtask} from '../mutationHooks/task/toggleSubtask';
import {TaskNavigationProp} from '../utils/types';
import {BasicText} from './basicViews/BasicText';
import SlidingView from './slidingView';

const Subtask: React.FC<{subtask: SubtaskFragment}> = ({subtask}) => {
  const [deleteSubtask] = useDeleteSubtask();
  const [toggleSubtask] = useToggleSubtask();
  const deleteSubtaskFunc = async () => {
    await deleteSubtask({
      id: subtask.id,
    });
  };
  const [theme] = useTheme();
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
              backgroundColor: theme.colors.accentBackground1,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                toggleSubtask({id: subtask.id});
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
            <BasicText>{subtask.name}</BasicText>
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
