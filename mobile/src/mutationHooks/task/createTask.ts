import {
  useCreateTaskMutation,
  CreateTaskMutation,
  GetAllSubjectsDocument,
  SubjectFragment,
  GetAllTasksDocument,
  GetAllTasksQueryResult,
  GetAllTasksQuery,
  CreateEventMutation,
  GetAllSubjectsQuery,
} from '../../generated/graphql';
import {CreateTaskMutationVariables} from '../../generated/graphql';
import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';

export type CreateTaskFunction = (
  variables: CreateTaskMutationVariables,
) => Promise<FetchResult<CreateTaskMutation>>;

export const useCreateTask: () => [
  CreateTaskFunction,
  MutationResult<CreateTaskMutation>,
] = () => {
  const client = useApolloClient();

  const [createTask, data] = useCreateTaskMutation();

  const func = async (variables: CreateTaskMutationVariables) => {
    const {data: subjects} = await client.query({
      query: GetAllSubjectsDocument,
    });

    const subject = (subjects as GetAllSubjectsQuery).getAllSubjects?.find(
      item => {
        return item.id == variables.subjectId;
      },
    );

    const result = await createTask({
      context: {
        serializationKey: 'MUTATION',
      },
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        createTask: {
          __typename: 'Task',
          id: variables.id,
          name: variables.name,
          userId: '',
          createdAt: new Date().toISOString(),
          done: false,
          updatedAt: new Date().toISOString(),
          text: '',
          dueDate: variables.dueDate || null,
          doDate: variables.doDate || null,
          subtasks: [],
          subject: subject || null,
          reminders: [],
        },
      },
      update: (cache, {data}) => {
        if (!data) {
          return;
        }
        const {createTask: task} = data;
        const cacheData = cache.readQuery<GetAllTasksQuery>({
          query: GetAllTasksDocument,
        });
        if (!cacheData) {
          return;
        }
        const tasks = cacheData.getAllTasks;
        const newTasks = [...tasks, task];
        cache.writeQuery<GetAllTasksQuery>({
          query: GetAllTasksDocument,
          data: {
            getAllTasks: newTasks,
          },
        });
      },
    });
    return result;
  };
  return [func, data];
};
