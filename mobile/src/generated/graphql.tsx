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
  DateTime: any;
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  endDate?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  name: Scalars['String'];
  startDate: Scalars['DateTime'];
  subject?: Maybe<Subject>;
  subjectId?: Maybe<Scalars['String']>;
  user: User;
  userId: Scalars['String'];
  wholeDay: Scalars['Boolean'];
};

export type Lesson = {
  __typename?: 'Lesson';
  dayOfTheWeek: Scalars['String'];
  id: Scalars['String'];
  lessonTime: LessonTime;
  lessonTimeId: Scalars['String'];
  subject: Subject;
  subjectId: Scalars['String'];
  userId: Scalars['String'];
};

export type LessonTime = {
  __typename?: 'LessonTime';
  endTime: Scalars['String'];
  id: Scalars['String'];
  startTime: Scalars['String'];
};

export type LessonTimeInput = {
  endTime: Scalars['String'];
  id: Scalars['String'];
  startTime: Scalars['String'];
};

export type LoginResponse = UserFail | UserSucces;

export type Mutation = {
  __typename?: 'Mutation';
  changeSubjectOfTask: Task;
  createEvent: CalendarEvent;
  createLesson: Lesson;
  createLessonTime: LessonTime;
  createSubject: Subject;
  createSubtask: Subtask;
  createTask: Task;
  deleteEvent: Scalars['Boolean'];
  deleteLesson: Scalars['Boolean'];
  deleteLessonTime: Scalars['Boolean'];
  deleteLessonTimes: Scalars['Boolean'];
  deleteSubtask: Scalars['Boolean'];
  deleteTask: Scalars['Boolean'];
  editEvent: CalendarEvent;
  editLesson: Lesson;
  editLessonTime: LessonTime;
  editLessonTimes: Array<LessonTime>;
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


export type MutationCreateEventArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  name: Scalars['String'];
  startDate: Scalars['DateTime'];
  subjectId?: InputMaybe<Scalars['String']>;
  wholeDay?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCreateLessonArgs = {
  dayOfTheWeek: Scalars['String'];
  lessonTimeId: Scalars['String'];
  subjectId: Scalars['String'];
};


export type MutationCreateLessonTimeArgs = {
  endTime: Scalars['String'];
  startTime: Scalars['String'];
};


export type MutationCreateSubjectArgs = {
  name: Scalars['String'];
};


export type MutationCreateSubtaskArgs = {
  name: Scalars['String'];
  taskId: Scalars['String'];
};


export type MutationCreateTaskArgs = {
  dueDate?: InputMaybe<Scalars['DateTime']>;
  name: Scalars['String'];
  subjectId?: InputMaybe<Scalars['String']>;
};


export type MutationDeleteEventArgs = {
  id: Scalars['String'];
};


export type MutationDeleteLessonArgs = {
  id: Scalars['String'];
};


export type MutationDeleteLessonTimeArgs = {
  id: Scalars['String'];
};


export type MutationDeleteLessonTimesArgs = {
  ids: Array<Scalars['String']>;
};


export type MutationDeleteSubtaskArgs = {
  id: Scalars['String'];
};


export type MutationDeleteTaskArgs = {
  id: Scalars['String'];
};


export type MutationEditEventArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  id: Scalars['String'];
  startDate: Scalars['DateTime'];
  subjectId?: InputMaybe<Scalars['String']>;
  wholeDay?: InputMaybe<Scalars['Boolean']>;
};


export type MutationEditLessonArgs = {
  id: Scalars['String'];
  subjectId: Scalars['String'];
};


export type MutationEditLessonTimeArgs = {
  endTime: Scalars['String'];
  id: Scalars['String'];
  startTime: Scalars['String'];
};


export type MutationEditLessonTimesArgs = {
  lessonTimes: Array<LessonTimeInput>;
};


