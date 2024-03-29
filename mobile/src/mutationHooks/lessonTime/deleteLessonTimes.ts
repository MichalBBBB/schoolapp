import {FetchResult, MutationResult} from '@apollo/client';
import {
  DeleteLessonTimeMutationVariables,
  DeleteLessonTimeMutation,
  GetAllLessonsQuery,
  GetAllLessonsDocument,
  useDeleteLessonTimeMutation,
} from '../../generated/graphql';

export type DeleteLessonTimeFunction = (
  variables: DeleteLessonTimeMutationVariables,
) => Promise<FetchResult<DeleteLessonTimeMutation>>;

export const useDeleteLessonTime: () => [
  DeleteLessonTimeFunction,
  MutationResult<DeleteLessonTimeMutation>,
] = () => {
  const [deleteLessonTime, data] = useDeleteLessonTimeMutation();
  const func = async (variables: DeleteLessonTimeMutationVariables) => {
    const result = await deleteLessonTime({
      context: {
        serializationKey: 'MUTATION',
      },
      variables: variables,
      optimisticResponse: {
        deleteLessonTime: true,
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }

        // delete all lessons with this lesson time
        const lessons = cache.readQuery<GetAllLessonsQuery>({
          query: GetAllLessonsDocument,
        });
        cache.writeQuery<GetAllLessonsQuery>({
          query: GetAllLessonsDocument,
          data: {
            getAllLessons:
              lessons?.getAllLessons.filter(item => {
                return item.lessonTime.id !== variables.id;
              }) || [],
          },
        });
        const normalizedLessonTimeId = `LessonTime:${variables.id}`;
        cache.evict({id: normalizedLessonTimeId});
        cache.gc();
      },
    });
    return result;
  };
  return [func, data];
};
