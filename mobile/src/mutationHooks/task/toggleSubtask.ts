import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';
import {
  SubjectFragmentDoc,
  SubtaskFragment,
  SubtaskFragmentDoc,
  ToggleSubtaskMutation,
  ToggleSubtaskMutationVariables,
  useToggleSubtaskMutation,
} from '../../generated/graphql';

export type ToggleSubtaskFunction = (
  variables: ToggleSubtaskMutationVariables,
) => Promise<FetchResult<ToggleSubtaskMutation>>;

export const useToggleSubtask: () => [
  ToggleSubtaskFunction,
  MutationResult<ToggleSubtaskMutation>,
] = () => {
  const [toggleSubtask, data] = useToggleSubtaskMutation();
  const client = useApolloClient();
  const func = async (variables: ToggleSubtaskMutationVariables) => {
    const normalizedSubtaskId = `Subtask:${variables.id}`;
    const subtask = client.readFragment<SubtaskFragment>({
      fragment: SubtaskFragmentDoc,
      fragmentName: 'Subtask',
      id: normalizedSubtaskId,
    });
    const result = await toggleSubtask({
      variables: variables,
      optimisticResponse: {
        toggleSubtask: {
          __typename: 'Subtask',
          name: subtask?.name || '',
          id: variables.id,
          taskId: subtask?.taskId || '',
          done: !subtask?.done,
        },
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        const normalizedSubtaskId = `Subtask:${variables.id}`;
        cache.writeFragment({
          fragmentName: 'Subtask',
          fragment: SubtaskFragmentDoc,
          id: normalizedSubtaskId,
          data: data.toggleSubtask,
        });
      },
    });
    return result;
  };
  return [func, data];
};