export type MutationEditTaskArgs = {
  doDate?: InputMaybe<Scalars['DateTime']>;
  dueDate?: InputMaybe<Scalars['DateTime']>;
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
  getAllEvents: Array<CalendarEvent>;
  getAllLessonTimes: Array<LessonTime>;
  getAllLessons: Array<Lesson>;
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
  lessons: Array<Lesson>;
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
  doDate?: Maybe<Scalars['DateTime']>;
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
  events: Array<CalendarEvent>;
  fullName: Scalars['String'];
  googleId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  imageURL?: Maybe<Scalars['String']>;
  lessonTimes: Array<LessonTime>;
  lessons: Array<Lesson>;
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

export type CalendarEventFragment = { __typename?: 'CalendarEvent', id: string, name: string, startDate: any, endDate?: any | null | undefined, wholeDay: boolean, subject?: { __typename?: 'Subject', id: string, name: string } | null | undefined };

export type LessonFragment = { __typename?: 'Lesson', id: string, dayOfTheWeek: string, subject: { __typename?: 'Subject', id: string, name: string }, lessonTime: { __typename?: 'LessonTime', id: string, startTime: string, endTime: string } };

export type LessonTimeFragment = { __typename?: 'LessonTime', id: string, startTime: string, endTime: string };

export type SubjectFragment = { __typename?: 'Subject', id: string, name: string };

export type SubtaskFragment = { __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean };

export type TaskFragment = { __typename?: 'Task', id: string, name: string, userId: string, createdAt: any, done: boolean, updatedAt: any, text?: string | null | undefined, dueDate?: any | null | undefined, doDate?: any | null | undefined, subtasks: Array<{ __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean }>, subject?: { __typename?: 'Subject', id: string, name: string } | null | undefined };

export type CreateEventMutationVariables = Exact<{
  startDate: Scalars['DateTime'];
  endDate?: InputMaybe<Scalars['DateTime']>;
  wholeDay?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  subjectId?: InputMaybe<Scalars['String']>;
}>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent: { __typename?: 'CalendarEvent', id: string, name: string, startDate: any, endDate?: any | null | undefined, wholeDay: boolean, subject?: { __typename?: 'Subject', id: string, name: string } | null | undefined } };

export type DeleteEventMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteEventMutation = { __typename?: 'Mutation', deleteEvent: boolean };

export type CreateLessonMutationVariables = Exact<{
  dayOfTheWeek: Scalars['String'];
  lessonTimeId: Scalars['String'];
  subjectId: Scalars['String'];
}>;


export type CreateLessonMutation = { __typename?: 'Mutation', createLesson: { __typename?: 'Lesson', id: string, dayOfTheWeek: string, subject: { __typename?: 'Subject', id: string, name: string }, lessonTime: { __typename?: 'LessonTime', id: string, startTime: string, endTime: string } } };

export type DeleteLessonMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteLessonMutation = { __typename?: 'Mutation', deleteLesson: boolean };

export type EditLessonMutationVariables = Exact<{
  id: Scalars['String'];
  subjectId: Scalars['String'];
}>;


export type EditLessonMutation = { __typename?: 'Mutation', editLesson: { __typename?: 'Lesson', id: string, dayOfTheWeek: string, subject: { __typename?: 'Subject', id: string, name: string }, lessonTime: { __typename?: 'LessonTime', id: string, startTime: string, endTime: string } } };

export type CreatelessonTimeMutationVariables = Exact<{
  endTime: Scalars['String'];
  startTime: Scalars['String'];
}>;


export type CreatelessonTimeMutation = { __typename?: 'Mutation', createLessonTime: { __typename?: 'LessonTime', id: string, startTime: string, endTime: string } };

export type DeleteLessonTimeMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteLessonTimeMutation = { __typename?: 'Mutation', deleteLessonTime: boolean };

export type EditLessonTimeMutationVariables = Exact<{
  endTime: Scalars['String'];
  startTime: Scalars['String'];
  id: Scalars['String'];
}>;


export type EditLessonTimeMutation = { __typename?: 'Mutation', editLessonTime: { __typename?: 'LessonTime', id: string, startTime: string, endTime: string } };

