import dayjs from 'dayjs';
import {useGetAllTasksQuery} from '../generated/graphql';
import {setBadgeCount} from './notifications';

export const useSetBadge = () => {
  const {data} = useGetAllTasksQuery();
  const func = () => {
    let number = 0;
    data?.getAllTasks.forEach(task => {
      if (dayjs(task.doDate).isSame(dayjs(), 'date')) {
        number += 1;
      }
    });
    setBadgeCount(number);
    console.log(number);
  };
  return func;
};
