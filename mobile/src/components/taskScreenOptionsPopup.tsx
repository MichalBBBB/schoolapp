import React from 'react';
import {Pressable, View} from 'react-native';
import {useSetSettings} from '../mutationHooks/settings/setSettings';
import {useSettings} from '../utils/useSettings';
import {BasicCard} from './basicViews/BasicCard';
import {BasicRadio} from './basicViews/BasicRadio';
import {BasicText} from './basicViews/BasicText';
import {Popup} from './popup';

const sortableParams = {
  DATE_ADDED: 'Date Added',
  DUE_DATE: 'Due Date',
  DO_DATE: 'Do Date',
};

export const TaskScreenOptionsPopup: React.FC<{
  trigger: React.ReactElement;
}> = ({trigger}) => {
  const settings = useSettings();
  const [setSettings] = useSetSettings();

  const showDoDateItem = (
    <Popup
      trigger={
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 5,
          }}>
          <BasicText>Show: </BasicText>
          <BasicText color="textSecondary">
            {settings?.showDoDate ? 'Do Date' : 'Due Date'}
          </BasicText>
        </Pressable>
      }>
      <BasicCard
        backgroundColor="accentBackground2"
        style={{shadowOpacity: 0.2}}>
        <Pressable
          style={{
            padding: 5,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            setSettings({showDoDate: false});
          }}>
          <BasicRadio
            toggled={!settings?.showDoDate}
            style={{marginRight: 10}}
            color="icon"
          />
          <BasicText>Due Date</BasicText>
        </Pressable>
        <Pressable
          style={{
            padding: 5,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            setSettings({showDoDate: true});
          }}>
          <BasicRadio
            toggled={settings?.showDoDate || false}
            style={{marginRight: 10}}
            color="icon"
          />
          <BasicText>Do Date</BasicText>
        </Pressable>
      </BasicCard>
    </Popup>
  );

  const sortItem = (
    <Popup
      trigger={
        <Pressable
          style={{flexDirection: 'row', alignItems: 'center', padding: 5}}>
          <BasicText>Sort by: </BasicText>
          <BasicText color="textSecondary">
            {
              sortableParams[
                settings?.sortTasksBy as keyof typeof sortableParams
              ]
            }
          </BasicText>
        </Pressable>
      }>
      <BasicCard
        style={{shadowOpacity: 0.1}}
        backgroundColor="accentBackground2">
        <Pressable
          style={{
            padding: 5,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            setSettings({sortTasksBy: 'DUE_DATE'});
          }}>
          <BasicRadio
            toggled={settings?.sortTasksBy == 'DUE_DATE'}
            style={{marginRight: 10}}
            color="icon"
          />
          <BasicText>Due Date</BasicText>
        </Pressable>
        <Pressable
          style={{
            padding: 5,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            setSettings({sortTasksBy: 'DO_DATE'});
          }}>
          <BasicRadio
            toggled={settings?.sortTasksBy == 'DO_DATE'}
            style={{marginRight: 10}}
            color="icon"
          />
          <BasicText>Do Date</BasicText>
        </Pressable>
        <Pressable
          style={{
            padding: 5,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            setSettings({sortTasksBy: 'DATE_ADDED'});
          }}>
          <BasicRadio
            toggled={settings?.sortTasksBy == 'DATE_ADDED'}
            style={{marginRight: 10}}
            color="icon"
          />
          <BasicText>Date Added</BasicText>
        </Pressable>
      </BasicCard>
    </Popup>
  );

  return (
    <Popup trigger={trigger}>
      <BasicCard backgroundColor="accentBackground2">
        <View style={{flexDirection: 'row'}}>{showDoDateItem}</View>
        <View style={{flexDirection: 'row'}}>{sortItem}</View>
      </BasicCard>
    </Popup>
  );
};
