import {
  useCreateProjectMutation,
  CreateProjectMutation,
  GetAllSubjectsDocument,
  SubjectFragment,
  GetProjectsDocument,
  GetProjectsQueryResult,
  GetProjectsQuery,
  CreateEventMutation,
  GetAllSubjectsQuery,
} from '../../generated/graphql';
import {CreateProjectMutationVariables} from '../../generated/graphql';
import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';

export type CreateProjectFunction = (
  variables: CreateProjectMutationVariables,
) => Promise<FetchResult<CreateProjectMutation>>;

export const useCreateProject: () => [
  CreateProjectFunction,
  MutationResult<CreateProjectMutation>,
] = () => {
  const client = useApolloClient();

  const [createProject, data] = useCreateProjectMutation();

  const func = async (variables: CreateProjectMutationVariables) => {
    const result = await createProject({
      context: {
        serializationKey: 'MUTATION',
        skipQueue: true,
      },
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        createProject: {
          __typename: 'Project',
          id: variables.id,
          name: variables.name,
          members: [],
          tasks: [],
          text: '',
        },
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        const {createProject: Project} = data;
        const cacheData = cache.readQuery<GetProjectsQuery>({
          query: GetProjectsDocument,
        });
        if (!cacheData) {
          return;
        }
        const Projects = cacheData.getProjects;
        const newProjects = [...Projects, Project];
        cache.writeQuery<GetProjectsQuery>({
          query: GetProjectsDocument,
          data: {
            getProjects: newProjects,
          },
        });
      },
    });
    return result;
  };
  return [func, data];
};
