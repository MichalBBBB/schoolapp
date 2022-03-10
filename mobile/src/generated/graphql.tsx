import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type LoginResponse = UserFail | UserSucces;

export type Mutation = {
  __typename?: 'Mutation';
  changeSubjectOfTask: Task;
  createSubject: Subject;
  createSubtask: Subtask;
  createTask: Task;
  deleteSubtask: Scalars['Boolean'];
  deleteTask: Scalars['Boolean'];
  editTask: Task;
  login: LoginResponse;
  register: RegisterResponse;
  toggleSubtask: Subtask;
  toggleTask: Task;
};


export type MutationChangeSubjectOfTaskArgs = {
  subjectId: Scalars['String'];
  taskId: Scalars['String'];
};


export type MutationCreateSubjectArgs = {
  name: Scalars['String'];
};


export type MutationCreateSubtaskArgs = {
  name: Scalars['String'];
  taskId: Scalars['String'];
};


export type MutationCreateTaskArgs = {
  name: Scalars['String'];
  subjectId?: InputMaybe<Scalars['String']>;
};


export type MutationDeleteSubtaskArgs = {
  id: Scalars['String'];
};


export type MutationDeleteTaskArgs = {
  id: Scalars['String'];
};


export type MutationEditTaskArgs = {
  id: Scalars['String'];
  name: Scalars['String'];
  text?: InputMaybe<Scalars['String']>;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};


export type MutationToggleSubtaskArgs = {
  id: Scalars['String'];
};


export type MutationToggleTaskArgs = {
  id: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getAllSubjects: Array<Subject>;
  getAllSubtasksOfTask: Array<Subtask>;
  getAllTasks: Array<Task>;
  getTasksOfUser: Array<Task>;
  hello: Scalars['String'];
  me: User;
  userExists: Scalars['Boolean'];
};


export type QueryGetAllSubtasksOfTaskArgs = {
  id: Scalars['String'];
};


export type QueryUserExistsArgs = {
  email: Scalars['String'];
};

export type RegisterResponse = UserFail | UserSucces;

export type Subject = {
  __typename?: 'Subject';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type Subtask = {
  __typename?: 'Subtask';
  createdAt: Scalars['DateTime'];
  done: Scalars['Boolean'];
  id: Scalars['String'];
  name: Scalars['String'];
  taskId: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type Task = {
  __typename?: 'Task';
  createdAt: Scalars['DateTime'];
  done: Scalars['Boolean'];
  dueDate?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  name: Scalars['String'];
  subject?: Maybe<Subject>;
  subjectId?: Maybe<Scalars['String']>;
  subtasks: Array<Subtask>;
  text?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  user: User;
  userId: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  fullName: Scalars['String'];
  googleId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  imageURL?: Maybe<Scalars['String']>;
  subjects: Array<Subject>;
  tasks: Array<Task>;
  updatedAt: Scalars['DateTime'];
};

export type UserError = {
  __typename?: 'UserError';
  field?: Maybe<Scalars['String']>;
  message: Scalars['String'];
};

export type UserFail = {
  __typename?: 'UserFail';
  errors: Array<UserError>;
};

export type UserSucces = {
  __typename?: 'UserSucces';
  accesToken: Scalars['String'];
  user: User;
};

export type SubjectFragment = { __typename?: 'Subject', id: string, name: string };

export type SubtaskFragment = { __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean };

export type TaskFragment = { __typename?: 'Task', id: string, name: string, userId: string, createdAt: any, done: boolean, updatedAt: any, text?: string | null | undefined, dueDate?: any | null | undefined, subtasks: Array<{ __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean }>, subject?: { __typename?: 'Subject', id: string, name: string } | null | undefined };

export type CreateSubjectMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateSubjectMutation = { __typename?: 'Mutation', createSubject: { __typename?: 'Subject', id: string, name: string } };

export type CreateSubtaskMutationVariables = Exact<{
  taskId: Scalars['String'];
  name: Scalars['String'];
}>;


export type CreateSubtaskMutation = { __typename?: 'Mutation', createSubtask: { __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean } };

export type CreateTaskMutationVariables = Exact<{
  name: Scalars['String'];
  subjectId?: InputMaybe<Scalars['String']>;
}>;


export type CreateTaskMutation = { __typename?: 'Mutation', createTask: { __typename?: 'Task', name: string, id: string } };

export type DeleteSubtaskMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteSubtaskMutation = { __typename?: 'Mutation', deleteSubtask: boolean };

export type DeleteTaskMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteTaskMutation = { __typename?: 'Mutation', deleteTask: boolean };

export type EditTaskMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
  text?: InputMaybe<Scalars['String']>;
}>;


export type EditTaskMutation = { __typename?: 'Mutation', editTask: { __typename?: 'Task', id: string, name: string, userId: string, createdAt: any, done: boolean, updatedAt: any, text?: string | null | undefined, dueDate?: any | null | undefined, subtasks: Array<{ __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean }>, subject?: { __typename?: 'Subject', id: string, name: string } | null | undefined } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserFail', errors: Array<{ __typename?: 'UserError', field?: string | null | undefined, message: string }> } | { __typename?: 'UserSucces', accesToken: string, user: { __typename?: 'User', id: string, email: string, fullName: string } } };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserFail', errors: Array<{ __typename?: 'UserError', field?: string | null | undefined, message: string }> } | { __typename?: 'UserSucces', accesToken: string, user: { __typename?: 'User', id: string, email: string, fullName: string } } };

