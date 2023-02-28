import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';
import {
  EditSubjectMutation,
  EditSubjectMutationVariables,
  GetAllSubjectsDocument,
  GetAllSubjectsQuery,
  SubjectFragmentDoc,
  useEditSubjectMutation,
} from '../../generated/graphql';

export type EditSubjectFunction = (
  variables: EditSubjectMutationVariables,
) => Promise<FetchResult<EditSubjectMutation> | null>;

export const useEditSubject: () => [
  EditSubjectFunction,
  MutationResult<EditSubjectMutation>,
] = () => {
  const [editSubject, data] = useEditSubjectMutation();
  const client = useApolloClient();
  const func = async (variables: EditSubjectMutationVariables) => {
    const subjects = (
      await client.query({
        query: GetAllSubjectsDocument,
      })
    ).data;
    const subject = (subjects as GetAllSubjectsQuery).getAllSubjects.find(
      item => {
        return item.id == variables.id;
      },
    );
    if (subject) {
      const result = await editSubject({
        context: {
          serializationKey: 'MUTATION',
        },
        variables: variables,
        optimisticResponse: {
          __typename: 'Mutation',
          editSubject: {
            __typename: 'Subject',
            id: variables.id,
            name: variables.name,
            colorName: variables.colorName,
          },
        },
        update: (cache, {data}) => {
          if (!data) {
            return;
          }
          const normalizedSubjectId = `Subject:${variables.id}`;
          cache.writeFragment({
            id: normalizedSubjectId,
            fragment: SubjectFragmentDoc,
            fragmentName: 'Subject',
            data: data.editSubject,
          });
        },
      });
      return result;
    }
    return null;
  };
  return [func, data];
};
