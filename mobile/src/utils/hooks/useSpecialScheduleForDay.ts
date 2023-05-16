import dayjs from 'dayjs';
import {useGetAllSchedulesQuery} from '../../generated/graphql';

export const useGetSpecialScheduleForDay = (date: dayjs.Dayjs) => {
  const {data: schedules} = useGetAllSchedulesQuery();
  return schedules?.getAllSchedules.find(item =>
    item.dates?.some(itemDate => dayjs(itemDate).isSame(date, 'day')),
  );
};
