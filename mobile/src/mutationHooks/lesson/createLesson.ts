import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';
import {
  CreateLessonMutation,
  CreateLessonMutationVariables,
  GetAllLessonsDocument,
  GetAllLessonsQuery,
  GetAllSubjectsDocument,
  GetAllSubjectsQuery,
  LessonTime,
  LessonTimeFragmentDoc,
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
    const lessonTime = client.readFragment<LessonTime>({
      fragment: LessonTimeFragmentDoc,
      fragmentName: 'LessonTime',
      id: `LessonTime:${variables.lessonTimeId}`,
    });
    if (subject && lessonTime) {
      await createLesson({
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
            extraInfo: null,
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
