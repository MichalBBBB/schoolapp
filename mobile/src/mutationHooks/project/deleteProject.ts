import {
  useDeleteProjectMutation,
  DeleteProjectMutation,
  GetProjectsDocument,
  GetProjectsQuery,
  ProjectFragmentDoc,
} from '../../generated/graphql';
import {DeleteProjectMutationVariables} from '../../generated/graphql';
import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';

export type DeleteProjectFunction = (
  variables: DeleteProjectMutationVariables,
) => Promise<FetchResult<DeleteProjectMutation>>;

export const useDeleteProject: () => [
  DeleteProjectFunction,
  MutationResult<DeleteProjectMutation>,
] = () => {
  const client = useApolloClient();
  const [deleteProject, data] = useDeleteProjectMutation();

  const func = async (variables: DeleteProjectMutationVariables) => {
    const projects = await client.query<GetProjectsQuery>({
      query: GetProjectsDocument,
    });
    const project = projects.data.getProjects.find(item => {
      return item.id == variables.id;
    });
    const result = await deleteProject({
      context: {
        serializationKey: 'MUTATION',
        skipQueue: true,
      },
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        deleteProject: true,
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        if (data.deleteProject) {
          const normalizedProjectId = `Project:${variables.id}`;
          cache.evict({id: normalizedProjectId});
          cache.gc();
        }
      },
    });
    return result;
  };
  return [func, data];
};
