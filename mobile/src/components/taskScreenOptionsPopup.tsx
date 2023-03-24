import React from 'react';
import {
  LayoutAnimation,
  Pressable,
  TouchableHighlight,
  View,
} from 'react-native';
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
        <TouchableHighlight underlayColor={'#ddd'} style={{width: '100%'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              paddingVertical: 5,
              width: '100%',
            }}>
            <BasicText>Show: </BasicText>
            <BasicText color="textSecondary">
              {settings?.showDoDate ? 'Do Date' : 'Due Date'}
            </BasicText>
          </View>
        </TouchableHighlight>
      }>
      <BasicCard
        backgroundColor="accentBackground2"
        style={{
          elevation: 8,
          shadowOpacity: 0.1,
          shadowOffset: {width: 0, height: 0},
          shadowRadius: 20,
        }}>
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
        <TouchableHighlight underlayColor={'#ddd'} style={{width: '100%'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}>
            <BasicText>Sort by: </BasicText>
            <BasicText color="textSecondary">
              {
                sortableParams[
                  settings?.sortTasksBy as keyof typeof sortableParams
                ]
              }
            </BasicText>
          </View>
        </TouchableHighlight>
      }>
      <BasicCard
        style={{
          elevation: 8,
          shadowOpacity: 0.1,
          shadowOffset: {width: 0, height: 0},
          shadowRadius: 20,
        }}
        backgroundColor="accentBackground2">
        <Pressable
          style={{
            padding: 5,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            setSettings({sortTasksBy: 'DUE_DATE'});
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
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
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
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
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
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
      <View
        style={{
          elevation: 8,
          shadowOpacity: 0.1,
          shadowOffset: {width: 0, height: 0},
          shadowRadius: 20,
        }}>
        <BasicCard
          backgroundColor="accentBackground2"
          spacing="none"
          style={{
            paddingVertical: 5,
            width: 180,
            overflow: 'hidden',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 3,
              justifyContent: 'space-between',
            }}>
            <BasicText>Show Completed</BasicText>
            <BasicRadio
              color="textSecondary"
              toggled={settings?.showCompletedTasks || false}
              onToggle={value => {
                setSettings({showCompletedTasks: value});
              }}
            />
          </View>
          <View style={{flexDirection: 'row'}}>{showDoDateItem}</View>
          <View style={{flexDirection: 'row'}}>{sortItem}</View>
        </BasicCard>
      </View>
    </Popup>
  );
};
