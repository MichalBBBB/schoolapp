import React from 'react';
import SelectTimeView from '.';
import {BasicModalCard} from '../../basicViews/BasicModalCard';

interface SelectTimeModalProps {
  isVisible: boolean;
  onSubmit: (time: string | null) => void;
  onClose: () => void;
  initialTime?: string | undefined;
  allowClear?: boolean;
}

const SelectTimeModal: React.FC<SelectTimeModalProps> = ({
  onClose,
  onSubmit,
  isVisible,
  initialTime,
  allowClear,
}) => {
  return (
    <BasicModalCard
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
