import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';
import {
  EditLessonTimesMutation,
  EditLessonTimesMutationVariables,
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
    var lessonTimesArray =
      'map' in variables.lessonTimes
        ? (variables.lessonTimes as LessonTimeInput[])
        : [variables.lessonTimes as LessonTimeInput];

    const result = await editLessonTimes({
      context: {
        serializationKey: 'MUTATION',
      },
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        editLessonTimes: lessonTimesArray.map(item => {
          const lessonTime = client.readFragment<LessonTimeFragment>({
            fragment: LessonTimeFragmentDoc,
            fragmentName: 'LessonTime',
            id: `LessonTime:${item.id}`,
          });
          return {
            __typename: 'LessonTime',
            id: item.id,
            startTime: item.startTime,
            endTime: item.endTime,
            scheduleId: lessonTime?.scheduleId,
          };
        }),
      },
    });
    return result;
  };
  return [func, data];
};
