import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';
import {
  EditProjectTaskMutation,
  EditProjectTaskMutationVariables,
  GetAllRemindersDocument,
  GetAllRemindersQuery,
  RemindersInput,
  SubjectFragment,
  SubjectFragmentDoc,
  ProjectTaskFragmentDoc,
  useEditProjectTaskMutation,
  ProjectFragment,
  ProjectFragmentDoc,
  ProjectTaskFragment,
} from '../../generated/graphql';

export type EditProjectTaskFunction = (
  variables: EditProjectTaskMutationVariables,
) => Promise<FetchResult<EditProjectTaskMutation> | null>;

export const useEditProjectTask: () => [
  EditProjectTaskFunction,
  MutationResult<EditProjectTaskMutation>,
] = () => {
  const [editProjectTask, data] = useEditProjectTaskMutation();
  const client = useApolloClient();
  const func = async (variables: EditProjectTaskMutationVariables) => {
    const projectTask = client.readFragment<ProjectTaskFragment>({
      fragment: ProjectTaskFragmentDoc,
      fragmentName: 'ProjectTask',
      id: `ProjectTask:${variables.id}`,
    });

    if (projectTask) {
      const result = await editProjectTask({
        context: {
          serializationKey: 'MUTATION',
          skipQueue: true,
        },
        variables: variables,
        optimisticResponse: {
          __typename: 'Mutation',
          editProjectTask: {
            __typename: 'ProjectTask',
            id: variables.id,
            name: variables.name,
            createdAt: projectTask.createdAt,
            done: projectTask.done,
            updatedAt: new Date().toISOString(),
            dueDate: variables.dueDate || null,
            doDate: variables.doDate || null,
            projectId: projectTask.projectId,
            publicUsers: projectTask.publicUsers,
          },
        },
        update: (cache, {data}) => {
          if (!data) {
            return;
          }
          const normalizedProjectTaskId = `ProjectTask:${variables.id}`;
          cache.writeFragment({
            id: normalizedProjectTaskId,
            fragment: ProjectTaskFragmentDoc,
            fragmentName: 'ProjectTask',
            data: data.editProjectTask,
          });
        },
      });
      return result;
    }
    return null;
  };
  return [func, data];
};
