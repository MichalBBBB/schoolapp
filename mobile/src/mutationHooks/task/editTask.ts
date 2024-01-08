import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';
import {
  EditTaskMutation,
  EditTaskMutationVariables,
  GetAllRemindersDocument,
  GetAllRemindersQuery,
  GetAllTasksDocument,
  GetAllTasksQuery,
  RemindersInput,
  SubjectFragment,
  SubjectFragmentDoc,
  TaskFragmentDoc,
  useEditTaskMutation,
} from '../../generated/graphql';

export type EditTaskFunction = (
  variables: EditTaskMutationVariables,
) => Promise<FetchResult<EditTaskMutation> | null>;

export const useEditTask: () => [
  EditTaskFunction,
  MutationResult<EditTaskMutation>,
] = () => {
  const [editTask, data] = useEditTaskMutation();
  const client = useApolloClient();
  const func = async (variables: EditTaskMutationVariables) => {
    const tasks = (
      await client.query({
        query: GetAllTasksDocument,
      })
    ).data;
    const task = (tasks as GetAllTasksQuery).getAllTasks.find(item => {
      return item.id == variables.id;
    });
    if (task) {
      const subject = client.readFragment<SubjectFragment>({
        id: `Subject:${variables.subjectId}`,
        fragment: SubjectFragmentDoc,
      });
      var remindersArray: RemindersInput[] = [];
      if (variables.reminders) {
        remindersArray =
          'map' in variables.reminders
            ? (variables.reminders as RemindersInput[])
            : [variables.reminders as RemindersInput];
      }

      const result = await editTask({
        context: {
          serializationKey: 'MUTATION',
        },
        variables: variables,
        optimisticResponse: {
          __typename: 'Mutation',
          editTask: {
            __typename: 'Task',
            id: variables.id,
            name: variables.name,
            createdAt: task.createdAt,
            done: task.done,
            updatedAt: new Date().toISOString(),
            text: variables.text,
            dueDate: variables.dueDate || null,
            dueDateIncludesTime: variables.dueDateIncludesTime || false,
            doDate: variables.doDate || null,
            duration: variables.duration || null,
            doDateIncludesTime: variables.doDateIncludesTime || false,
            subtasks: task.subtasks,
            subject: subject,
            reminders: remindersArray.map(item => {
              return {
                __typename: 'Reminder',
                minutesBefore: item.minutesBefore,
                id: item.id,
                title: item.title,
                body: item.body || null,
                date: item.date,
                taskId: task.id,
                eventId: null,
              };
            }),
          },
        },
        update: (cache, {data}) => {
          if (!data) {
            return;
          }
          const normalizedTaskId = `Task:${variables.id}`;
          cache.writeFragment({
            id: normalizedTaskId,
            fragment: TaskFragmentDoc,
            fragmentName: 'Task',
            data: data.editTask,
          });
          const cacheData = cache.readQuery<GetAllRemindersQuery>({
            query: GetAllRemindersDocument,
          });
          if (!cacheData) {
            return;
          }
          const existingReminders = cacheData.getAllReminders;
          const unrelatedReminders = existingReminders.filter(item => {
            return item.taskId !== data.editTask.id;
          });
          const newReminders = [
            ...unrelatedReminders,
            ...data.editTask.reminders,
          ];
          cache.writeQuery<GetAllRemindersQuery>({
            query: GetAllRemindersDocument,
            data: {
              getAllReminders: newReminders,
            },
          });
        },
      });
      return result;
    }
    return null;
  };
  return [func, data];
};
