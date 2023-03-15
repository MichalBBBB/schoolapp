import {
  useEditEventMutation,
  EditEventMutation,
  GetAllSubjectsDocument,
  GetAllEventsDocument,
  GetAllEventsQuery,
  GetAllSubjectsQuery,
  RemindersInput,
  CalendarEventFragment,
  CalendarEventFragmentDoc,
  GetAllRemindersDocument,
  GetAllRemindersQuery,
} from '../../generated/graphql';
import {EditEventMutationVariables} from '../../generated/graphql';
import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';

export type EditEventFunction = (
  variables: EditEventMutationVariables,
) => Promise<FetchResult<EditEventMutation> | null>;

export const useEditEvent: () => [
  EditEventFunction,
  MutationResult<EditEventMutation>,
] = () => {
  const client = useApolloClient();

  const [EditEvent, data] = useEditEventMutation();

  const func = async (variables: EditEventMutationVariables) => {
    const events = await client.query<GetAllEventsQuery>({
      query: GetAllEventsDocument,
    });
    const calendarEvent = events.data.getAllEvents.find(
      item => item.id == variables.id,
    );
    if (calendarEvent) {
      const {data: subjects} = await client.query({
        query: GetAllSubjectsDocument,
      });

      const subject = (subjects as GetAllSubjectsQuery).getAllSubjects?.find(
        item => {
          return item.id == variables.subjectId;
        },
      );

      var remindersArray: RemindersInput[] = [];
      if (variables.reminders) {
        remindersArray =
          'map' in variables.reminders
            ? (variables.reminders as RemindersInput[])
            : [variables.reminders as RemindersInput];
      }

      const result = await EditEvent({
        context: {
          serializationKey: 'MUTATION',
        },
        variables: variables,
        optimisticResponse: {
          __typename: 'Mutation',
          editEvent: {
            __typename: 'CalendarEvent',
            id: variables.id,
            name: variables.name,
            startDate: variables.startDate,
            endDate: variables.endDate,
            wholeDay: variables.wholeDay || false,
            subject: subject || null,
            text: variables.text || null,
            reminders: remindersArray.map(item => {
              return {
                __typename: 'Reminder',
                minutesBefore: item.minutesBefore,
                id: item.id,
                title: item.title,
                body: item.body || null,
                date: item.date,
                eventId: calendarEvent.id,
              };
            }),
          },
        },
        update: (cache, {data}) => {
          if (!data) {
            return;
          }
          const normalizedEventId = `CalendarEvent:${variables.id}`;
          cache.writeFragment<CalendarEventFragment>({
            fragment: CalendarEventFragmentDoc,
            data: data.editEvent,
            fragmentName: 'CalendarEvent',
            id: normalizedEventId,
          });

          const cacheData = cache.readQuery<GetAllRemindersQuery>({
            query: GetAllRemindersDocument,
          });
          if (!cacheData) {
            return;
          }
          const existingReminders = cacheData.getAllReminders;
          const unrelatedReminders = existingReminders.filter(item => {
            return item.eventId !== data.editEvent.id;
          });
          const newReminders = [
            ...unrelatedReminders,
            ...data.editEvent.reminders,
          ];
          cache.writeQuery<GetAllRemindersQuery>({
            query: GetAllRemindersDocument,
            data: {
              getAllReminders: newReminders,
            },
          });
        },
      });
      return result;
    } else {
      return null;
    }
  };
  return [func, data];
};
