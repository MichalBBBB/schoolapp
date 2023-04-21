import React, {useState} from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {BasicCard} from '../../../components/basicViews/BasicCard';
import {BasicIcon} from '../../../components/basicViews/BasicIcon';
import {BasicText} from '../../../components/basicViews/BasicText';
import {BasicTextInput} from '../../../components/basicViews/BasicTextInput';
import {SettingsItem} from '../../../components/listItems/settingsItem';
import BasicInputWindow from '../../../components/modals/basicInputWindow';
import {Popup} from '../../../components/popup';
import {useMeQuery} from '../../../generated/graphql';
import {useEditUser} from '../../../mutationHooks/user/edituser';
import {SettingsStackScreenProps} from '../../../utils/types';

export const ProfileScreen: React.FC<
  SettingsStackScreenProps<'ProfileScreen'>
> = ({navigation}) => {
  const {data: me} = useMeQuery();
  const [editUser] = useEditUser();
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  return (
    <>
      <ScrollView style={{padding: 20}}>
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
          </View>
        </View>
        <BasicCard
          backgroundColor="accentBackground1"
          spacing="s"
          gap={6}
          marginBottom={10}>
          <SettingsItem
            text="Name"
            rightText={me?.me.fullName}
            onPress={() => {
              setNameModalVisible(true);
            }}
          />
          <SettingsItem
            showArrow={!me?.me.usesOAuth}
            text="Email"
            rightText={me?.me.email}
            onPress={() => {
              if (!me?.me.usesOAuth) {
                setEmailModalVisible(true);
              }
            }}
          />
        </BasicCard>
        {!me?.me.usesOAuth && (
          <BasicCard spacing="s" backgroundColor="accentBackground1">
            <SettingsItem
              text="Change Password"
              onPress={() => {
                navigation.navigate('ChangePasswordScreen');
              }}
            />
          </BasicCard>
        )}
      </ScrollView>
      <BasicInputWindow
        buttonText="Change"
        defaultValue={me?.me.fullName}
        visible={nameModalVisible}
        onClose={() => {
          setNameModalVisible(false);
        }}
        onSubmit={text => {
          editUser({fullName: text});
          setNameModalVisible(false);
        }}
      />
      <BasicInputWindow
        buttonText="Change"
        defaultValue={me?.me.email}
        visible={emailModalVisible}
        onClose={() => {
          setEmailModalVisible(false);
        }}
        onSubmit={text => {
          editUser({email: text});
          setEmailModalVisible(false);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginLeft: 20,
    alignItems: 'center',
  },
});
