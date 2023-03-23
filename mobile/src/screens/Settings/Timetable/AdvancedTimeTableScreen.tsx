import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import {useEffect, useLayoutEffect, useState} from 'react';
import {ScrollView, Switch, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import BackButton from '../../../components/backButton';
import {BasicButton} from '../../../components/basicViews/BasicButton';
import {BasicCard} from '../../../components/basicViews/BasicCard';
import {BasicText} from '../../../components/basicViews/BasicText';
import EditDateModal from '../../../components/editDateWindow';
import {Popup} from '../../../components/popup';
import {SettingsItem} from '../../../components/settingsItem';
import {useSetSettings} from '../../../mutationHooks/settings/setSettings';
import {SubjectColorsObject} from '../../../types/Theme';
import {useSettings} from '../../../utils/useSettings';
import {BasicLoading} from '../../../components/basicViews/BasicLoading';
import {SettingsStackScreenProps} from '../../../utils/types';

export const AdvancedTimeTableScreen: React.FC<
  SettingsStackScreenProps<'AdvancedTimeTableScreen'>
> = ({navigation}) => {
  const numbers = Array(14)
    .fill(0)
    .map((item, index) => index + 1);
  const [startDateModalVisible, setStartDateModalVisible] = useState(false);
  const [setSettings] = useSetSettings();
  const settings = useSettings();

  if (!settings) {
    return (
      <View>
        <BasicLoading />
      </View>
    );
  }

  return (
    <View style={{padding: 10}}>
      <BasicCard
        backgroundColor="accentBackground1"
        spacing="m"
        marginBottom={10}>
        <Popup
          trigger={<SettingsItem text={'Lenght of rotation'} />}
          forceSide="right">
          <BasicCard
            backgroundColor="accentBackground2"
            style={{
              elevation: 8,
              shadowOpacity: 0.1,
              shadowOffset: {width: 0, height: 0},
              shadowRadius: 20,
              maxHeight: 300,
            }}>
            <View>
              <FlatList
                // without this, sometimes only 10 items are rendered
                initialNumToRender={14}
                keyboardShouldPersistTaps="handled"
                data={numbers}
                renderItem={({item}) => (
                  <BasicButton
                    spacing="none"
                    backgroundColor="background"
                    variant={
                      settings.lengthOfRotation == item ? 'filled' : 'unstyled'
                    }
                    style={{
                      marginBottom: 5,
                      alignItems: 'center',
                      paddingHorizontal: 20,
                      padding: 5,
                    }}
                    onPress={() => {
                      setSettings({
                        lengthOfRotation: item,
                      });
                    }}>
                    <BasicText>{item}</BasicText>
                  </BasicButton>
                )}
              />
            </View>
          </BasicCard>
        </Popup>
      </BasicCard>
      <BasicCard
        backgroundColor="accentBackground1"
        spacing="s"
        marginBottom={10}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 5,
          }}>
          <BasicText>Skip weekends</BasicText>
          <Switch
            value={settings.skipWeekends}
            onValueChange={value => {
              setSettings({
                skipWeekends: value,
              });
            }}
          />
        </View>
      </BasicCard>
      <BasicCard backgroundColor="accentBackground1" spacing="s">
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 5,
          }}>
          <BasicText>Start of rotation</BasicText>
          <BasicButton
            onPress={() => {
              setStartDateModalVisible(true);
            }}
            backgroundColor="lightBorder"
            borderWidth={1}
            variant="outlined"
            spacing="s"
            borderRadius={10}>
            <BasicText>
              {dayjs(settings.startOfRotationDate).format('DD/MM/YYYY')}
            </BasicText>
          </BasicButton>
        </View>
      </BasicCard>
      <EditDateModal
        showTime={false}
        showSpecialDays={false}
        initialDate={dayjs(settings.startOfRotationDate)}
        isVisible={startDateModalVisible}
        onClose={() => {
          setStartDateModalVisible(false);
        }}
        onSubmit={date => {
          setSettings({
            startOfRotationDate: date.toDate(),
          });
          setStartDateModalVisible(false);
        }}
      />
    </View>
  );
};