export type EditLessonTimesMutationVariables = Exact<{
  lessonTimes: Array<LessonTimeInput> | LessonTimeInput;
}>;


export type EditLessonTimesMutation = { __typename?: 'Mutation', editLessonTimes: Array<{ __typename?: 'LessonTime', id: string, startTime: string, endTime: string }> };

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
  dueDate?: InputMaybe<Scalars['DateTime']>;
}>;


export type CreateTaskMutation = { __typename?: 'Mutation', createTask: { __typename?: 'Task', id: string, name: string, userId: string, createdAt: any, done: boolean, updatedAt: any, text?: string | null | undefined, dueDate?: any | null | undefined, doDate?: any | null | undefined, subtasks: Array<{ __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean }>, subject?: { __typename?: 'Subject', id: string, name: string } | null | undefined } };

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
  dueDate?: InputMaybe<Scalars['DateTime']>;
  doDate?: InputMaybe<Scalars['DateTime']>;
}>;


export type EditTaskMutation = { __typename?: 'Mutation', editTask: { __typename?: 'Task', id: string, name: string, userId: string, createdAt: any, done: boolean, updatedAt: any, text?: string | null | undefined, dueDate?: any | null | undefined, doDate?: any | null | undefined, subtasks: Array<{ __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean }>, subject?: { __typename?: 'Subject', id: string, name: string } | null | undefined } };

export type ToggleSubtaskMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type ToggleSubtaskMutation = { __typename?: 'Mutation', toggleSubtask: { __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean } };

export type ToggleTaskMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type ToggleTaskMutation = { __typename?: 'Mutation', toggleTask: { __typename?: 'Task', id: string, name: string, userId: string, createdAt: any, done: boolean, updatedAt: any, text?: string | null | undefined, dueDate?: any | null | undefined, doDate?: any | null | undefined, subtasks: Array<{ __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean }>, subject?: { __typename?: 'Subject', id: string, name: string } | null | undefined } };

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

export type GetAllEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllEventsQuery = { __typename?: 'Query', getAllEvents: Array<{ __typename?: 'CalendarEvent', id: string, name: string, startDate: any, endDate?: any | null | undefined, wholeDay: boolean, subject?: { __typename?: 'Subject', id: string, name: string } | null | undefined }> };

export type GetAllLessonTimesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllLessonTimesQuery = { __typename?: 'Query', getAllLessonTimes: Array<{ __typename?: 'LessonTime', id: string, startTime: string, endTime: string }> };

export type GetAllLessonsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllLessonsQuery = { __typename?: 'Query', getAllLessons: Array<{ __typename?: 'Lesson', id: string, dayOfTheWeek: string, subject: { __typename?: 'Subject', id: string, name: string }, lessonTime: { __typename?: 'LessonTime', id: string, startTime: string, endTime: string } }> };

export type GetAllSubjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSubjectsQuery = { __typename?: 'Query', getAllSubjects: Array<{ __typename?: 'Subject', id: string, name: string }> };

export type GetAllTasksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTasksQuery = { __typename?: 'Query', getAllTasks: Array<{ __typename?: 'Task', id: string, name: string, userId: string, createdAt: any, done: boolean, updatedAt: any, text?: string | null | undefined, dueDate?: any | null | undefined, doDate?: any | null | undefined, subtasks: Array<{ __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean }>, subject?: { __typename?: 'Subject', id: string, name: string } | null | undefined }> };

export type HelloQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQuery = { __typename?: 'Query', hello: string };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, email: string, fullName: string, createdAt: any, updatedAt: any, tasks: Array<{ __typename?: 'Task', id: string, name: string, subject?: { __typename?: 'Subject', id: string, name: string } | null | undefined, subtasks: Array<{ __typename?: 'Subtask', id: string, name: string }> }>, subjects: Array<{ __typename?: 'Subject', id: string, name: string }> } };

export type UserExistsQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type UserExistsQuery = { __typename?: 'Query', userExists: boolean };

