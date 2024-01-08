import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';
import {
  EditProjectMutation,
  EditProjectMutationVariables,
  useEditProjectMutation,
  ProjectFragmentDoc,
  ProjectFragment,
} from '../../generated/graphql';

export type EditProjectFunction = (
  variables: EditProjectMutationVariables,
) => Promise<FetchResult<EditProjectMutation> | null>;

export const useEditProject: () => [
  EditProjectFunction,
  MutationResult<EditProjectMutation>,
] = () => {
  const [editProject, data] = useEditProjectMutation();
  const client = useApolloClient();
  const func = async (variables: EditProjectMutationVariables) => {
    const project = client.readFragment<ProjectFragment>({
      fragment: ProjectFragmentDoc,
      fragmentName: 'Project',
      id: `Project:${variables.id}`,
    });

    if (project) {
      const result = await editProject({
        context: {
          serializationKey: 'MUTATION',
          skipQueue: true,
        },
        variables: variables,
        optimisticResponse: {
          __typename: 'Mutation',
          editProject: {
            ...project,
            name: variables.name,
            text: variables.text,
          },
        },
        update: (cache, {data}) => {
          if (!data) {
            return;
          }
          const normalizedProjectId = `Project:${variables.id}`;
          cache.writeFragment<ProjectFragment>({
            id: normalizedProjectId,
            fragment: ProjectFragmentDoc,
            fragmentName: 'Project',
            data: data.editProject,
          });
        },
      });
      return result;
    }
    return null;
  };
  return [func, data];
};
