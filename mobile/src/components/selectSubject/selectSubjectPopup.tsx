import React from 'react';
import SelectSubjectWindow from '.';
import {SubjectFragment} from '../../generated/graphql';
import {Popup, PopupProps} from '../popup';

interface SelectSubjectPopupProps extends PopupProps {
  onSubmit: (subject: SubjectFragment | null) => void;
}

export const SelectSubjectPopup: React.FC<SelectSubjectPopupProps> = ({
  onSubmit,
  ...rest
}) => {
  return (
    <Popup {...rest}>
      <SelectSubjectWindow onSubmit={onSubmit} />
    </Popup>
  );
};