export type ToggleSubtaskMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type ToggleSubtaskMutation = { __typename?: 'Mutation', toggleSubtask: { __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean } };

export type ToggleTaskMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type ToggleTaskMutation = { __typename?: 'Mutation', toggleTask: { __typename?: 'Task', id: string, name: string, userId: string, createdAt: any, done: boolean, updatedAt: any, text?: string | null | undefined, dueDate?: any | null | undefined, subtasks: Array<{ __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean }>, subject?: { __typename?: 'Subject', id: string, name: string } | null | undefined } };

export type GetAllSubjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSubjectsQuery = { __typename?: 'Query', getAllSubjects: Array<{ __typename?: 'Subject', id: string, name: string }> };

export type GetAllTasksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTasksQuery = { __typename?: 'Query', getAllTasks: Array<{ __typename?: 'Task', id: string, name: string, userId: string, createdAt: any, done: boolean, updatedAt: any, text?: string | null | undefined, dueDate?: any | null | undefined, subtasks: Array<{ __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean }>, subject?: { __typename?: 'Subject', id: string, name: string } | null | undefined }> };

export type HelloQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQuery = { __typename?: 'Query', hello: string };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, email: string, fullName: string, createdAt: any, updatedAt: any, tasks: Array<{ __typename?: 'Task', id: string, name: string, subject?: { __typename?: 'Subject', id: string, name: string } | null | undefined, subtasks: Array<{ __typename?: 'Subtask', id: string, name: string }> }>, subjects: Array<{ __typename?: 'Subject', id: string, name: string }> } };

export type UserExistsQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type UserExistsQuery = { __typename?: 'Query', userExists: boolean };

export const SubtaskFragmentDoc = gql`
    fragment Subtask on Subtask {
  name
  id
  taskId
  done
}
    `;
export const SubjectFragmentDoc = gql`
    fragment Subject on Subject {
  id
  name
}
    `;
export const TaskFragmentDoc = gql`
    fragment Task on Task {
  id
  name
  userId
  createdAt
  subtasks {
    ...Subtask
  }
  done
  updatedAt
  subject {
    ...Subject
  }
  text
  dueDate
}
    ${SubtaskFragmentDoc}
${SubjectFragmentDoc}`;
export const CreateSubjectDocument = gql`
    mutation CreateSubject($name: String!) {
  createSubject(name: $name) {
    ...Subject
  }
}
    ${SubjectFragmentDoc}`;
export type CreateSubjectMutationFn = Apollo.MutationFunction<CreateSubjectMutation, CreateSubjectMutationVariables>;

