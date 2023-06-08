import {FetchResult, MutationResult} from '@apollo/client';
import {
  AddProjectTaskMutation,
  AddProjectTaskMutationVariables,
  ProjectFragment,
  ProjectFragmentDoc,
  useAddProjectTaskMutation,
} from '../../generated/graphql';

export type AddProjectTaskFunction = (
  variables: AddProjectTaskMutationVariables,
) => Promise<FetchResult<AddProjectTaskMutation>>;

export const useAddProjectTask: () => [
  AddProjectTaskFunction,
  MutationResult<AddProjectTaskMutation>,
] = () => {
  const [AddProjectTask, data] = useAddProjectTaskMutation();
  const func = async (variables: AddProjectTaskMutationVariables) => {
    const result = await AddProjectTask({
      context: {
        serializationKey: 'MUTATION',
        skipQueue: true,
      },
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        addProjectTask: {
          __typename: 'ProjectTask',
          name: variables.name,
          id: variables.id,
          projectId: variables.projectId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          doDate: variables.doDate || null,
          dueDateIncludesTime: variables.dueDateIncludesTime || false,
          doDateIncludesTime: variables.doDateIncludesTime || false,
          duration: variables.duration || null,
          dueDate: variables.dueDate || null,
          publicUsers: [],
          done: false,
        },
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        const {addProjectTask: projectTask} = data;
        const normalizedProjectId = `Project:${variables.projectId}`;
        const cacheData = cache.readFragment<ProjectFragment>({
          id: normalizedProjectId,
          fragmentName: 'Project',
          fragment: ProjectFragmentDoc,
        });
        if (!cacheData) {
          return;
        }
        const projectTasks = cacheData.tasks;
        const newProjectTasks = [...projectTasks, projectTask];
        cache.writeFragment<ProjectFragment>({
          id: normalizedProjectId,
          fragment: ProjectFragmentDoc,
          fragmentName: 'Project',
          data: {
            ...cacheData,
            tasks: newProjectTasks,
          },
        });
      },
    });
    return result;
  };
  return [func, data];
};