export const SubjectFragmentDoc = gql`
    fragment Subject on Subject {
  id
  name
}
    `;
export const CalendarEventFragmentDoc = gql`
    fragment CalendarEvent on CalendarEvent {
  id
  name
  startDate
  endDate
  wholeDay
  subject {
    ...Subject
  }
}
    ${SubjectFragmentDoc}`;
export const LessonTimeFragmentDoc = gql`
    fragment LessonTime on LessonTime {
  id
  startTime
  endTime
}
    `;
export const LessonFragmentDoc = gql`
    fragment Lesson on Lesson {
  id
  dayOfTheWeek
  subject {
    ...Subject
  }
  lessonTime {
    ...LessonTime
  }
}
    ${SubjectFragmentDoc}
${LessonTimeFragmentDoc}`;
export const SubtaskFragmentDoc = gql`
    fragment Subtask on Subtask {
  name
  id
  taskId
  done
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
  doDate
}
    ${SubtaskFragmentDoc}
${SubjectFragmentDoc}`;
export const CreateEventDocument = gql`
    mutation CreateEvent($startDate: DateTime!, $endDate: DateTime, $wholeDay: Boolean, $name: String!, $subjectId: String) {
  createEvent(
    startDate: $startDate
    endDate: $endDate
    wholeDay: $wholeDay
    name: $name
    subjectId: $subjectId
  ) {
    ...CalendarEvent
  }
}
    ${CalendarEventFragmentDoc}`;
export type CreateEventMutationFn = Apollo.MutationFunction<CreateEventMutation, CreateEventMutationVariables>;

/**
 * __useCreateEventMutation__
 *
 * To run a mutation, you first call `useCreateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEventMutation, { data, loading, error }] = useCreateEventMutation({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *      wholeDay: // value for 'wholeDay'
 *      name: // value for 'name'
 *      subjectId: // value for 'subjectId'
 *   },
 * });
 */
export function useCreateEventMutation(baseOptions?: Apollo.MutationHookOptions<CreateEventMutation, CreateEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEventMutation, CreateEventMutationVariables>(CreateEventDocument, options);
      }
export type CreateEventMutationHookResult = ReturnType<typeof useCreateEventMutation>;
export type CreateEventMutationResult = Apollo.MutationResult<CreateEventMutation>;
export type CreateEventMutationOptions = Apollo.BaseMutationOptions<CreateEventMutation, CreateEventMutationVariables>;
export const DeleteEventDocument = gql`
    mutation DeleteEvent($id: String!) {
  deleteEvent(id: $id)
}
    `;
export type DeleteEventMutationFn = Apollo.MutationFunction<DeleteEventMutation, DeleteEventMutationVariables>;

/**
 * __useDeleteEventMutation__
 *
 * To run a mutation, you first call `useDeleteEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEventMutation, { data, loading, error }] = useDeleteEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEventMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEventMutation, DeleteEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEventMutation, DeleteEventMutationVariables>(DeleteEventDocument, options);
      }
export type DeleteEventMutationHookResult = ReturnType<typeof useDeleteEventMutation>;
export type DeleteEventMutationResult = Apollo.MutationResult<DeleteEventMutation>;
export type DeleteEventMutationOptions = Apollo.BaseMutationOptions<DeleteEventMutation, DeleteEventMutationVariables>;
export const CreateLessonDocument = gql`
    mutation CreateLesson($dayOfTheWeek: String!, $lessonTimeId: String!, $subjectId: String!) {
  createLesson(
    dayOfTheWeek: $dayOfTheWeek
    lessonTimeId: $lessonTimeId
    subjectId: $subjectId
  ) {
    ...Lesson
  }
}
    ${LessonFragmentDoc}`;
export type CreateLessonMutationFn = Apollo.MutationFunction<CreateLessonMutation, CreateLessonMutationVariables>;

/**
 * __useCreateLessonMutation__
 *
 * To run a mutation, you first call `useCreateLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLessonMutation, { data, loading, error }] = useCreateLessonMutation({
 *   variables: {
 *      dayOfTheWeek: // value for 'dayOfTheWeek'
 *      lessonTimeId: // value for 'lessonTimeId'
 *      subjectId: // value for 'subjectId'
 *   },
 * });
 */
