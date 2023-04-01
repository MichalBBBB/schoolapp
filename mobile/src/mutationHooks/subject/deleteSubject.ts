import {
  useDeleteSubjectMutation,
  DeleteSubjectMutation,
  GetAllLessonsDocument,
  GetAllLessonsQuery,
  GetAllTasksQuery,
  GetAllTasksDocument,
  GetAllEventsQuery,
  GetAllEventsDocument,
} from '../../generated/graphql';
import {DeleteSubjectMutationVariables} from '../../generated/graphql';
import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';

export type DeleteSubjectFunction = (
  variables: DeleteSubjectMutationVariables,
) => Promise<FetchResult<DeleteSubjectMutation>>;

export const useDeleteSubject: () => [
  DeleteSubjectFunction,
  MutationResult<DeleteSubjectMutation>,
] = () => {
  const [deleteSubject, data] = useDeleteSubjectMutation();

  const func = async (variables: DeleteSubjectMutationVariables) => {
    const result = await deleteSubject({
      context: {
        serializationKey: 'MUTATION',
      },
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        deleteSubject: true,
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        const normalizedSubjectId = `Subject:${variables.id}`;
        cache.evict({id: normalizedSubjectId});
        // delete all lessons with this subject
        const lessons = cache.readQuery<GetAllLessonsQuery>({
          query: GetAllLessonsDocument,
        });
        cache.writeQuery<GetAllLessonsQuery>({
          query: GetAllLessonsDocument,
          data: {
            getAllLessons:
              lessons?.getAllLessons.filter(item => {
                return item.subject.id !== variables.id;
              }) || [],
          },
        });

        //set subject of all tasks with this subject to null
        const tasks = cache.readQuery<GetAllTasksQuery>({
          query: GetAllTasksDocument,
        });
        cache.writeQuery<GetAllTasksQuery>({
          query: GetAllTasksDocument,
          data: {
            getAllTasks:
              tasks?.getAllTasks.map(item => {
                if (item.subject?.id == variables.id) {
                  return {
                    ...item,
                    subject: null,
                  };
                } else {
                  return item;
                }
              }) || [],
          },
        });

        //set subject of all events with this subject to null
        const events = cache.readQuery<GetAllEventsQuery>({
          query: GetAllEventsDocument,
        });
        cache.writeQuery<GetAllEventsQuery>({
          query: GetAllEventsDocument,
          data: {
            getAllEvents:
              events?.getAllEvents.map(item => {
                if (item.subject?.id == variables.id) {
                  return {
                    ...item,
                    subject: null,
                  };
                } else {
                  return item;
                }
              }) || [],
          },
        });
        cache.gc();
      },
    });
    return result;
  };
  return [func, data];
};
