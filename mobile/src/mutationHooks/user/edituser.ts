import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';
import {
  MeDocument,
  MeQuery,
  EditUserMutation,
  EditUserMutationVariables,
  UserFragmentDoc,
  useEditUserMutation,
} from '../../generated/graphql';

export type EditUserFunction = (
  variables: EditUserMutationVariables,
) => Promise<FetchResult<EditUserMutation> | null>;

export const useEditUser: () => [
  EditUserFunction,
  MutationResult<EditUserMutation>,
] = () => {
  const [editUser, data] = useEditUserMutation();
  const client = useApolloClient();
  const func = async (variables: EditUserMutationVariables) => {
    const user = (
      await client.query<MeQuery>({
        query: MeDocument,
      })
    ).data.me;
    if (user) {
      const result = await editUser({
        context: {
          serializationKey: 'MUTATION',
        },
        variables: variables,
        optimisticResponse: {
          __typename: 'Mutation',
          editUser: {
            __typename: 'User',
            ...user,
            email: variables.email || user.email,
            fullName: variables.fullName || user.fullName,
          },
        },
        update: (cache, {data}) => {
          if (!data) {
            return;
          }
          const normalizedUserId = `User:${data.editUser.id}`;
          cache.writeFragment({
            id: normalizedUserId,
            fragment: UserFragmentDoc,
            fragmentName: 'User',
            data: data.editUser,
          });
        },
      });
      return result;
    }
    return null;
  };
  return [func, data];
};
