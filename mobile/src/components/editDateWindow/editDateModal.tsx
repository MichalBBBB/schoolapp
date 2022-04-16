import dayjs from 'dayjs';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import EditDateWindow from '.';

interface EditDateModalProps {
  onClose: () => void;
  onSubmit: (date: dayjs.Dayjs) => void;
  initialDate?: dayjs.Dayjs | null;
  isVisible: boolean;
}

const EditDateModal: React.FC<EditDateModalProps> = ({
  onClose,
  onSubmit,
  initialDate,
  isVisible,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.3}
      onBackdropPress={() => onClose()}
      animationIn="fadeInUp"
      animationOut="fadeOutDown">
      <EditDateWindow
        initialDate={initialDate}
        onSubmit={date => {
          onSubmit(date);
        }}
      />
    </Modal>
  );
};

export default EditDateModal;
