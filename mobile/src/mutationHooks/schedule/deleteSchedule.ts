import {
  useDeleteScheduleMutation,
  DeleteScheduleMutation,
  GetAllSchedulesDocument,
  GetAllSchedulesQuery,
  ScheduleFragmentDoc,
  GetAllLessonsQuery,
  GetAllLessonsDocument,
} from '../../generated/graphql';
import {DeleteScheduleMutationVariables} from '../../generated/graphql';
import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';

export type DeleteScheduleFunction = (
  variables: DeleteScheduleMutationVariables,
) => Promise<FetchResult<DeleteScheduleMutation>>;

export const useDeleteSchedule: () => [
  DeleteScheduleFunction,
  MutationResult<DeleteScheduleMutation>,
] = () => {
  const client = useApolloClient();
  const [deleteSchedule, data] = useDeleteScheduleMutation();

  const func = async (variables: DeleteScheduleMutationVariables) => {
    const schedules = await client.query<GetAllSchedulesQuery>({
      query: GetAllSchedulesDocument,
    });
    const schedule = schedules.data.getAllSchedules.find(item => {
      return item.id == variables.id;
    });
    const result = await deleteSchedule({
      context: {
        serializationKey: 'MUTATION',
      },
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        deleteSchedule: true,
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        if (data.deleteSchedule) {
          const normalizedScheduleId = `Schedule:${variables.id}`;
          cache.evict({id: normalizedScheduleId});

          const lessons = cache.readQuery<GetAllLessonsQuery>({
            query: GetAllLessonsDocument,
          });
          cache.writeQuery<GetAllLessonsQuery>({
            query: GetAllLessonsDocument,
            data: {
              getAllLessons:
                lessons?.getAllLessons.filter(item => {
                  return !schedule?.lessonTimes
                    .map(item => item.id)
                    .includes(item.lessonTime.id);
                }) || [],
            },
          });
          cache.gc();
        }
      },
    });
    return result;
  };
  return [func, data];
};