export function useCreateLessonMutation(baseOptions?: Apollo.MutationHookOptions<CreateLessonMutation, CreateLessonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLessonMutation, CreateLessonMutationVariables>(CreateLessonDocument, options);
      }
export type CreateLessonMutationHookResult = ReturnType<typeof useCreateLessonMutation>;
export type CreateLessonMutationResult = Apollo.MutationResult<CreateLessonMutation>;
export type CreateLessonMutationOptions = Apollo.BaseMutationOptions<CreateLessonMutation, CreateLessonMutationVariables>;
export const DeleteLessonDocument = gql`
    mutation DeleteLesson($id: String!) {
  deleteLesson(id: $id)
}
    `;
export type DeleteLessonMutationFn = Apollo.MutationFunction<DeleteLessonMutation, DeleteLessonMutationVariables>;

/**
 * __useDeleteLessonMutation__
 *
 * To run a mutation, you first call `useDeleteLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLessonMutation, { data, loading, error }] = useDeleteLessonMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteLessonMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLessonMutation, DeleteLessonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLessonMutation, DeleteLessonMutationVariables>(DeleteLessonDocument, options);
      }
export type DeleteLessonMutationHookResult = ReturnType<typeof useDeleteLessonMutation>;
export type DeleteLessonMutationResult = Apollo.MutationResult<DeleteLessonMutation>;
export type DeleteLessonMutationOptions = Apollo.BaseMutationOptions<DeleteLessonMutation, DeleteLessonMutationVariables>;
export const EditLessonDocument = gql`
    mutation EditLesson($id: String!, $subjectId: String!) {
  editLesson(id: $id, subjectId: $subjectId) {
    ...Lesson
  }
}
    ${LessonFragmentDoc}`;
export type EditLessonMutationFn = Apollo.MutationFunction<EditLessonMutation, EditLessonMutationVariables>;

/**
 * __useEditLessonMutation__
 *
 * To run a mutation, you first call `useEditLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editLessonMutation, { data, loading, error }] = useEditLessonMutation({
 *   variables: {
 *      id: // value for 'id'
 *      subjectId: // value for 'subjectId'
 *   },
 * });
 */
export function useEditLessonMutation(baseOptions?: Apollo.MutationHookOptions<EditLessonMutation, EditLessonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditLessonMutation, EditLessonMutationVariables>(EditLessonDocument, options);
      }
export type EditLessonMutationHookResult = ReturnType<typeof useEditLessonMutation>;
export type EditLessonMutationResult = Apollo.MutationResult<EditLessonMutation>;
export type EditLessonMutationOptions = Apollo.BaseMutationOptions<EditLessonMutation, EditLessonMutationVariables>;
export const CreatelessonTimeDocument = gql`
    mutation CreatelessonTime($endTime: String!, $startTime: String!) {
  createLessonTime(endTime: $endTime, startTime: $startTime) {
    ...LessonTime
  }
}
    ${LessonTimeFragmentDoc}`;
export type CreatelessonTimeMutationFn = Apollo.MutationFunction<CreatelessonTimeMutation, CreatelessonTimeMutationVariables>;

/**
 * __useCreatelessonTimeMutation__
 *
 * To run a mutation, you first call `useCreatelessonTimeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatelessonTimeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createlessonTimeMutation, { data, loading, error }] = useCreatelessonTimeMutation({
 *   variables: {
 *      endTime: // value for 'endTime'
 *      startTime: // value for 'startTime'
 *   },
 * });
 */
export function useCreatelessonTimeMutation(baseOptions?: Apollo.MutationHookOptions<CreatelessonTimeMutation, CreatelessonTimeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatelessonTimeMutation, CreatelessonTimeMutationVariables>(CreatelessonTimeDocument, options);
      }
