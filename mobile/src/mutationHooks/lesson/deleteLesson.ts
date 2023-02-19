import {
  useDeleteLessonMutation,
  DeleteLessonMutation,
  GetAllLessonsDocument,
  GetAllLessonsQuery,
} from '../../generated/graphql';
import {DeleteLessonMutationVariables} from '../../generated/graphql';
import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';

export type DeleteLessonFunction = (
  variables: DeleteLessonMutationVariables,
) => Promise<FetchResult<DeleteLessonMutation>>;

export const useDeleteLesson: () => [
  DeleteLessonFunction,
  MutationResult<DeleteLessonMutation>,
] = () => {
  const [deleteLesson, data] = useDeleteLessonMutation();

  const func = async (variables: DeleteLessonMutationVariables) => {
    const result = await deleteLesson({
      context: {
        serializationKey: 'MUTATION',
      },
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        deleteLesson: true,
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        const normalizedLessonId = `Lesson:${variables.id}`;
        cache.evict({id: normalizedLessonId});
      },
    });
    return result;
  };
  return [func, data];
};
