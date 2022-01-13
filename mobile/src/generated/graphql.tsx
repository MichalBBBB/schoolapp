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
};


export type QueryGetAllSubtasksOfTaskArgs = {
  id: Scalars['String'];
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
  accesToken?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type HelloQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQuery = { __typename?: 'Query', hello: string };


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