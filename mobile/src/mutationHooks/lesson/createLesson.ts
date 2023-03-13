import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';
import {
  CreateLessonMutation,
  CreateLessonMutationVariables,
  GetAllLessonsDocument,
  GetAllLessonsQuery,
  GetAllLessonTimesDocument,
  GetAllLessonTimesQuery,
  GetAllSubjectsDocument,
  GetAllSubjectsQuery,
  TaskFragment,
  TaskFragmentDoc,
  useCreateLessonMutation,
} from '../../generated/graphql';

export type CreateLessonFunction = (
  variables: CreateLessonMutationVariables,
) => Promise<FetchResult<CreateLessonMutation> | null>;

export const useCreateLesson: () => [
  CreateLessonFunction,
  MutationResult<CreateLessonMutation>,
] = () => {
  const [createLesson, data] = useCreateLessonMutation();
  const client = useApolloClient();
  const func = async (variables: CreateLessonMutationVariables) => {
    const subject = (
      await client.query<GetAllSubjectsQuery>({
        query: GetAllSubjectsDocument,
      })
    ).data.getAllSubjects.find(item => item.id == variables.subjectId);
    const lessonTime = (
      await client.query<GetAllLessonTimesQuery>({
        query: GetAllLessonTimesDocument,
      })
    ).data.getAllLessonTimes.find(item => item.id == variables.lessonTimeId);
    if (subject && lessonTime) {
      const result = await createLesson({
        context: {
          serializationKey: 'MUTATION',
        },
        variables: variables,
        optimisticResponse: {
          __typename: 'Mutation',
          createLesson: {
            __typename: 'Lesson',
            id: variables.id,
            dayNumber: variables.dayNumber,
            lessonTime: lessonTime,
            subject: subject,
          },
        },
        update: (cache, {data}) => {
          if (!data) {
            return;
          }
          const {createLesson: lesson} = data;
          const cacheData = cache.readQuery<GetAllLessonsQuery>({
            query: GetAllLessonsDocument,
          });
          if (!cacheData) {
            return;
          }
          const lessons = cacheData.getAllLessons;
          const newLessons = [...lessons, lesson];
          cache.writeQuery<GetAllLessonsQuery>({
            query: GetAllLessonsDocument,
            data: {
              getAllLessons: newLessons,
            },
          });
        },
      });
    }

    return null;
  };
  return [func, data];
};
