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
import {isLoggedInVar} from '../../App';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicCard} from '../../components/basicViews/BasicCard';
import {BasicText} from '../../components/basicViews/BasicText';
import {useLogoutMutation, useMeQuery} from '../../generated/graphql';
import {SettingsStackParamList} from '../../routes/SettingsStack';
import {setAccessToken} from '../../utils/AccessToken';

const SettingsHomeScreen: React.FC<
  NativeStackScreenProps<SettingsStackParamList, 'SettingsHomeScreen'>
> = ({navigation}) => {
  const {data: me} = useMeQuery();
  const [logout] = useLogoutMutation();

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

      <View>
        <BasicText textVariant="heading">{me?.me.fullName}</BasicText>
        <BasicText textVariant="subText" color="textSecondary">
          Change your profile info
        </BasicText>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {profile}
      <BasicCard backgroundColor="accentBackground" marginBottom={10}>
        <Pressable
          style={styles.listItem}
          onPress={() => {
            navigation.navigate('LessonTimesScreen');
          }}>
          <BasicText>TimeTable</BasicText>
        </Pressable>
      </BasicCard>
      <BasicCard backgroundColor="accentBackground">
        <Pressable
          style={styles.listItem}
          onPress={() => {
            logout();
            setAccessToken('');
            isLoggedInVar(false);
          }}>
          <BasicText color="dangerous">Log out</BasicText>
        </Pressable>
      </BasicCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
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
