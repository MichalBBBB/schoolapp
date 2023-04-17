import React from 'react';
import SelectTimeView from '.';
import {BasicModalCard} from '../../basicViews/BasicModalCard';

interface SelectTimeModalProps {
  isVisible: boolean;
  onSubmit?: (time: string) => void;
  onClose?: () => void | undefined;
  initialTime?: string | undefined;
}

const SelectTimeModal: React.FC<SelectTimeModalProps> = ({
  onClose,
  onSubmit,
  isVisible,
  initialTime,
}) => {
  return (
    <BasicModalCard
      onBackdropPress={() => {
        if (onClose) {
          onClose();
        }
      }}
      isVisible={isVisible}
      alignCard="center">
      <SelectTimeView
        initialTime={initialTime}
        onSubmit={time => {
          if (onSubmit) {
            onSubmit(time);
          }
        }}
      />
    </BasicModalCard>
  );
};

export default SelectTimeModal;