export type CreatelessonTimeMutationHookResult = ReturnType<typeof useCreatelessonTimeMutation>;
export type CreatelessonTimeMutationResult = Apollo.MutationResult<CreatelessonTimeMutation>;
export type CreatelessonTimeMutationOptions = Apollo.BaseMutationOptions<CreatelessonTimeMutation, CreatelessonTimeMutationVariables>;
export const DeleteLessonTimeDocument = gql`
    mutation DeleteLessonTime($id: String!) {
  deleteLessonTime(id: $id)
}
    `;
export type DeleteLessonTimeMutationFn = Apollo.MutationFunction<DeleteLessonTimeMutation, DeleteLessonTimeMutationVariables>;

/**
 * __useDeleteLessonTimeMutation__
 *
 * To run a mutation, you first call `useDeleteLessonTimeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLessonTimeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLessonTimeMutation, { data, loading, error }] = useDeleteLessonTimeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteLessonTimeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLessonTimeMutation, DeleteLessonTimeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLessonTimeMutation, DeleteLessonTimeMutationVariables>(DeleteLessonTimeDocument, options);
      }
export type DeleteLessonTimeMutationHookResult = ReturnType<typeof useDeleteLessonTimeMutation>;
export type DeleteLessonTimeMutationResult = Apollo.MutationResult<DeleteLessonTimeMutation>;
export type DeleteLessonTimeMutationOptions = Apollo.BaseMutationOptions<DeleteLessonTimeMutation, DeleteLessonTimeMutationVariables>;
export const EditLessonTimeDocument = gql`
    mutation EditLessonTime($endTime: String!, $startTime: String!, $id: String!) {
  editLessonTime(endTime: $endTime, startTime: $startTime, id: $id) {
    ...LessonTime
  }
}
    ${LessonTimeFragmentDoc}`;
export type EditLessonTimeMutationFn = Apollo.MutationFunction<EditLessonTimeMutation, EditLessonTimeMutationVariables>;

/**
 * __useEditLessonTimeMutation__
 *
 * To run a mutation, you first call `useEditLessonTimeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditLessonTimeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editLessonTimeMutation, { data, loading, error }] = useEditLessonTimeMutation({
 *   variables: {
 *      endTime: // value for 'endTime'
 *      startTime: // value for 'startTime'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEditLessonTimeMutation(baseOptions?: Apollo.MutationHookOptions<EditLessonTimeMutation, EditLessonTimeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditLessonTimeMutation, EditLessonTimeMutationVariables>(EditLessonTimeDocument, options);
      }
export type EditLessonTimeMutationHookResult = ReturnType<typeof useEditLessonTimeMutation>;
export type EditLessonTimeMutationResult = Apollo.MutationResult<EditLessonTimeMutation>;
export type EditLessonTimeMutationOptions = Apollo.BaseMutationOptions<EditLessonTimeMutation, EditLessonTimeMutationVariables>;
export const EditLessonTimesDocument = gql`
    mutation EditLessonTimes($lessonTimes: [LessonTimeInput!]!) {
  editLessonTimes(lessonTimes: $lessonTimes) {
    ...LessonTime
  }
}
    ${LessonTimeFragmentDoc}`;
export type EditLessonTimesMutationFn = Apollo.MutationFunction<EditLessonTimesMutation, EditLessonTimesMutationVariables>;

/**
 * __useEditLessonTimesMutation__
 *
 * To run a mutation, you first call `useEditLessonTimesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditLessonTimesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editLessonTimesMutation, { data, loading, error }] = useEditLessonTimesMutation({
 *   variables: {
 *      lessonTimes: // value for 'lessonTimes'
 *   },
 * });
 */
export function useEditLessonTimesMutation(baseOptions?: Apollo.MutationHookOptions<EditLessonTimesMutation, EditLessonTimesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditLessonTimesMutation, EditLessonTimesMutationVariables>(EditLessonTimesDocument, options);
      }