/**
 * __useCreateSubjectMutation__
 *
 * To run a mutation, you first call `useCreateSubjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSubjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSubjectMutation, { data, loading, error }] = useCreateSubjectMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateSubjectMutation(baseOptions?: Apollo.MutationHookOptions<CreateSubjectMutation, CreateSubjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSubjectMutation, CreateSubjectMutationVariables>(CreateSubjectDocument, options);
      }
export type CreateSubjectMutationHookResult = ReturnType<typeof useCreateSubjectMutation>;
export type CreateSubjectMutationResult = Apollo.MutationResult<CreateSubjectMutation>;
export type CreateSubjectMutationOptions = Apollo.BaseMutationOptions<CreateSubjectMutation, CreateSubjectMutationVariables>;
export const CreateSubtaskDocument = gql`
    mutation CreateSubtask($taskId: String!, $name: String!) {
  createSubtask(taskId: $taskId, name: $name) {
    ...Subtask
  }
}
    ${SubtaskFragmentDoc}`;
export type CreateSubtaskMutationFn = Apollo.MutationFunction<CreateSubtaskMutation, CreateSubtaskMutationVariables>;

/**
 * __useCreateSubtaskMutation__
 *
 * To run a mutation, you first call `useCreateSubtaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSubtaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSubtaskMutation, { data, loading, error }] = useCreateSubtaskMutation({
 *   variables: {
 *      taskId: // value for 'taskId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateSubtaskMutation(baseOptions?: Apollo.MutationHookOptions<CreateSubtaskMutation, CreateSubtaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSubtaskMutation, CreateSubtaskMutationVariables>(CreateSubtaskDocument, options);
      }
export type CreateSubtaskMutationHookResult = ReturnType<typeof useCreateSubtaskMutation>;
export type CreateSubtaskMutationResult = Apollo.MutationResult<CreateSubtaskMutation>;
export type CreateSubtaskMutationOptions = Apollo.BaseMutationOptions<CreateSubtaskMutation, CreateSubtaskMutationVariables>;
export const CreateTaskDocument = gql`
    mutation CreateTask($name: String!, $subjectId: String) {
  createTask(name: $name, subjectId: $subjectId) {
    name
    id
  }
}
    `;
export type CreateTaskMutationFn = Apollo.MutationFunction<CreateTaskMutation, CreateTaskMutationVariables>;

/**
 * __useCreateTaskMutation__
 *
 * To run a mutation, you first call `useCreateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTaskMutation, { data, loading, error }] = useCreateTaskMutation({
 *   variables: {
 *      name: // value for 'name'
 *      subjectId: // value for 'subjectId'
 *   },
 * });
 */
export function useCreateTaskMutation(baseOptions?: Apollo.MutationHookOptions<CreateTaskMutation, CreateTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTaskMutation, CreateTaskMutationVariables>(CreateTaskDocument, options);
      }
export type CreateTaskMutationHookResult = ReturnType<typeof useCreateTaskMutation>;
export type CreateTaskMutationResult = Apollo.MutationResult<CreateTaskMutation>;
export type CreateTaskMutationOptions = Apollo.BaseMutationOptions<CreateTaskMutation, CreateTaskMutationVariables>;
export const DeleteSubtaskDocument = gql`
    mutation DeleteSubtask($id: String!) {
  deleteSubtask(id: $id)
}
    `;
export type DeleteSubtaskMutationFn = Apollo.MutationFunction<DeleteSubtaskMutation, DeleteSubtaskMutationVariables>;

