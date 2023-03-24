import React from 'react';
import {View} from 'react-native';
import {SubjectColorsObject} from '../../types/Theme';
import {Popup} from '../popup';
import {ColorPickerWindow} from './colorPickerWindow';

interface ColorPickerPopupProps {
  trigger: React.ReactElement;
  onSubmit: (color: keyof SubjectColorsObject) => void;
  initialColor: keyof SubjectColorsObject;
}

export const ColorPickerPopup: React.FC<ColorPickerPopupProps> = ({
  trigger,
  ...props
}) => {
  return (
    <Popup trigger={trigger}>
      <ColorPickerWindow {...props} />
    </Popup>
  );
};
