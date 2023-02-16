import {FetchResult, MutationResult} from '@apollo/client';
import {
  DeleteLessonTimeMutation,
  DeleteLessonTimeMutationVariables,
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
        const normalizedLessonTimeId = `LessonTime:${variables.id}`;
        cache.evict({id: normalizedLessonTimeId});
      },
    });
    return result;
  };
  return [func, data];
};
