import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {BasicButton} from '../components/basicViews/BasicButton';
import {BasicCard} from '../components/basicViews/BasicCard';
import {useGetInvitesQuery} from '../generated/graphql';
import {TaskStackParamList} from '../routes/TaskStack';

export const NotificationScreen: React.FC<
  NativeStackScreenProps<TaskStackParamList, 'NotificationScreen'>
> = () => {
  const {data} = useGetInvitesQuery();
  useEffect(() => {
    console.log(data);
  });
  return (
    <View>
      <FlatList
        data={data?.getInvites}
        renderItem={({item}) => (
          <BasicCard>
            <Text>
              {`${item.ownerName} has invited you to join the project ${item.projectName}`}
            </Text>
            <View style={styles.buttonContainer}>
              <BasicButton onPress={() => {}}>
                <Text>Accept</Text>
              </BasicButton>
              <BasicButton onPress={() => {}}>
                <Text>Decline</Text>
              </BasicButton>
            </View>
          </BasicCard>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
  },
});
