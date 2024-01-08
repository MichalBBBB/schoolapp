import {FetchResult, MutationResult} from '@apollo/client';
import {
  DeleteProjectTaskMutation,
  DeleteProjectTaskMutationVariables,
  useDeleteProjectTaskMutation,
} from '../../generated/graphql';

export type DeleteProjectTaskFunction = (
  variables: DeleteProjectTaskMutationVariables,
) => Promise<FetchResult<DeleteProjectTaskMutation>>;

export const useDeleteProjectTask: () => [
  DeleteProjectTaskFunction,
  MutationResult<DeleteProjectTaskMutation>,
] = () => {
  const [deleteProjectTask, data] = useDeleteProjectTaskMutation();
  const func = async (variables: DeleteProjectTaskMutationVariables) => {
    const result = await deleteProjectTask({
      context: {
        serializationKey: 'MUTATION',
        skipQueue: true,
      },
      variables: variables,
      optimisticResponse: {
        deleteProjectTask: true,
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        const normalizedProjectTaskId = `ProjectTask:${variables.id}`;
        cache.evict({id: normalizedProjectTaskId});
        cache.gc();
      },
    });
    return result;
  };
  return [func, data];
};
