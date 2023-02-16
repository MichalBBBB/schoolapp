import {
  useCreateLessonTimeMutation,
  CreateLessonTimeMutation,
  GetAllSubjectsDocument,
  SubjectFragment,
  GetAllLessonTimesDocument,
  GetAllLessonTimesQueryResult,
  GetAllLessonTimesQuery,
  CreateEventMutation,
  GetAllSubjectsQuery,
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
    const {data: subjects} = await client.query({
      query: GetAllSubjectsDocument,
    });

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
        },
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        const {createLessonTime: lessonTime} = data;
        const cacheData = cache.readQuery<GetAllLessonTimesQuery>({
          query: GetAllLessonTimesDocument,
        });
        if (!cacheData) {
          return;
        }
        const LessonTimes = cacheData.getAllLessonTimes;
        const newLessonTimes = [...LessonTimes, lessonTime];
        cache.writeQuery<GetAllLessonTimesQuery>({
          query: GetAllLessonTimesDocument,
          data: {
            getAllLessonTimes: newLessonTimes,
          },
        });
      },
    });
    return result;
  };
  return [func, data];
};
