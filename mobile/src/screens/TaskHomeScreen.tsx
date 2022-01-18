import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useLayoutEffect} from 'react';
import {Button, FlatList, StyleSheet, Text, View} from 'react-native';
import {useGetAllTasksQuery} from '../generated/graphql';
import {TaskStackParamList} from '../routes/TaskStack';

const TaskHomeScreen: React.FC<
  NativeStackScreenProps<TaskStackParamList, 'TaskHomeScreen'>
> = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="add"
          onPress={() => {
            navigation.navigate('AddTaskScreen');
          }}
        />
      ),
    });
  });
  const {data} = useGetAllTasksQuery();
  return (
    <FlatList
      data={data?.getAllTasks}
      renderItem={({item, index}) => (
        <View style={styles.task}>
          <Text>{item.name}</Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  task: {
    padding: 10,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
});

export default TaskHomeScreen;
