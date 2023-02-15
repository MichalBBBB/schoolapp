import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';
import {
  EditLessonTimesMutation,
  EditLessonTimesMutationVariables,
  GetAllLessonTimesDocument,
  GetAllLessonTimesQuery,
  LessonTimeFragment,
  LessonTimeFragmentDoc,
  useEditLessonTimesMutation,
  LessonTimeInput,
} from '../../generated/graphql';

export type EditLessonTimesFunction = (
  variables: EditLessonTimesMutationVariables,
) => Promise<FetchResult<EditLessonTimesMutation>>;

export const useEditLessonTimes: () => [
  EditLessonTimesFunction,
  MutationResult<EditLessonTimesMutation>,
] = () => {
  const [editLessonTimes, data] = useEditLessonTimesMutation();
  const client = useApolloClient();
  const func = async (variables: EditLessonTimesMutationVariables) => {
    const lessonTimes = (
      await client.query({
        query: GetAllLessonTimesDocument,
      })
    ).data as GetAllLessonTimesQuery;
    // get the LessonTimes that are edited
    var lessonTimesArray =
      'map' in variables.lessonTimes
        ? (variables.lessonTimes as LessonTimeInput[])
        : [variables.lessonTimes as LessonTimeInput];

    const result = await editLessonTimes({
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        editLessonTimes: lessonTimesArray.map(item => {
          return {
            __typename: 'LessonTime',
            id: item.id,
            startTime: item.startTime,
            endTime: item.endTime,
          };
        }),
      },
    });
    return result;
  };
  return [func, data];
};
