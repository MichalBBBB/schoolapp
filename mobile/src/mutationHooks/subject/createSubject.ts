import {FetchResult, MutationResult} from '@apollo/client';
import {
  CreateSubjectMutation,
  CreateSubjectMutationVariables,
  GetAllSubjectsDocument,
  GetAllSubjectsQuery,
  TaskFragment,
  TaskFragmentDoc,
  useCreateSubjectMutation,
} from '../../generated/graphql';

export type CreateSubjectFunction = (
  variables: CreateSubjectMutationVariables,
) => Promise<FetchResult<CreateSubjectMutation>>;

export const useCreateSubject: () => [
  CreateSubjectFunction,
  MutationResult<CreateSubjectMutation>,
] = () => {
  const [createSubject, data] = useCreateSubjectMutation();
  const func = async (variables: CreateSubjectMutationVariables) => {
    const result = await createSubject({
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        createSubject: {
          __typename: 'Subject',
          name: variables.name,
          id: variables.id,
        },
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        const {createSubject: subject} = data;
        const cacheData = cache.readQuery<GetAllSubjectsQuery>({
          query: GetAllSubjectsDocument,
        });
        if (!cacheData) {
          return;
        }
        const subjects = cacheData.getAllSubjects;
        const newSubjects = [...subjects, subject];
        cache.writeQuery<GetAllSubjectsQuery>({
          query: GetAllSubjectsDocument,
          data: {
            getAllSubjects: newSubjects,
          },
        });
      },
    });
    return result;
  };
  return [func, data];
};
