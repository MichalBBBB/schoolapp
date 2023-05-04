import React, {useState} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import {v4} from 'uuid';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicCard} from '../../components/basicViews/BasicCard';
import {BasicIcon} from '../../components/basicViews/BasicIcon';
import {BasicText} from '../../components/basicViews/BasicText';
import {OnboardingContinueButton} from '../../components/onboardingContinueButton';
import {useCreateSubject} from '../../mutationHooks/subject/createSubject';
import {ExampleSubject, exampleSubjects} from '../../utils/exampleSubjects';
import {OnboardingStackScreenProps} from '../../utils/types';

export const AddSubjectsScreen: React.FC<
  OnboardingStackScreenProps<'AddSubjectsScreen'>
> = ({navigation}) => {
  const [selectedSubjects, setSelectedSubjects] = useState<ExampleSubject[]>(
    [],
  );
  const [createSubject] = useCreateSubject();

  const createSubjects = async () => {
    selectedSubjects.forEach(item => {
      createSubject({name: item.name, colorName: item.color, id: v4()});
    });
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{padding: 20, flex: 1}}>
        <BasicText textVariant="title">Choose your subjects</BasicText>
        <BasicText
          textVariant="subHeading"
          color="textSecondary"
          style={{marginBottom: 20}}>
          You can change this later
        </BasicText>
        <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
          {exampleSubjects.map((item, index) => (
            <BasicButton
              onPress={() => {
                if (!selectedSubjects.includes(item)) {
                  setSelectedSubjects([...selectedSubjects, item]);
                }
              }}
              key={index}
              variant={selectedSubjects.includes(item) ? 'filled' : 'subject'}
              backgroundColor="border"
              subjectColor={item.color}
              style={{marginRight: 5, marginBottom: 5}}
              spacing="m"
              borderWidth={1}>
              <BasicText>{item.name}</BasicText>
            </BasicButton>
          ))}
        </View>
        <BasicText style={{marginTop: 5}} color="textSecondary">
          You can also add custom subjects later
        </BasicText>
      </ScrollView>
      <BasicCard
        backgroundColor="accentBackground1"
        spacing="l"
        style={{
          width: '100%',
          height: 300,
        }}>
        <BasicText textVariant="heading" style={{marginBottom: 10}}>
          Selected Subjects
        </BasicText>
        <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
          {selectedSubjects.map((item, index) => (
            <BasicCard
              key={index}
              subjectColor={item.color}
              style={{marginRight: 5, marginBottom: 5}}
              spacing="s"
              borderWidth={1}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <BasicButton
                  onPress={() => {
                    setSelectedSubjects(
                      selectedSubjects.filter(
                        subject => subject.name !== item.name,
                      ),
                    );
                  }}
                  style={{marginRight: 5, borderRadius: 10}}
                  backgroundColor="accentBackground1">
                  <BasicIcon
                    source={require('../../../assets/Close.png')}
                    style={{height: 15, width: 15}}
                  />
                </BasicButton>
                <BasicText style={{marginRight: 5}}>{item.name}</BasicText>
              </View>
            </BasicCard>
          ))}
        </View>
      </BasicCard>
      <OnboardingContinueButton
        onPress={() => {
          createSubjects();
          navigation.navigate('LessonTimeScreen');
        }}
      />
    </View>
  );
};
