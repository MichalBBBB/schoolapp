import {useState} from 'react';
import {Pressable, View} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {SubjectColorsObject} from '../types/Theme';
import {BasicButton} from './basicViews/BasicButton';
import {BasicModalCard} from './basicViews/BasicModalCard';
import {BasicText} from './basicViews/BasicText';

interface ColorPickerProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (colorName: keyof SubjectColorsObject) => void;
  initialColor?: keyof SubjectColorsObject;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  isVisible,
  onClose,
  onSubmit,
  initialColor = 'blue',
}) => {
  const [theme] = useTheme();
  const [color, setColor] = useState(initialColor);
  return (
    <BasicModalCard
      isVisible={isVisible}
      onBackdropPress={onClose}
      alignCard="center">
      <View style={{flexDirection: 'row', padding: 10}}>
        {Object.entries(theme.subjectColors).map((item, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setColor(item[0] as keyof SubjectColorsObject);
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 38,
              width: 38,
              borderRadius: 19,
              borderWidth: color == item[0] ? 2 : 0,
              borderColor: theme.colors.textSecondary,
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
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <BasicButton
          onPress={() => {
            onSubmit(color);
          }}>
          <BasicText color="textContrast" textVariant="button">
            Select
          </BasicText>
        </BasicButton>
      </View>
    </BasicModalCard>
  );
};
