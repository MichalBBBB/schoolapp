import {
  useCreateScheduleMutation,
  CreateScheduleMutation,
  GetAllSubjectsDocument,
  SubjectFragment,
  GetAllSchedulesDocument,
  GetAllSchedulesQueryResult,
  GetAllSchedulesQuery,
  CreateEventMutation,
  GetAllSubjectsQuery,
} from '../../generated/graphql';
import {CreateScheduleMutationVariables} from '../../generated/graphql';
import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';

export type CreateScheduleFunction = (
  variables: CreateScheduleMutationVariables,
) => Promise<FetchResult<CreateScheduleMutation>>;

export const useCreateSchedule: () => [
  CreateScheduleFunction,
  MutationResult<CreateScheduleMutation>,
] = () => {
  const client = useApolloClient();

  const [createSchedule, data] = useCreateScheduleMutation();

  const func = async (variables: CreateScheduleMutationVariables) => {
    const result = await createSchedule({
      context: {
        serializationKey: 'MUTATION',
      },
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        createSchedule: {
          __typename: 'Schedule',
          id: variables.id,
          name: variables.name,
          default: false,
          dates: [],
          dayNumbers: [],
          lessonTimes: [],
        },
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        const {createSchedule: schedule} = data;
        const cacheData = cache.readQuery<GetAllSchedulesQuery>({
          query: GetAllSchedulesDocument,
        });
        if (!cacheData) {
          return;
        }
        const schedules = cacheData.getAllSchedules;
        const newSchedules = [...schedules, schedule];
        cache.writeQuery<GetAllSchedulesQuery>({
          query: GetAllSchedulesDocument,
          data: {
            getAllSchedules: newSchedules,
          },
        });
      },
    });
    return result;
  };
  return [func, data];
};
