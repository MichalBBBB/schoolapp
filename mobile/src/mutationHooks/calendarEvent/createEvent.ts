import {
  useCreateEventMutation,
  CreateEventMutation,
  GetAllSubjectsDocument,
  GetAllEventsDocument,
  GetAllEventsQuery,
  GetAllSubjectsQuery,
} from '../../generated/graphql';
import {CreateEventMutationVariables} from '../../generated/graphql';
import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';

export type CreateEventFunction = (
  variables: CreateEventMutationVariables,
) => Promise<FetchResult<CreateEventMutation>>;

export const useCreateEvent: () => [
  CreateEventFunction,
  MutationResult<CreateEventMutation>,
] = () => {
  const client = useApolloClient();

  const [createEvent, data] = useCreateEventMutation();

  const func = async (variables: CreateEventMutationVariables) => {
    const {data: subjects} = await client.query({
      query: GetAllSubjectsDocument,
    });

    const subject = (subjects as GetAllSubjectsQuery).getAllSubjects?.find(
      item => {
        return item.id == variables.subjectId;
      },
    );

    const result = await createEvent({
      context: {
        serializationKey: 'MUTATION',
      },
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        createEvent: {
          __typename: 'CalendarEvent',
          id: variables.id,
          name: variables.name,
          startDate: variables.startDate,
          endDate: variables.endDate,
          wholeDay: variables.wholeDay || false,
          subject: subject || null,
        },
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        const {createEvent: calendarEvent} = data;
        const cacheData = cache.readQuery<GetAllEventsQuery>({
          query: GetAllEventsDocument,
        });
        if (!cacheData) {
          return;
        }
        const calendarEvents = cacheData.getAllEvents;
        const newEvents = [...calendarEvents, calendarEvent];
        cache.writeQuery<GetAllEventsQuery>({
          query: GetAllEventsDocument,
          data: {
            getAllEvents: newEvents,
          },
        });
      },
    });
    return result;
  };
  return [func, data];
};
