import dayjs from 'dayjs';
import {useGetAllSchedulesQuery} from '../../generated/graphql';
import {useEditSchedule} from '../../mutationHooks/schedule/editSchedule';

export const useClearSchedulesForDay = () => {
  const {data: schedules} = useGetAllSchedulesQuery();
  const [editSchedule] = useEditSchedule();
  return (date: dayjs.Dayjs) => {
    schedules?.getAllSchedules.forEach(item => {
      if (item.dates?.some(item => dayjs(item).isSame(dayjs(date), 'day'))) {
        const newDates = item.dates.filter(
          itemDate => !dayjs(itemDate).isSame(date, 'day'),
        );
        editSchedule({
          id: item.id,
          dates: newDates,
        });
      }
    });
  };
};
