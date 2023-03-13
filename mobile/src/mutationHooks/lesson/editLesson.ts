import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';
import {
  EditLessonMutation,
  EditLessonMutationVariables,
  GetAllLessonsDocument,
  GetAllLessonsQuery,
  GetAllSubjectsDocument,
  GetAllSubjectsQuery,
  LessonFragment,
  LessonFragmentDoc,
  useEditLessonMutation,
} from '../../generated/graphql';

export type EditLessonFunction = (
  variables: EditLessonMutationVariables,
) => Promise<FetchResult<EditLessonMutation> | null>;

export const useEditLesson: () => [
  EditLessonFunction,
  MutationResult<EditLessonMutation>,
] = () => {
  const [editLesson, data] = useEditLessonMutation();
  const client = useApolloClient();
  const func = async (variables: EditLessonMutationVariables) => {
    const subject = (
      await client.query<GetAllSubjectsQuery>({
        query: GetAllSubjectsDocument,
      })
    ).data.getAllSubjects.find(item => item.id == variables.subjectId);
    const lesson = (
      await client.query<GetAllLessonsQuery>({
        query: GetAllLessonsDocument,
      })
    ).data.getAllLessons.find(item => item.id == variables.id);
    if (subject && lesson) {
      const result = await editLesson({
        context: {
          serializationKey: 'MUTATION',
        },
        variables: variables,
        optimisticResponse: {
          __typename: 'Mutation',
          editLesson: {
            __typename: 'Lesson',
            id: variables.id,
            subject: subject,
            lessonTime: lesson.lessonTime,
            dayNumber: lesson.dayNumber,
          },
        },
        update: (cache, {data}) => {
          if (!data) {
            return;
          }
          const normalizedLessonId = `Lesson:${variables.id}`;
          cache.writeFragment({
            id: normalizedLessonId,
            fragment: LessonFragmentDoc,
            fragmentName: 'Lesson',
            data: data.editLesson,
          });
        },
      });
      return result;
    }

    return null;
  };
  return [func, data];
};
