import {
  useDeleteEventMutation,
  DeleteEventMutation,
  GetAllEventsDocument,
  GetAllEventsQuery,
} from '../../generated/graphql';
import {DeleteEventMutationVariables} from '../../generated/graphql';
import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';

export type DeleteEventFunction = (
  variables: DeleteEventMutationVariables,
) => Promise<FetchResult<DeleteEventMutation>>;

export const useDeleteEvent: () => [
  DeleteEventFunction,
  MutationResult<DeleteEventMutation>,
] = () => {
  const client = useApolloClient();
  const [deleteEvent, data] = useDeleteEventMutation();

  const func = async (variables: DeleteEventMutationVariables) => {
    const result = await deleteEvent({
      context: {
        serializationKey: 'MUTATION',
      },
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        deleteEvent: true,
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        const normalizedEventId = `CalendarEvent:${variables.id}`;
        cache.evict({id: normalizedEventId});
      },
    });
    return result;
  };
  return [func, data];
};