/**
 * __useDeleteSubtaskMutation__
 *
 * To run a mutation, you first call `useDeleteSubtaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSubtaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSubtaskMutation, { data, loading, error }] = useDeleteSubtaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSubtaskMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSubtaskMutation, DeleteSubtaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSubtaskMutation, DeleteSubtaskMutationVariables>(DeleteSubtaskDocument, options);
      }
export type DeleteSubtaskMutationHookResult = ReturnType<typeof useDeleteSubtaskMutation>;
export type DeleteSubtaskMutationResult = Apollo.MutationResult<DeleteSubtaskMutation>;
export type DeleteSubtaskMutationOptions = Apollo.BaseMutationOptions<DeleteSubtaskMutation, DeleteSubtaskMutationVariables>;
export const DeleteTaskDocument = gql`
    mutation DeleteTask($id: String!) {
  deleteTask(id: $id)
}
    `;
export type DeleteTaskMutationFn = Apollo.MutationFunction<DeleteTaskMutation, DeleteTaskMutationVariables>;

/**
 * __useDeleteTaskMutation__
 *
 * To run a mutation, you first call `useDeleteTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTaskMutation, { data, loading, error }] = useDeleteTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTaskMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTaskMutation, DeleteTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTaskMutation, DeleteTaskMutationVariables>(DeleteTaskDocument, options);
      }
export type DeleteTaskMutationHookResult = ReturnType<typeof useDeleteTaskMutation>;
export type DeleteTaskMutationResult = Apollo.MutationResult<DeleteTaskMutation>;
export type DeleteTaskMutationOptions = Apollo.BaseMutationOptions<DeleteTaskMutation, DeleteTaskMutationVariables>;
export const EditTaskDocument = gql`
    mutation EditTask($id: String!, $name: String!, $text: String) {
  editTask(id: $id, name: $name, text: $text) {
    ...Task
  }
}
    ${TaskFragmentDoc}`;
export type EditTaskMutationFn = Apollo.MutationFunction<EditTaskMutation, EditTaskMutationVariables>;

/**
 * __useEditTaskMutation__
 *
 * To run a mutation, you first call `useEditTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editTaskMutation, { data, loading, error }] = useEditTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useEditTaskMutation(baseOptions?: Apollo.MutationHookOptions<EditTaskMutation, EditTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditTaskMutation, EditTaskMutationVariables>(EditTaskDocument, options);
      }
export type EditTaskMutationHookResult = ReturnType<typeof useEditTaskMutation>;
export type EditTaskMutationResult = Apollo.MutationResult<EditTaskMutation>;
export type EditTaskMutationOptions = Apollo.BaseMutationOptions<EditTaskMutation, EditTaskMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    ... on UserSucces {
      accesToken
      user {
        id
        email
        fullName
      }
    }
    ... on UserFail {
      errors {
        field
        message
      }
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!, $name: String!) {
  register(email: $email, password: $password, name: $name) {
    ... on UserSucces {
      accesToken
      user {
        id
        email
        fullName
      }
    }
    ... on UserFail {
      errors {
        field
        message
      }
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const ToggleSubtaskDocument = gql`
    mutation ToggleSubtask($id: String!) {
  toggleSubtask(id: $id) {
    ...Subtask
  }
}
    ${SubtaskFragmentDoc}`;
export type ToggleSubtaskMutationFn = Apollo.MutationFunction<ToggleSubtaskMutation, ToggleSubtaskMutationVariables>;

/**
 * __useToggleSubtaskMutation__
 *
 * To run a mutation, you first call `useToggleSubtaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleSubtaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleSubtaskMutation, { data, loading, error }] = useToggleSubtaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useToggleSubtaskMutation(baseOptions?: Apollo.MutationHookOptions<ToggleSubtaskMutation, ToggleSubtaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleSubtaskMutation, ToggleSubtaskMutationVariables>(ToggleSubtaskDocument, options);
      }
export type ToggleSubtaskMutationHookResult = ReturnType<typeof useToggleSubtaskMutation>;
export type ToggleSubtaskMutationResult = Apollo.MutationResult<ToggleSubtaskMutation>;
export type ToggleSubtaskMutationOptions = Apollo.BaseMutationOptions<ToggleSubtaskMutation, ToggleSubtaskMutationVariables>;
export const ToggleTaskDocument = gql`
    mutation ToggleTask($id: String!) {
  toggleTask(id: $id) {
    ...Task
  }
}
    ${TaskFragmentDoc}`;
export type ToggleTaskMutationFn = Apollo.MutationFunction<ToggleTaskMutation, ToggleTaskMutationVariables>;

/**
 * __useToggleTaskMutation__
 *
 * To run a mutation, you first call `useToggleTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleTaskMutation, { data, loading, error }] = useToggleTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useToggleTaskMutation(baseOptions?: Apollo.MutationHookOptions<ToggleTaskMutation, ToggleTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleTaskMutation, ToggleTaskMutationVariables>(ToggleTaskDocument, options);
      }
export type ToggleTaskMutationHookResult = ReturnType<typeof useToggleTaskMutation>;
export type ToggleTaskMutationResult = Apollo.MutationResult<ToggleTaskMutation>;
export type ToggleTaskMutationOptions = Apollo.BaseMutationOptions<ToggleTaskMutation, ToggleTaskMutationVariables>;
export const GetAllSubjectsDocument = gql`
    query GetAllSubjects {
  getAllSubjects {
    ...Subject
  }
}
    ${SubjectFragmentDoc}`;

/**
 * __useGetAllSubjectsQuery__
 *
 * To run a query within a React component, call `useGetAllSubjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllSubjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllSubjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllSubjectsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllSubjectsQuery, GetAllSubjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllSubjectsQuery, GetAllSubjectsQueryVariables>(GetAllSubjectsDocument, options);
      }
export function useGetAllSubjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllSubjectsQuery, GetAllSubjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllSubjectsQuery, GetAllSubjectsQueryVariables>(GetAllSubjectsDocument, options);
        }
export type GetAllSubjectsQueryHookResult = ReturnType<typeof useGetAllSubjectsQuery>;
export type GetAllSubjectsLazyQueryHookResult = ReturnType<typeof useGetAllSubjectsLazyQuery>;
export type GetAllSubjectsQueryResult = Apollo.QueryResult<GetAllSubjectsQuery, GetAllSubjectsQueryVariables>;
export const GetAllTasksDocument = gql`
    query GetAllTasks {
  getAllTasks {
    ...Task
  }
}
    ${TaskFragmentDoc}`;

/**
 * __useGetAllTasksQuery__
 *
 * To run a query within a React component, call `useGetAllTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllTasksQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllTasksQuery(baseOptions?: Apollo.QueryHookOptions<GetAllTasksQuery, GetAllTasksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllTasksQuery, GetAllTasksQueryVariables>(GetAllTasksDocument, options);
      }
export function useGetAllTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllTasksQuery, GetAllTasksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllTasksQuery, GetAllTasksQueryVariables>(GetAllTasksDocument, options);
        }
export type GetAllTasksQueryHookResult = ReturnType<typeof useGetAllTasksQuery>;
export type GetAllTasksLazyQueryHookResult = ReturnType<typeof useGetAllTasksLazyQuery>;
export type GetAllTasksQueryResult = Apollo.QueryResult<GetAllTasksQuery, GetAllTasksQueryVariables>;
export const HelloDocument = gql`
    query Hello {
  hello
}
    `;

/**
 * __useHelloQuery__
 *
 * To run a query within a React component, call `useHelloQuery` and pass it any options that fit your needs.
 * When your component renders, `useHelloQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHelloQuery({
 *   variables: {
 *   },
 * });
 */
