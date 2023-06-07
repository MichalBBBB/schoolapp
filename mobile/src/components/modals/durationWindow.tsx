import React, {useEffect} from 'react';
import dayjs from 'dayjs';
import {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {
  BasicModalCard,
  BasicModalCardProps,
} from '../basicViews/BasicModalCard';
import {BasicRadio} from '../basicViews/BasicRadio';
import {BasicCardProps} from '../basicViews/BasicCard';
import {BasicText} from '../basicViews/BasicText';
import {BasicButton} from '../basicViews/BasicButton';
import {BasicTextInput} from '../basicViews/BasicTextInput';

interface DurationWindowProps {
  onSubmit: (duration: number | null) => void;
  onClose: () => void;
  isVisible: boolean;
  initialDuration?: number | null;
}

type Duration = {
  title: string;
  minutes: number;
};

const durations: Duration[] = [
  {
    title: '5 minutes',
    minutes: 5,
  },
  {
    title: '10 minutes',
    minutes: 10,
  },
  {
    title: '15 minutes',
    minutes: 15,
  },
  {
    title: '20 minutes',
    minutes: 20,
  },
  {
    title: '30 minutes',
    minutes: 30,
  },
  {
    title: '1 hour',
    minutes: 60,
  },
  {
    title: '2 hours',
    minutes: 120,
  },
];

export const DurationWindow: React.FC<DurationWindowProps> = ({
  isVisible,
  onClose,
  onSubmit,
  initialDuration,
}) => {
  const [duration, setDuration] = useState(initialDuration || null);
  const [customDuration, setCustomDuration] = useState(3);

  return (
    <BasicModalCard
      style={{marginHorizontal: 20}}
      alignCard="center"
      isVisible={isVisible}
      onBackdropPress={() => {
        onClose();
      }}>
      <View style={{width: '100%', padding: 10, paddingLeft: 20}}>
        <BasicText textVariant="heading">Duration</BasicText>
      </View>
      <ScrollView style={{maxHeight: 300}}>
        <View style={styles.reminderTimesContainer}>
          <Pressable
            style={{flexDirection: 'row', marginBottom: 10}}
            onPress={() => {
              setDuration(null);
            }}>
            <BasicRadio style={{marginRight: 10}} toggled={duration == null} />
            <BasicText>None</BasicText>
          </Pressable>
          {/* Main durations */}
          {durations.map((item, index) => (
            <Pressable
              key={index}
              style={{flexDirection: 'row', marginBottom: 10}}
              onPress={() => {
                setDuration(item.minutes);
              }}>
              <BasicRadio
                style={{marginRight: 10}}
                toggled={duration == item.minutes}
              />
              <BasicText>{item.title}</BasicText>
            </Pressable>
          ))}
          {/* Custom duration */}
          <Pressable
            style={{
              flexDirection: 'row',
              marginBottom: 10,
              alignItems: 'center',
            }}
            onPress={() => {
              setDuration(customDuration);
            }}>
            <BasicRadio
              style={{marginRight: 10}}
              toggled={
                duration
                  ? !durations.map(item => item.minutes).includes(duration)
                  : false
              }
            />
            <BasicText>{`Custom: `}</BasicText>
            <BasicTextInput
              style={{
                marginLeft: 5,
                marginRight: 5,
                padding: 3,
              }}
              variant="outlined"
              borderWidth={1}
              backgroundColor="lightBorder"
              borderRadius={5}
              defaultValue={customDuration.toString()}
              keyboardType="numeric"
              returnKeyType="done"
              onChangeText={value => setCustomDuration(parseInt(value) || 0)}
              onSubmitEditing={() => {
                setCustomDuration(customDuration);
              }}
              selectTextOnFocus={true}
            />
            <BasicText>minutes</BasicText>
          </Pressable>
        </View>
      </ScrollView>
      <View style={styles.submitButtonContainer}>
        <BasicButton
          style={{flex: 1}}
          onPress={() => {
            onClose();
          }}
          variant={'unstyled'}>
          <BasicText color="textSecondary" style={{fontWeight: 'bold'}}>
            Cancel
          </BasicText>
        </BasicButton>
        <BasicButton
          style={{flex: 1}}
          onPress={() => {
            onSubmit(duration);
          }}
          variant={'unstyled'}>
          <BasicText color="primary" style={{fontWeight: 'bold'}}>
            Select
          </BasicText>
        </BasicButton>
      </View>
    </BasicModalCard>
  );
};

const styles = StyleSheet.create({
  submitButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    padding: 5,
    paddingTop: 10,
  },
  reminderTimesContainer: {
    marginHorizontal: 15,
    marginTop: 5,
  },
});
