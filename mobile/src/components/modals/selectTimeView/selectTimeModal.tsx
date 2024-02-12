import React from 'react';
import SelectTimeView from '.';
import {BasicModalCard} from '../../basicViews/BasicModalCard';
import {ColorsObject} from '../../../types/Theme';

interface SelectTimeModalProps {
  isVisible: boolean;
  onSubmit: (time: string | null) => void;
  onClose: () => void;
  initialTime?: string | undefined;
  allowClear?: boolean;
  backgroundColor?: keyof ColorsObject;
}

const SelectTimeModal: React.FC<SelectTimeModalProps> = ({
  onClose,
  onSubmit,
  isVisible,
  initialTime,
  allowClear,
  backgroundColor,
}) => {
  return (
    <BasicModalCard
      backgroundColor={backgroundColor}
      onBackdropPress={() => {
        onClose();
      }}
      isVisible={isVisible}
      alignCard="center">
      <SelectTimeView
        onClose={onClose}
        initialTime={initialTime}
        allowClear={allowClear}
        onSubmit={time => {
          onSubmit(time);
        }}
      />
    </BasicModalCard>
  );
};

export default SelectTimeModal;
