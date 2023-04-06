import {FetchResult, MutationResult} from '@apollo/client';
import {
  CreateSubtaskMutation,
  CreateSubtaskMutationVariables,
  DeleteSubtaskMutation,
  DeleteSubtaskMutationVariables,
  TaskFragment,
  TaskFragmentDoc,
  useCreateSubtaskMutation,
  useDeleteSubtaskMutation,
} from '../../generated/graphql';

export type DeleteSubtaskFunction = (
  variables: DeleteSubtaskMutationVariables,
) => Promise<FetchResult<DeleteSubtaskMutation>>;

export const useDeleteSubtask: () => [
  DeleteSubtaskFunction,
  MutationResult<DeleteSubtaskMutation>,
] = () => {
  const [deleteSubtask, data] = useDeleteSubtaskMutation();
  const func = async (variables: DeleteSubtaskMutationVariables) => {
    const result = await deleteSubtask({
      context: {
        serializationKey: 'MUTATION',
      },
      variables: variables,
      optimisticResponse: {
        deleteSubtask: true,
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        const normalizedSubtaskId = `Subtask:${variables.id}`;
        cache.evict({id: normalizedSubtaskId});
        cache.gc();
      },
    });
    return result;
  };
  return [func, data];
};
