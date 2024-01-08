import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';
import {
  SubjectFragmentDoc,
  ProjectTaskFragment,
  ProjectTaskFragmentDoc,
  ToggleProjectTaskMutation,
  ToggleProjectTaskMutationVariables,
  useToggleProjectTaskMutation,
} from '../../generated/graphql';

export type ToggleProjectTaskFunction = (
  variables: ToggleProjectTaskMutationVariables,
) => Promise<FetchResult<ToggleProjectTaskMutation> | undefined>;

export const useToggleProjectTask: () => [
  ToggleProjectTaskFunction,
  MutationResult<ToggleProjectTaskMutation>,
] = () => {
  const [toggleProjectTask, data] = useToggleProjectTaskMutation();
  const client = useApolloClient();
  const func = async (variables: ToggleProjectTaskMutationVariables) => {
    const normalizedProjectTaskId = `ProjectTask:${variables.id}`;
    const projectTask = client.readFragment<ProjectTaskFragment>({
      fragment: ProjectTaskFragmentDoc,
      fragmentName: 'ProjectTask',
      id: normalizedProjectTaskId,
    });
    if (!projectTask) {
      return undefined;
    }
    const result = await toggleProjectTask({
      context: {
        serializationKey: 'MUTATION',
        skipQueue: true,
      },
      variables: variables,
      optimisticResponse: {
        toggleProjectTask: {
          ...projectTask,
          done: !projectTask?.done,
        },
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        const normalizedProjectTaskId = `ProjectTask:${variables.id}`;
        cache.writeFragment<ProjectTaskFragment>({
          fragment: ProjectTaskFragmentDoc,
          fragmentName: 'ProjectTask',
          id: normalizedProjectTaskId,
          data: {
            ...data.toggleProjectTask,
          },
        });
      },
    });
    return result;
  };
  return [func, data];
};
