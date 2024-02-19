import dayjs from 'dayjs';
import {useGetAllLessonsQuery} from '../generated/graphql';
import {useDeleteLesson} from '../mutationHooks/lesson/deleteLesson';

export const useClearLessonsForDay = () => {
  const {data: lessons} = useGetAllLessonsQuery();
  const [deleteLesson] = useDeleteLesson();
  return (date: dayjs.Dayjs) => {
    lessons?.getAllLessons.forEach(item => {
      if (dayjs(item.date).isSame(date, 'day')) {
        deleteLesson({id: item.id});
      }
    });
  };
};
