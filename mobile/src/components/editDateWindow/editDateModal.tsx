import dayjs from 'dayjs';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import EditDateWindow from '.';
import {SubjectFragment} from '../../generated/graphql';

interface EditDateModalProps {
  onClose: () => void;
  onSubmit: (date: dayjs.Dayjs) => void;
  initialDate?: dayjs.Dayjs | null;
  isVisible: boolean;
  onHide?: () => void | undefined;
  subject?: SubjectFragment | undefined | null;
}

const EditDateModal: React.FC<EditDateModalProps> = ({
  onClose,
  onSubmit,
  initialDate,
  isVisible,
  onHide,
  subject,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.3}
      onBackdropPress={() => onClose()}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      onModalHide={() => {
        if (onHide) {
          onHide();
        }
      }}>
      <EditDateWindow
        initialDate={initialDate}
        subject={subject}
        onSubmit={date => {
          onSubmit(date);
        }}
      />
    </Modal>
  );
};

export default EditDateModal;
