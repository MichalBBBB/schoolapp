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
import {SettingsStackParamList} from '../../../routes/SettingsStack';
import {SubjectColorsObject} from '../../../types/Theme';
import {useSettings} from '../../../utils/useSettings';

export const AdvancedTimeTableScreen: React.FC<
  NativeStackScreenProps<SettingsStackParamList, 'AdvancedTimeTableScreen'>
> = ({navigation}) => {
  const numbers = Array(14)
    .fill(0)
    .map((item, index) => index + 1);
  const [rotationLength, setRotationLength] = useState(5);
  const [skipWeekends, setSkipWeekends] = useState(true);
  const [startDate, setStartDate] = useState(dayjs());
  const [startDateModalVisible, setStartDateModalVisible] = useState(false);
  const [setSettings] = useSetSettings();
  const settings = useSettings();

  useEffect(() => {
    if (settings) {
      setRotationLength(settings.lengthOfRotation);
      setSkipWeekends(settings.skipWeekends);
      setStartDate(dayjs(settings.startOfRotationDate));
    }
  }, [settings]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackButton
          onPress={() => {
            console.log(skipWeekends);
            setSettings({
              lengthOfRotation: rotationLength,
              skipWeekends,
              startOfRotationDate: startDate,
            });
            navigation.goBack();
          }}
        />
      ),
    });
  });

  return (
    <View style={{padding: 10}}>
      <BasicCard
        backgroundColor="accentBackground"
        spacing="m"
        marginBottom={10}>
        <Popup
          trigger={<SettingsItem text={'Lenght of rotation'} />}
          forceSide="right">
          <BasicCard
            backgroundColor="accentBackground"
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
                    variant={rotationLength == item ? 'filled' : 'unstyled'}
                    style={{
                      marginBottom: 5,
                      alignItems: 'center',
                      paddingHorizontal: 20,
                      padding: 5,
                    }}
                    onPress={() => {
                      setRotationLength(item);
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
        backgroundColor="accentBackground"
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
            value={skipWeekends}
            onValueChange={value => {
              setSkipWeekends(value);
            }}
          />
        </View>
      </BasicCard>
      <BasicCard backgroundColor="accentBackground" spacing="s">
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
            <BasicText>{startDate.format('DD/MM/YYYY')}</BasicText>
          </BasicButton>
        </View>
      </BasicCard>
      <EditDateModal
        initialDate={startDate}
        isVisible={startDateModalVisible}
        onClose={() => {
          setStartDateModalVisible(false);
        }}
        onSubmit={date => {
          setStartDate(date);
          setStartDateModalVisible(false);
        }}
      />
    </View>
  );
};
