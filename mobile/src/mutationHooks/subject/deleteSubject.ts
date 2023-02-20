import {
  useDeleteSubjectMutation,
  DeleteSubjectMutation,
} from '../../generated/graphql';
import {DeleteSubjectMutationVariables} from '../../generated/graphql';
import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';

export type DeleteSubjectFunction = (
  variables: DeleteSubjectMutationVariables,
) => Promise<FetchResult<DeleteSubjectMutation>>;

export const useDeleteSubject: () => [
  DeleteSubjectFunction,
  MutationResult<DeleteSubjectMutation>,
] = () => {
  const [deleteSubject, data] = useDeleteSubjectMutation();

  const func = async (variables: DeleteSubjectMutationVariables) => {
    const result = await deleteSubject({
      context: {
        serializationKey: 'MUTATION',
      },
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        deleteSubject: true,
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        const normalizedSubjectId = `Subject:${variables.id}`;
        cache.evict({id: normalizedSubjectId});
      },
    });
    return result;
  };
  return [func, data];
};
