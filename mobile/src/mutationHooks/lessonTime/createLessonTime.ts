import {
  useCreateLessonTimeMutation,
  CreateLessonTimeMutation,
  GetAllSubjectsDocument,
  ScheduleFragment,
  ScheduleFragmentDoc,
} from '../../generated/graphql';
import {CreateLessonTimeMutationVariables} from '../../generated/graphql';
import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';

export type CreateLessonTimeFunction = (
  variables: CreateLessonTimeMutationVariables,
) => Promise<FetchResult<CreateLessonTimeMutation>>;

export const useCreateLessonTime: () => [
  CreateLessonTimeFunction,
  MutationResult<CreateLessonTimeMutation>,
] = () => {
  const client = useApolloClient();

  const [createLessonTime, data] = useCreateLessonTimeMutation();

  const func = async (variables: CreateLessonTimeMutationVariables) => {
    const result = await createLessonTime({
      context: {
        serializationKey: 'MUTATION',
      },
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        createLessonTime: {
          __typename: 'LessonTime',
          id: variables.id,
          startTime: variables.startTime,
          endTime: variables.endTime,
          scheduleId: variables.scheduleId,
        },
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        const {createLessonTime: lessonTime} = data;
        const cacheData = cache.readFragment<ScheduleFragment>({
          fragment: ScheduleFragmentDoc,
          fragmentName: 'Schedule',
          id: `Schedule:${variables.scheduleId}`,
        });
        if (!cacheData) {
          return;
        }
        const lessonTimes = cacheData.lessonTimes;
        const newLessonTimes = [...lessonTimes, lessonTime];
        cache.writeFragment<ScheduleFragment>({
          fragment: ScheduleFragmentDoc,
          fragmentName: 'Schedule',
          data: {
            ...cacheData,
            lessonTimes: newLessonTimes,
          },
        });
      },
    });
    return result;
  };
  return [func, data];
};
