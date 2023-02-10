import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  Image,
} from 'react-native';
import {BasicText} from '../../components/basicViews/BasicText';
import ConnectedList from '../../components/connectedList';
import {useMeQuery} from '../../generated/graphql';
import {SettingsStackParamList} from '../../routes/SettingsStack';

const SettingsHomeScreen: React.FC<
  NativeStackScreenProps<SettingsStackParamList, 'SettingsHomeScreen'>
> = ({navigation}) => {
  const {data: me} = useMeQuery();

  const profile = (
    <View style={styles.profileContainer}>
      {me?.me.imageURL ? (
        <Image
          source={{uri: me?.me.imageURL}}
          style={{width: 80, height: 80, marginRight: 20, borderRadius: 40}}
        />
      ) : (
        <View
          style={{
            backgroundColor: '#ccc',
            width: 80,
            height: 80,
            borderRadius: 40,
            marginRight: 20,
          }}></View>
      )}

      <View style={styles.nameContainer}>
        <Text style={styles.name}>{me?.me.fullName}</Text>
        <BasicText textVariant="subText" color="textSecondary">
          Change your profile info
        </BasicText>
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
