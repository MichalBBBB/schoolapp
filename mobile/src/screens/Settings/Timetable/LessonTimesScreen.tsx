import React, {useState} from 'react';
import {useLayoutEffect} from 'react';
import {Pressable, View} from 'react-native';
import {BasicButton} from '../../../components/basicViews/BasicButton';
import {BasicCard} from '../../../components/basicViews/BasicCard';
import {BasicIcon} from '../../../components/basicViews/BasicIcon';
import {BasicText} from '../../../components/basicViews/BasicText';
import {BasicTextInput} from '../../../components/basicViews/BasicTextInput';
import {LessonTimesView} from '../../../components/lessonTimeView';
import {Menu} from '../../../components/menu';
import {MenuItem} from '../../../components/menu/MenuItem';
import {Popup} from '../../../components/popup';
import {useDeleteSchedule} from '../../../mutationHooks/schedule/deleteSchedule';
import {useEditSchedule} from '../../../mutationHooks/schedule/editSchedule';
import {SettingsStackScreenProps} from '../../../utils/types';

const LessonTimesScreen: React.FC<
  SettingsStackScreenProps<'LessonTimesScreen'>
> = ({navigation, route}) => {
  const [editSchedule] = useEditSchedule();
  const [deleteSchedule] = useDeleteSchedule();

  const {schedule} = route.params;

  const [name, setName] = useState(schedule.name);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerRight: () => (
        <Popup
          trigger={
            <BasicButton variant="unstyled">
              <BasicIcon
                source={require('../../../../assets/Options.png')}
                style={{height: 20, width: 20}}
              />
            </BasicButton>
          }>
          <Menu>
            <MenuItem
              color="dangerous"
              text={'Delete schedule'}
              onPress={() => {
                deleteSchedule({id: schedule.id});
                navigation.goBack();
              }}
            />
          </Menu>
        </Popup>
      ),
    });
  });

  return (
    <View>
      <BasicTextInput
        style={{textAlign: 'center'}}
        defaultValue={schedule.name}
        variant="unstyled"
        textVariant="heading"
        onChangeText={value => {
          setName(value);
        }}
        onBlur={() => {
          editSchedule({id: schedule.id, name});
        }}
      />
      <LessonTimesView scheduleId={schedule.id} />
    </View>
  );
};

export default LessonTimesScreen;
