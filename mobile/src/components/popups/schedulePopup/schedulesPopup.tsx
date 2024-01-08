import React from 'react';
import {SchedulesWindow} from '.';
import {ScheduleFragment} from '../../../generated/graphql';
import {Popup, PopupProps} from '../../popup';

interface SchedulesPopupProps extends PopupProps {
  selectedScheduleId: string;
  onSubmit: (schedule: ScheduleFragment) => void;
}

export const SchedulesPopup: React.FC<SchedulesPopupProps> = ({
  onSubmit,
  selectedScheduleId,
  ...props
}) => {
  return (
    <Popup {...props}>
      <SchedulesWindow
        onSubmit={onSubmit}
        selectedScheduleId={selectedScheduleId}
      />
    </Popup>
  );
};