export type EditLessonTimesMutationHookResult = ReturnType<typeof useEditLessonTimesMutation>;
export type EditLessonTimesMutationResult = Apollo.MutationResult<EditLessonTimesMutation>;
export type EditLessonTimesMutationOptions = Apollo.BaseMutationOptions<EditLessonTimesMutation, EditLessonTimesMutationVariables>;
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
    mutation CreateTask($name: String!, $subjectId: String, $dueDate: DateTime) {
  createTask(name: $name, subjectId: $subjectId, dueDate: $dueDate) {
    ...Task
  }
}
    ${TaskFragmentDoc}`;
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
 *      dueDate: // value for 'dueDate'
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
    mutation EditTask($id: String!, $name: String!, $text: String, $dueDate: DateTime, $doDate: DateTime) {
  editTask(id: $id, name: $name, text: $text, dueDate: $dueDate, doDate: $doDate) {
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
 *      dueDate: // value for 'dueDate'
 *      doDate: // value for 'doDate'
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
export const GetAllEventsDocument = gql`
    query GetAllEvents {
  getAllEvents {
    ...CalendarEvent
  }
}
    ${CalendarEventFragmentDoc}`;

/**
 * __useGetAllEventsQuery__
 *
 * To run a query within a React component, call `useGetAllEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllEventsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllEventsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllEventsQuery, GetAllEventsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllEventsQuery, GetAllEventsQueryVariables>(GetAllEventsDocument, options);
      }
export function useGetAllEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllEventsQuery, GetAllEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllEventsQuery, GetAllEventsQueryVariables>(GetAllEventsDocument, options);
        }
export type GetAllEventsQueryHookResult = ReturnType<typeof useGetAllEventsQuery>;
export type GetAllEventsLazyQueryHookResult = ReturnType<typeof useGetAllEventsLazyQuery>;
export type GetAllEventsQueryResult = Apollo.QueryResult<GetAllEventsQuery, GetAllEventsQueryVariables>;
export const GetAllLessonTimesDocument = gql`
    query GetAllLessonTimes {
  getAllLessonTimes {
    ...LessonTime
  }
}
    ${LessonTimeFragmentDoc}`;

/**
 * __useGetAllLessonTimesQuery__
 *
 * To run a query within a React component, call `useGetAllLessonTimesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllLessonTimesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllLessonTimesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllLessonTimesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllLessonTimesQuery, GetAllLessonTimesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllLessonTimesQuery, GetAllLessonTimesQueryVariables>(GetAllLessonTimesDocument, options);
      }
export function useGetAllLessonTimesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllLessonTimesQuery, GetAllLessonTimesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllLessonTimesQuery, GetAllLessonTimesQueryVariables>(GetAllLessonTimesDocument, options);
        }
export type GetAllLessonTimesQueryHookResult = ReturnType<typeof useGetAllLessonTimesQuery>;
export type GetAllLessonTimesLazyQueryHookResult = ReturnType<typeof useGetAllLessonTimesLazyQuery>;
export type GetAllLessonTimesQueryResult = Apollo.QueryResult<GetAllLessonTimesQuery, GetAllLessonTimesQueryVariables>;
export const GetAllLessonsDocument = gql`
    query GetAllLessons {
  getAllLessons {
    ...Lesson
  }
}
    ${LessonFragmentDoc}`;

/**
 * __useGetAllLessonsQuery__
 *
 * To run a query within a React component, call `useGetAllLessonsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllLessonsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllLessonsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllLessonsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllLessonsQuery, GetAllLessonsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllLessonsQuery, GetAllLessonsQueryVariables>(GetAllLessonsDocument, options);
      }
export function useGetAllLessonsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllLessonsQuery, GetAllLessonsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllLessonsQuery, GetAllLessonsQueryVariables>(GetAllLessonsDocument, options);
        }
export type GetAllLessonsQueryHookResult = ReturnType<typeof useGetAllLessonsQuery>;
export type GetAllLessonsLazyQueryHookResult = ReturnType<typeof useGetAllLessonsLazyQuery>;
export type GetAllLessonsQueryResult = Apollo.QueryResult<GetAllLessonsQuery, GetAllLessonsQueryVariables>;
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