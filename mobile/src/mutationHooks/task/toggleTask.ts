import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';
import Task from '../../components/task';
import {
  SubjectFragmentDoc,
  TaskFragment,
  TaskFragmentDoc,
  ToggleTaskMutation,
  ToggleTaskMutationVariables,
  useToggleTaskMutation,
} from '../../generated/graphql';

export type ToggleTaskFunction = (
  variables: ToggleTaskMutationVariables,
) => Promise<FetchResult<ToggleTaskMutation> | undefined>;

export const useToggleTask: () => [
  ToggleTaskFunction,
  MutationResult<ToggleTaskMutation>,
] = () => {
  const [toggleTask, data] = useToggleTaskMutation();
  const client = useApolloClient();
  const func = async (variables: ToggleTaskMutationVariables) => {
    const normalizedTaskId = `Task:${variables.id}`;
    const task = client.readFragment<TaskFragment>({
      fragment: TaskFragmentDoc,
      fragmentName: 'Task',
      id: normalizedTaskId,
    });
    if (!task) {
      return undefined;
    }
    const result = await toggleTask({
      variables: variables,
      optimisticResponse: {
        toggleTask: {
          ...task,
          done: !task?.done,
        },
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        const normalizedTaskId = `Task:${variables.id}`;
        cache.writeFragment<TaskFragment>({
          fragment: TaskFragmentDoc,
          fragmentName: 'Task',
          id: normalizedTaskId,
          data: {
            ...data.toggleTask,
          },
        });
      },
    });
    return result;
  };
  return [func, data];
};
