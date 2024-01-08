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
  useMeQuery,
  MeDocument,
  MeQuery,
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
    const {data: me} = await client.query<MeQuery>({
      query: MeDocument,
    });
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
          members: [
            {
              __typename: 'PublicUser',
              name: me.me.fullName,
              email: me.me.email,
              userId: me.me.id,
              id: `${variables.id}:${me.me.id}`,
              isAdmin: true,
            },
          ],
          tasks: [],
          text: '',
          isAdmin: true,
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
