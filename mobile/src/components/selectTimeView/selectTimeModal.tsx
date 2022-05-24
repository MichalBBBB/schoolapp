import React from 'react';
import SelectTimeView from '.';
import {BasicModalCard} from '../basicViews/BasicModalCard';

interface SelectTimeModalProps {
  isVisible: boolean;
  onSubmit?: (time: string) => void;
  onModalHide?: () => void | undefined;
  onClose?: () => void | undefined;
  initialTime?: string | undefined;
}

const SelectTimeModal: React.FC<SelectTimeModalProps> = ({
  onClose,
  onSubmit,
  onModalHide,
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
      onModalHide={() => {
        if (onModalHide) {
          onModalHide();
        }
      }}
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
