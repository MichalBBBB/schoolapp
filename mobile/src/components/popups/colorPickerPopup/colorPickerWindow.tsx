import React from 'react';
import {Pressable, View} from 'react-native';
import {color} from 'react-native-reanimated';
import {useTheme} from '../../../contexts/ThemeContext';
import {SubjectColorsObject} from '../../../types/Theme';
import {BasicCard} from '../../basicViews/BasicCard';
import {BasicText} from '../../basicViews/BasicText';
import {Popup} from '../../popup';

interface ColorPickerPopupProps {
  onSubmit: (color: keyof SubjectColorsObject) => void;
  initialColor: keyof SubjectColorsObject;
  animateClose?: () => void;
}

export const ColorPickerWindow: React.FC<ColorPickerPopupProps> = ({
  onSubmit,
  initialColor,
  animateClose,
}) => {
  const [theme] = useTheme();
  return (
    <BasicCard
      backgroundColor="accentBackground2"
      spacing="m"
      style={{
        elevation: 8,
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 20,
      }}>
      <BasicText style={{marginBottom: 5}} textVariant="subHeading">
        Select a color
      </BasicText>
      <View style={{flexWrap: 'wrap', flexDirection: 'row', width: 130}}>
        {Object.entries(theme.subjectColors).map((item, index) => (
          <Pressable
            key={index}
            onPress={() => {
              onSubmit(item[0] as keyof SubjectColorsObject);
              animateClose?.();
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 38,
              width: 38,
              borderRadius: 19,
              borderWidth: initialColor == item[0] ? 2 : 0,
              borderColor:
                theme.subjectColors[item[0] as keyof SubjectColorsObject]
                  .primary,
              backgroundColor: 'rgba(0,0,0,0)',
              marginRight: 5,
            }}>
            <View
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                backgroundColor:
                  theme.subjectColors[item[0] as keyof SubjectColorsObject]
                    .primary,
              }}
            />
          </Pressable>
        ))}
      </View>
    </BasicCard>
  );
};
