import {useApolloClient} from '@apollo/client';
import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  Switch,
  TouchableHighlight,
} from 'react-native';
import {isLoggedInVar} from '../../App';
import {BasicCard} from '../../components/basicViews/BasicCard';
import {BasicIcon} from '../../components/basicViews/BasicIcon';
import {BasicText} from '../../components/basicViews/BasicText';
import {SettingsItem} from '../../components/listItems/settingsItem';
import {SubjectModal} from '../../components/modals/subjectModal';
import {DarkTheme, LightTheme, useTheme} from '../../contexts/ThemeContext';
import {useLogoutMutation, useMeQuery} from '../../generated/graphql';
import {useSetSettings} from '../../mutationHooks/settings/setSettings';
import {setAccessToken} from '../../utils/AccessToken';
import {SettingsStackScreenProps} from '../../utils/types';

const SettingsHomeScreen: React.FC<
  SettingsStackScreenProps<'SettingsHomeScreen'>
> = ({navigation}) => {
  const {data: me} = useMeQuery();
  const [logout] = useLogoutMutation();
  const client = useApolloClient();
  const [theme, setTheme] = useTheme();
  const [setSettings] = useSetSettings();

  const [subjectModalVisible, setSubjectModalVisible] = useState(false);

  const profile = (
    <Pressable
      onPress={() => {
        navigation.navigate('ProfileScreen');
      }}>
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

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 1,
            alignItems: 'center',
          }}>
          <View>
            <BasicText textVariant="heading">{me?.me.fullName}</BasicText>
            <BasicText textVariant="subText" color="textSecondary">
              Change your profile info
            </BasicText>
          </View>
          <BasicIcon
            source={require('../../../assets/Chevron-right.png')}
            style={{height: 20, width: 20}}
          />
        </View>
      </View>
    </Pressable>
  );

  return (
    <>
      <ScrollView style={styles.container}>
        {profile}
        <View style={styles.listContainer}>
          <BasicCard
            backgroundColor="accentBackground1"
            marginBottom={10}
            spacing="s"
            gap={6}>
            <SettingsItem
              text="Timetable"
              onPress={() => {
                navigation.navigate('LessonTimesScreen');
              }}
            />
            <SettingsItem
              text="Subjects"
              onPress={() => {
                // navigation.navigate('SubjectScreen');
                setSubjectModalVisible(true);
              }}
            />
          </BasicCard>
          <BasicCard
            backgroundColor="accentBackground1"
            marginBottom={10}
            spacing="s"
            gap={18}>
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
                setAccessToken('');
                isLoggedInVar(false);
              }}>
              <BasicText color="dangerous">Log out</BasicText>
            </Pressable>
          </BasicCard>
        </View>
      </ScrollView>
      <SubjectModal
        isVisible={subjectModalVisible}
        onClose={() => {
          setSubjectModalVisible(false);
        }}
      />
    </>
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
