import {
  useDeleteTaskMutation,
  DeleteTaskMutation,
  GetAllTasksDocument,
  GetAllTasksQuery,
  TaskFragmentDoc,
} from '../../generated/graphql';
import {DeleteTaskMutationVariables} from '../../generated/graphql';
import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';

export type DeleteTaskFunction = (
  variables: DeleteTaskMutationVariables,
) => Promise<FetchResult<DeleteTaskMutation>>;

export const useDeleteTask: () => [
  DeleteTaskFunction,
  MutationResult<DeleteTaskMutation>,
] = () => {
  const client = useApolloClient();
  const [deleteTask, data] = useDeleteTaskMutation();

  const func = async (variables: DeleteTaskMutationVariables) => {
    const tasks = await client.query<GetAllTasksQuery>({
      query: GetAllTasksDocument,
    });
    const task = tasks.data.getAllTasks.find(item => {
      return item.id == variables.id;
    });
    const subtasks = task?.subtasks;
    const result = await deleteTask({
      context: {
        serializationKey: 'MUTATION',
      },
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        deleteTask: true,
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        if (data.deleteTask) {
          const normalizedTaskId = `Task:${variables.id}`;
          cache.evict({id: normalizedTaskId});
          cache.gc();
        }
      },
    });
    return result;
  };
  return [func, data];
};
