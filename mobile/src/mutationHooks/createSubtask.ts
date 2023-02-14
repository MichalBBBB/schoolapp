import {FetchResult, MutationResult} from '@apollo/client';
import {
  CreateSubtaskMutation,
  CreateSubtaskMutationVariables,
  TaskFragment,
  TaskFragmentDoc,
  useCreateSubtaskMutation,
} from '../generated/graphql';

export type CreateSubtaskFunction = (
  variables: CreateSubtaskMutationVariables,
) => Promise<FetchResult<CreateSubtaskMutation>>;

export const useCreateSubtask: () => [
  CreateSubtaskFunction,
  MutationResult<CreateSubtaskMutation>,
] = () => {
  const [createSubtask, data] = useCreateSubtaskMutation();
  const func = async (variables: CreateSubtaskMutationVariables) => {
    const result = await createSubtask({
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        createSubtask: {
          __typename: 'Subtask',
          name: variables.name,
          id: variables.id,
          taskId: variables.taskId,
          done: false,
        },
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        const {createSubtask: subtask} = data;
        const normalizedTaskId = `Task:${variables.taskId}`;
        const cacheData = cache.readFragment<TaskFragment>({
          id: normalizedTaskId,
          fragmentName: 'Task',
          fragment: TaskFragmentDoc,
        });
        if (!cacheData) {
          return;
        }
        const subtasks = cacheData.subtasks;
        const newSubtasks = [...subtasks, subtask];
        cache.writeFragment({
          id: normalizedTaskId,
          fragment: TaskFragmentDoc,
          fragmentName: 'Task',
          data: {
            ...cacheData,
            subtasks: newSubtasks,
          },
        });
      },
    });
    return result;
  };
  return [func, data];
};
