import {useApolloClient} from '@apollo/client';
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

export const SettingsItem: React.FC<{text: string; onPress: () => void}> = ({
  text,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <BasicText>{text}</BasicText>
      <Image
        source={require('../../../assets/Chevron-right.png')}
        style={{height: 15, width: 15}}
      />
    </Pressable>
  );
};

const SettingsHomeScreen: React.FC<
  NativeStackScreenProps<SettingsStackParamList, 'SettingsHomeScreen'>
> = ({navigation}) => {
  const {data: me} = useMeQuery();
  const [logout] = useLogoutMutation();
  const client = useApolloClient();

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
      <View style={styles.listContainer}>
        <BasicCard
          backgroundColor="accentBackground"
          marginBottom={10}
          spacing="m"
          gap={10}>
          <SettingsItem
            text="TimeTable"
            onPress={() => {
              navigation.navigate('LessonTimesScreen');
            }}
          />
          <SettingsItem
            text="Subjects"
            onPress={() => {
              navigation.navigate('SubjectScreen');
            }}
          />
        </BasicCard>
        <BasicCard
          backgroundColor="accentBackground"
          marginBottom={10}
          spacing="m"
          gap={10}>
          <SettingsItem
            text="Date and time"
            onPress={() => {
              navigation.navigate('DateSettingsScreen');
            }}
          />
        </BasicCard>
        <BasicCard backgroundColor="accentBackground" spacing="m">
          <Pressable
            style={styles.listItem}
            onPress={() => {
              logout();
              client.resetStore();
              setAccessToken('');
              isLoggedInVar(false);
            }}>
            <BasicText color="dangerous">Log out</BasicText>
          </Pressable>
        </BasicCard>
      </View>
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
  },
  container: {
    padding: 10,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
});

export default SettingsHomeScreen;
