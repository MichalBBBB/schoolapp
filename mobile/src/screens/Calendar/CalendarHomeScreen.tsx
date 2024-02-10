import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useLayoutEffect, useState} from 'react';
import {
  Pressable,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import AddButton from '../../components/addButton';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicCard} from '../../components/basicViews/BasicCard';
import {BasicIcon} from '../../components/basicViews/BasicIcon';
import {BasicRadio} from '../../components/basicViews/BasicRadio';
import {BasicText} from '../../components/basicViews/BasicText';
import CalendarView from '../../components/calendarView/calendarView';
import {SpecialScheduleWindow} from '../../components/modals/specialScheduleWindow';
import {Popup} from '../../components/popup';
import {useTheme} from '../../contexts/ThemeContext';
import {useSetSettings} from '../../mutationHooks/settings/setSettings';
import {CalendarStackScreenProps} from '../../utils/types';
import {useSettings} from '../../utils/useSettings';

const CalendarHomeScreen: React.FC<
  CalendarStackScreenProps<'CalendarHomeScreen'>
> = ({navigation}) => {
  const [screenHeight, setScreenHeight] = useState(0);
  const [selectedDay, setSelectedDay] = useState(dayjs());
  const [specialScheduleWindowVisible, setSpecialScheduleWindowVisible] =
    useState(false);
  const findDimensions = (layout: any) => {
    const {x, y, width, height} = layout;
    setScreenHeight(height);
  };
  const [theme] = useTheme();
  const settings = useSettings();
  const [setSettings] = useSetSettings();

  const showAsOptionsItem = (
    <TouchableOpacity
      style={{width: '100%'}}
      onPress={() => {
        setSettings({showCalendarView: !settings?.showCalendarView});
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 14,
          paddingVertical: 8,
          width: '100%',
        }}>
        <BasicText textVariant="menuItem">Show as: </BasicText>
        <BasicText textVariant="menuItem" color="textSecondary">
          {settings?.showCalendarView ? 'Calendar' : 'List'}
        </BasicText>
      </View>
    </TouchableOpacity>
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Popup
          trigger={
            <BasicButton variant="unstyled">
              <BasicIcon
                source={require('../../../assets/Options.png')}
                style={{height: 20, width: 20}}
              />
            </BasicButton>
          }>
          <BasicCard
            backgroundColor="accentBackground1"
            spacing="none"
            style={{
              elevation: 8,
              shadowOpacity: 0.1,
              shadowOffset: {width: 0, height: 0},
              shadowRadius: 20,
              width: 200,
              paddingVertical: 5,
            }}>
            <TouchableOpacity
              onPress={() => {
                setSpecialScheduleWindowVisible(true);
              }}
              style={{paddingHorizontal: 14, paddingVertical: 8}}>
              <BasicText textVariant="menuItem">Special Schedule</BasicText>
            </TouchableOpacity>
            {showAsOptionsItem}
          </BasicCard>
        </Popup>
      ),
    });
  });

  return (
    <>
      <View
        style={{flex: 1}}
        onLayout={event => findDimensions(event.nativeEvent.layout)}>
        <CalendarView
          screenHeight={screenHeight}
          onChangeSelectedDay={setSelectedDay}
        />
        <View
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            margin: 20,
            marginBottom: 20,
            zIndex: 200,
          }}>
          <AddButton
            onPress={() => {
              navigation.navigate('EventDetailScreen', {
                event: undefined,
                date: selectedDay.hour(10),
              });
            }}
          />
        </View>
      </View>
      <SpecialScheduleWindow
        visible={specialScheduleWindowVisible}
        onClose={() => {
          setSpecialScheduleWindowVisible(false);
        }}
        date={selectedDay}
      />
    </>
  );
};

export default CalendarHomeScreen;
