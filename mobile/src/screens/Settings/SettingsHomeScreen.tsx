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
  Switch,
} from 'react-native';
import {isLoggedInVar} from '../../App';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicCard} from '../../components/basicViews/BasicCard';
import {BasicText} from '../../components/basicViews/BasicText';
import {SettingsItem} from '../../components/settingsItem';
import {DarkTheme, LightTheme, useTheme} from '../../contexts/ThemeContext';
import {useLogoutMutation, useMeQuery} from '../../generated/graphql';
import {useSetSettings} from '../../mutationHooks/settings/setSettings';
import {SettingsStackParamList} from '../../routes/SettingsStack';
import {setAccessToken} from '../../utils/AccessToken';

const SettingsHomeScreen: React.FC<
  NativeStackScreenProps<SettingsStackParamList, 'SettingsHomeScreen'>
> = ({navigation}) => {
  const {data: me} = useMeQuery();
  const [logout] = useLogoutMutation();
  const client = useApolloClient();
  const [theme, setTheme] = useTheme();
  const [setSettings] = useSetSettings();

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
          backgroundColor="accentBackground1"
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
          backgroundColor="accentBackground1"
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
        <BasicCard marginBottom={10} backgroundColor="accentBackground1">
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 5,
            }}>
            <BasicText>Dark mode</BasicText>
            <Switch
              value={theme.dark}
              onValueChange={value => {
                setSettings({darkMode: value});
              }}
            />
          </View>
        </BasicCard>
        <BasicCard backgroundColor="accentBackground1" spacing="m">
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
