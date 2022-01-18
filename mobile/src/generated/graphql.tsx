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

export type ManySubtaskResponse = ManySubtasksResponse | SubTaskFail;

export type ManySubtasksResponse = {
  __typename?: 'ManySubtasksResponse';
  tasks: Array<Subtask>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changeSubjectOfTask: Task;
  createSubject: Subject;
  createSubtask: SingleSubtaskResponse;
  createTask: Task;
  deleteSubtask: Scalars['Boolean'];
  deleteTask: Scalars['Boolean'];
  login: LoginResponse;
  register: RegisterResponse;
  toggleTask: SingleSubtaskResponse;
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


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};


export type MutationToggleTaskArgs = {
  id: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getAllSubtasksOfTask: ManySubtaskResponse;
  getAllTasks: Array<Task>;
  getSubjectsOfUser: Array<Subject>;
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

export type SingleSubtaskResponse = SubTaskFail | Subtask;

export type SubTaskFail = {
  __typename?: 'SubTaskFail';
  errors: Array<Scalars['String']>;
};

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

export type CreateTaskMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateTaskMutation = { __typename?: 'Mutation', createTask: { __typename?: 'Task', name: string, id: string } };

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

export type GetAllTasksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTasksQuery = { __typename?: 'Query', getAllTasks: Array<{ __typename?: 'Task', id: string, name: string, userId: string, createdAt: any, subtasks: Array<{ __typename?: 'Subtask', name: string, id: string, taskId: string }> }> };

export type HelloQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQuery = { __typename?: 'Query', hello: string };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, email: string, fullName: string, createdAt: any, updatedAt: any, tasks: Array<{ __typename?: 'Task', id: string, name: string, subject?: { __typename?: 'Subject', id: string, name: string } | null | undefined, subtasks: Array<{ __typename?: 'Subtask', id: string, name: string }> }>, subjects: Array<{ __typename?: 'Subject', id: string, name: string }> } };

export type UserExistsQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type UserExistsQuery = { __typename?: 'Query', userExists: boolean };


export const CreateTaskDocument = gql`
    mutation CreateTask($name: String!) {
  createTask(name: $name) {
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
export const GetAllTasksDocument = gql`
    query GetAllTasks {
  getAllTasks {
    id
    name
    userId
    createdAt
    subtasks {
      name
      id
      taskId
    }
  }
}
    `;

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