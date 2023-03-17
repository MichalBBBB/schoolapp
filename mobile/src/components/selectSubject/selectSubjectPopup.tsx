import React from 'react';
import SelectSubjectWindow from '.';
import {SubjectFragment} from '../../generated/graphql';
import {ColorsObject} from '../../types/Theme';
import {Popup, PopupProps} from '../popup';

interface SelectSubjectPopupProps extends PopupProps {
  onSubmit: (subject: SubjectFragment | null) => void;
  backgroundColor?: keyof ColorsObject;
}

export const SelectSubjectPopup: React.FC<SelectSubjectPopupProps> = ({
  backgroundColor,
  onSubmit,
  ...rest
}) => {
  return (
    <Popup {...rest}>
      <SelectSubjectWindow
        onSubmit={onSubmit}
        backgroundColor={backgroundColor}
      />
    </Popup>
  );
};
