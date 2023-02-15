import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';
import {
  CreateSubtaskMutation,
  CreateSubtaskMutationVariables,
  EditTaskMutation,
  EditTaskMutationVariables,
  GetAllTasksDocument,
  GetAllTasksQuery,
  TaskFragment,
  TaskFragmentDoc,
  useCreateSubtaskMutation,
  useEditTaskMutation,
} from '../../generated/graphql';

export type EditTaskFunction = (
  variables: EditTaskMutationVariables,
) => Promise<FetchResult<EditTaskMutation>>;

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
    const result = await editTask({
      variables: variables,
      optimisticResponse: {
        __typename: 'Mutation',
        editTask: {
          __typename: 'Task',
          id: variables.id,
          name: variables.name,
          userId: '',
          createdAt: task?.createdAt,
          done: false,
          updatedAt: new Date().toISOString(),
          text: variables.text,
          dueDate: variables.dueDate || null,
          doDate: variables.doDate || null,
          subtasks: task?.subtasks || [],
          subject: task?.subject,
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
      },
    });
    return result;
  };
  return [func, data];
};