export function useHelloQuery(baseOptions?: Apollo.QueryHookOptions<HelloQuery, HelloQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HelloQuery, HelloQueryVariables>(HelloDocument, options);
      }
export function useHelloLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HelloQuery, HelloQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HelloQuery, HelloQueryVariables>(HelloDocument, options);
        }
export type HelloQueryHookResult = ReturnType<typeof useHelloQuery>;
export type HelloLazyQueryHookResult = ReturnType<typeof useHelloLazyQuery>;
export type HelloQueryResult = Apollo.QueryResult<HelloQuery, HelloQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    email
    tasks {
      id
      name
      subject {
        id
        name
      }
      subtasks {
        id
        name
      }
    }
    subjects {
      id
      name
    }
    fullName
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const UserExistsDocument = gql`
    query UserExists($email: String!) {
  userExists(email: $email)
}
    `;

/**
 * __useUserExistsQuery__
 *
 * To run a query within a React component, call `useUserExistsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserExistsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserExistsQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useUserExistsQuery(baseOptions: Apollo.QueryHookOptions<UserExistsQuery, UserExistsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserExistsQuery, UserExistsQueryVariables>(UserExistsDocument, options);
      }
export function useUserExistsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserExistsQuery, UserExistsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserExistsQuery, UserExistsQueryVariables>(UserExistsDocument, options);
        }
export type UserExistsQueryHookResult = ReturnType<typeof useUserExistsQuery>;
export type UserExistsLazyQueryHookResult = ReturnType<typeof useUserExistsLazyQuery>;
export type UserExistsQueryResult = Apollo.QueryResult<UserExistsQuery, UserExistsQueryVariables>;