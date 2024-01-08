import React, {useRef, useState} from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  LayoutAnimation,
  Pressable,
} from 'react-native';
import {
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {useTheme} from '../../contexts/ThemeContext';
import {
  SubtaskFragment,
  useDeleteSubtaskMutation,
  useToggleSubtaskMutation,
} from '../../generated/graphql';
import {useDeleteSubtask} from '../../mutationHooks/task/deleteSubtask';
import {useEditSubtask} from '../../mutationHooks/task/editSubtask';
import {useToggleSubtask} from '../../mutationHooks/task/toggleSubtask';
import {TaskNavigationProp} from '../../utils/types';
import {BasicIcon} from '../basicViews/BasicIcon';
import {BasicText} from '../basicViews/BasicText';
import BasicInputWindow from '../modals/basicInputWindow';
import SlidingView from '../slidingView';

const Subtask: React.FC<{subtask: SubtaskFragment}> = ({subtask}) => {
  const [deleteSubtask] = useDeleteSubtask();
  const [toggleSubtask] = useToggleSubtask();
  const [editSubtask] = useEditSubtask();

  const [editSubtaskWindowVisible, setEditSubtaskWindowVisible] =
    useState(false);

  const deleteSubtaskFunc = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
          source={require('../../../assets/Delete.png')}
          style={{
            resizeMode: 'stretch',
            height: 25,
            width: 25,
            tintColor: 'white',
          }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View>
        <SlidingView
          frontView={
            <TouchableHighlight
              onPress={() => {
                setEditSubtaskWindowVisible(true);
              }}>
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
                  <BasicIcon
                    source={
                      subtask.done
                        ? require('../../../assets/Checkmark.png')
                        : require('../../../assets/Circle.png')
                    }
                    style={styles.checkMark}
                  />
                </TouchableOpacity>
                <BasicText>{subtask.name}</BasicText>
              </View>
            </TouchableHighlight>
          }
          backView={[back]}
          backViewWidth={70}
          numberOfBackElements={1}
        />
      </View>
      <BasicInputWindow
        defaultValue={subtask.name}
        visible={editSubtaskWindowVisible}
        onClose={() => {
          setEditSubtaskWindowVisible(false);
        }}
        onSubmit={value => {
          editSubtask({id: subtask.id, name: value});
          setEditSubtaskWindowVisible(false);
        }}
      />
    </>
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
