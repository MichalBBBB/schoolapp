import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useLayoutEffect, useState} from 'react';
import {Text, View} from 'react-native';
import AddButton from '../../components/addButton';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicIcon} from '../../components/basicViews/BasicIcon';
import CalendarView from '../../components/calendarView/calendarView';
import {Menu} from '../../components/menu';
import {MenuItem} from '../../components/menu/MenuItem';
import {SpecialScheduleWindow} from '../../components/modals/specialScheduleWindow';
import {Popup} from '../../components/popup';
import {CalendarStackScreenProps} from '../../utils/types';

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
          <Menu>
            <MenuItem
              text="Special schedule"
              onPress={() => {
                setSpecialScheduleWindowVisible(true);
              }}
            />
          </Menu>
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
                date: selectedDay,
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
