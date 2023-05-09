import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';
import {
  EditScheduleMutation,
  EditScheduleMutationVariables,
  GetAllSchedulesDocument,
  GetAllSchedulesQuery,
  ScheduleFragmentDoc,
  useEditScheduleMutation,
} from '../../generated/graphql';

export type EditScheduleFunction = (
  variables: EditScheduleMutationVariables,
) => Promise<FetchResult<EditScheduleMutation> | null>;

export const useEditSchedule: () => [
  EditScheduleFunction,
  MutationResult<EditScheduleMutation>,
] = () => {
  const [editSchedule, data] = useEditScheduleMutation();
  const client = useApolloClient();
  const func = async (variables: EditScheduleMutationVariables) => {
    const Schedules = (
      await client.query({
        query: GetAllSchedulesDocument,
      })
    ).data;
    const schedule = (Schedules as GetAllSchedulesQuery).getAllSchedules.find(
      item => {
        return item.id == variables.id;
      },
    );
    if (schedule) {
      const result = await editSchedule({
        context: {
          serializationKey: 'MUTATION',
        },
        variables: variables,
        optimisticResponse: {
          __typename: 'Mutation',
          editSchedule: {
            ...schedule,
            __typename: 'Schedule',
            id: variables.id,
            name: variables.name,
          },
        },
        update: (cache, {data}) => {
          if (!data) {
            return;
          }
          const normalizedScheduleId = `Schedule:${variables.id}`;
          cache.writeFragment({
            id: normalizedScheduleId,
            fragment: ScheduleFragmentDoc,
            fragmentName: 'Schedule',
            data: data.editSchedule,
          });
        },
      });
      return result;
    }
    return null;
  };
  return [func, data];
};
