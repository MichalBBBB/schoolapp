import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {View, ScrollView, StyleSheet, Text, Pressable} from 'react-native';
import {SecondaryText} from '../../components/basicViews/SecondaryText';
import ConnectedList from '../../components/connectedList';
import {useMeQuery} from '../../generated/graphql';
import {SettingsStackParamList} from '../../routes/SettingsStack';

const SettingsHomeScreen: React.FC<
  NativeStackScreenProps<SettingsStackParamList, 'SettingsHomeScreen'>
> = ({navigation}) => {
  const {data: me} = useMeQuery();

  const profile = (
    <View style={styles.profileContainer}>
      <View
        style={{
          backgroundColor: '#ccc',
          width: 80,
          height: 80,
          borderRadius: 40,
          marginRight: 20,
        }}></View>
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{me?.me.fullName}</Text>
        <SecondaryText>Change your profile info</SecondaryText>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {profile}
      <ConnectedList>
        <Pressable
          style={styles.listItem}
          onPress={() => {
            navigation.navigate('LessonTimesScreen');
          }}>
          <Text>TimeTable</Text>
        </Pressable>
      </ConnectedList>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  nameContainer: {},
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  container: {
    padding: 10,
  },
});

export default SettingsHomeScreen;
