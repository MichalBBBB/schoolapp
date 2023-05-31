import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';
import {
  EditSubtaskMutation,
  EditSubtaskMutationVariables,
  SubtaskFragment,
  SubtaskFragmentDoc,
  useEditSubtaskMutation,
} from '../../generated/graphql';

export type EditSubtaskFunction = (
  variables: EditSubtaskMutationVariables,
) => Promise<FetchResult<EditSubtaskMutation> | null>;

export const useEditSubtask: () => [
  EditSubtaskFunction,
  MutationResult<EditSubtaskMutation>,
] = () => {
  const [editSubtask, data] = useEditSubtaskMutation();
  const client = useApolloClient();
  const func = async (variables: EditSubtaskMutationVariables) => {
    const subtask = client.readFragment<SubtaskFragment>({
      fragment: SubtaskFragmentDoc,
      fragmentName: 'Subtask',
      id: `Subtask:${variables.id}`,
    });
    if (subtask) {
      const result = await editSubtask({
        context: {
          serializationKey: 'MUTATION',
        },
        variables: variables,
        optimisticResponse: {
          __typename: 'Mutation',
          editSubtask: {
            ...subtask,
            name: variables.name,
          },
        },
        update: (cache, {data}) => {
          if (!data) {
            return;
          }
          const normalizedSubtaskId = `Subtask:${variables.id}`;
          cache.writeFragment({
            id: normalizedSubtaskId,
            fragment: SubtaskFragmentDoc,
            fragmentName: 'Subtask',
            data: data.editSubtask,
          });
        },
      });
      return result;
    }
    return null;
  };
  return [func, data];
};
