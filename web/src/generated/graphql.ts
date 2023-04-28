import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
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
  reminders: Array<Reminder>;
  startDate: Scalars['DateTime'];
  subject?: Maybe<Subject>;
  subjectId?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  user: User;
  userId: Scalars['String'];
  wholeDay: Scalars['Boolean'];
};

export type ChangePasswordResponse = ChangePasswordSuccess | UserFail;

export type ChangePasswordSuccess = {
  __typename?: 'ChangePasswordSuccess';
  changePassword: Scalars['Boolean'];
};

export type Invite = {
  __typename?: 'Invite';
  adminName: Scalars['String'];
  projectId: Scalars['String'];
  projectName: Scalars['String'];
};

export type Lesson = {
  __typename?: 'Lesson';
  dayNumber: Scalars['Float'];
  extraInfo?: Maybe<Scalars['String']>;
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

export type LoginResponse = UserFail | UserSuccess;

export type Mutation = {
  __typename?: 'Mutation';
  acceptProjectInvite: Project;
  addMemberToProject: Project;
  addProjectTask: ProjectTask;
  assignMember: ProjectTask;
  changePassword: ChangePasswordResponse;
  createEvent: CalendarEvent;
  createLesson: Lesson;
  createLessonTime: LessonTime;
  createProject: Project;
  createSubject: Subject;
  createSubtask: Subtask;
  createTask: Task;
  declineProjectInvite: Scalars['Boolean'];
  deleteAccount: Scalars['Boolean'];
  deleteAllGoogleUsers: Scalars['Boolean'];
  deleteEvent: Scalars['Boolean'];
  deleteLesson: Scalars['Boolean'];
  deleteLessonTime: Scalars['Boolean'];
  deleteLessonTimes: Scalars['Boolean'];
  deleteProject: Scalars['Boolean'];
  deleteProjectTask: Scalars['Boolean'];
  deleteSubject: Scalars['Boolean'];
  deleteSubtask: Scalars['Boolean'];
  deleteTask: Scalars['Boolean'];
  editEvent: CalendarEvent;
  editLesson: Lesson;
  editLessonTimes: Array<LessonTime>;
  editProject: Project;
  editProjectTask: ProjectTask;
  editSubject: Subject;
  editTask: Task;
  editUser: User;
  googleSignIn: UserSuccess;
  login: LoginResponse;
  logout: Scalars['Boolean'];
  makeMemberAdmin: Scalars['Boolean'];
  register: RegisterResponse;
  removeAssignedMember: ProjectTask;
  removeMemberFromProject: Project;
  resetPassword: ChangePasswordResponse;
  setSettings: Settings;
  toggleProjectTask: ProjectTask;
  toggleSubtask: Subtask;
  toggleTask: Task;
  verifyEmail: Scalars['Boolean'];
};


export type MutationAcceptProjectInviteArgs = {
  id: Scalars['String'];
};


export type MutationAddMemberToProjectArgs = {
  memberEmail: Scalars['String'];
  projectId: Scalars['String'];
};


export type MutationAddProjectTaskArgs = {
  doDate?: InputMaybe<Scalars['DateTime']>;
  dueDate?: InputMaybe<Scalars['DateTime']>;
  id?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  projectId: Scalars['String'];
};


export type MutationAssignMemberArgs = {
  taskId: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationCreateEventArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  id: Scalars['String'];
  name: Scalars['String'];
  reminders?: InputMaybe<Array<RemindersInput>>;
  startDate: Scalars['DateTime'];
  subjectId?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
  wholeDay?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCreateLessonArgs = {
  dayNumber: Scalars['Float'];
  id: Scalars['String'];
  lessonTimeId: Scalars['String'];
  subjectId: Scalars['String'];
};


export type MutationCreateLessonTimeArgs = {
  endTime: Scalars['String'];
  id: Scalars['String'];
  startTime: Scalars['String'];
};


export type MutationCreateProjectArgs = {
  id?: InputMaybe<Scalars['String']>;
  memberEmails: Array<Scalars['String']>;
  name: Scalars['String'];
};


export type MutationCreateSubjectArgs = {
  colorName: Scalars['String'];
  extraInfo?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
};


export type MutationCreateSubtaskArgs = {
  id: Scalars['String'];
  name: Scalars['String'];
  taskId: Scalars['String'];
};


export type MutationCreateTaskArgs = {
  doDate?: InputMaybe<Scalars['DateTime']>;
  dueDate?: InputMaybe<Scalars['DateTime']>;
  id: Scalars['String'];
  name: Scalars['String'];
  subjectId?: InputMaybe<Scalars['String']>;
};


export type MutationDeclineProjectInviteArgs = {
  id: Scalars['String'];
};


export type MutationDeleteAllGoogleUsersArgs = {
  id: Scalars['String'];
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


export type MutationDeleteProjectArgs = {
  id: Scalars['String'];
};


export type MutationDeleteProjectTaskArgs = {
  id: Scalars['String'];
};


export type MutationDeleteSubjectArgs = {
  id: Scalars['String'];
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
  name: Scalars['String'];
  reminders?: InputMaybe<Array<RemindersInput>>;
  startDate: Scalars['DateTime'];
  subjectId?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
  wholeDay?: InputMaybe<Scalars['Boolean']>;
};


export type MutationEditLessonArgs = {
  extraInfo?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  subjectId: Scalars['String'];
};


export type MutationEditLessonTimesArgs = {
  lessonTimes: Array<LessonTimeInput>;
};


export type MutationEditProjectArgs = {
  id: Scalars['String'];
  name: Scalars['String'];
  text?: InputMaybe<Scalars['String']>;
};


export type MutationEditProjectTaskArgs = {
  doDate?: InputMaybe<Scalars['DateTime']>;
  dueDate?: InputMaybe<Scalars['DateTime']>;
  id: Scalars['String'];
  name: Scalars['String'];
};


export type MutationEditSubjectArgs = {
  colorName: Scalars['String'];
  extraInfo?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
};


export type MutationEditTaskArgs = {
  doDate?: InputMaybe<Scalars['DateTime']>;
  dueDate?: InputMaybe<Scalars['DateTime']>;
  id: Scalars['String'];
  name: Scalars['String'];
  reminders?: InputMaybe<Array<RemindersInput>>;
  subjectId?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
};


export type MutationEditUserArgs = {
  email?: InputMaybe<Scalars['String']>;
  fullName?: InputMaybe<Scalars['String']>;
};


export type MutationGoogleSignInArgs = {
  idToken: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationMakeMemberAdminArgs = {
  memberId: Scalars['String'];
  projectId: Scalars['String'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRemoveAssignedMemberArgs = {
  taskId: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationRemoveMemberFromProjectArgs = {
  memberId: Scalars['String'];
  projectId: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationSetSettingsArgs = {
  darkMode?: InputMaybe<Scalars['Boolean']>;
  isFirstTime?: InputMaybe<Scalars['Boolean']>;
  lengthOfRotation?: InputMaybe<Scalars['Float']>;
  showCompletedTasks?: InputMaybe<Scalars['Boolean']>;
  showDoDate?: InputMaybe<Scalars['Boolean']>;
  skipWeekends?: InputMaybe<Scalars['Boolean']>;
  sortTasksBy?: InputMaybe<Scalars['String']>;
  startOfRotationDate?: InputMaybe<Scalars['DateTime']>;
  startOfWeek?: InputMaybe<Scalars['String']>;
};


export type MutationToggleProjectTaskArgs = {
  id: Scalars['String'];
};


export type MutationToggleSubtaskArgs = {
  id: Scalars['String'];
};


export type MutationToggleTaskArgs = {
  id: Scalars['String'];
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String'];
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['String'];
  isAdmin: Scalars['Boolean'];
  members: Array<PublicUser>;
  name: Scalars['String'];
  tasks: Array<ProjectTask>;
  text?: Maybe<Scalars['String']>;
  userProjects: Array<UserProject>;
};

export type ProjectTask = {
  __typename?: 'ProjectTask';
  createdAt: Scalars['DateTime'];
  doDate?: Maybe<Scalars['DateTime']>;
  done: Scalars['Boolean'];
  dueDate?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  name: Scalars['String'];
  project: Project;
  projectId: Scalars['String'];
  publicUsers: Array<PublicUser>;
  text?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  userProjectTasks: Array<UserProjectTask>;
};

export type PublicUser = {
  __typename?: 'PublicUser';
  email: Scalars['String'];
  id: Scalars['String'];
  isAdmin?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  userId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getAllEvents: Array<CalendarEvent>;
  getAllLessonTimes: Array<LessonTime>;
  getAllLessons: Array<Lesson>;
  getAllProjects: Array<Project>;
  getAllReminders: Array<Reminder>;
  getAllSubjects: Array<Subject>;
  getAllSubtasksOfTask: Array<Subtask>;
  getAllTasks: Array<Task>;
  getAllUsers: Array<User>;
  getInvites: Array<Invite>;
  getProjectTasksOfUser: Array<ProjectTask>;
  getProjects: Array<Project>;
  hello: Scalars['String'];
  me: User;
};


export type QueryGetAllSubtasksOfTaskArgs = {
  id: Scalars['String'];
};

export type RegisterResponse = UserFail | UserSuccess;

export type Reminder = {
  __typename?: 'Reminder';
  body?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  event?: Maybe<CalendarEvent>;
  eventId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  minutesBefore: Scalars['Float'];
  task?: Maybe<Task>;
  taskId?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type RemindersInput = {
  body?: InputMaybe<Scalars['String']>;
  date: Scalars['DateTime'];
  id: Scalars['String'];
  minutesBefore: Scalars['Float'];
  title: Scalars['String'];
};

export type Settings = {
  __typename?: 'Settings';
  darkMode: Scalars['Boolean'];
  id: Scalars['String'];
  isFirstTime: Scalars['Boolean'];
  lengthOfRotation: Scalars['Float'];
  showCompletedTasks: Scalars['Boolean'];
  showDoDate: Scalars['Boolean'];
  skipWeekends: Scalars['Boolean'];
  sortTasksBy: Scalars['String'];
  startOfRotationDate: Scalars['DateTime'];
  startOfWeek: Scalars['String'];
};

export type Subject = {
  __typename?: 'Subject';
  colorName: Scalars['String'];
  extraInfo?: Maybe<Scalars['String']>;
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
  reminders: Array<Reminder>;
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
  emailVerified: Scalars['Boolean'];
  events: Array<CalendarEvent>;
  fullName: Scalars['String'];
  googleId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  imageURL?: Maybe<Scalars['String']>;
  lessonTimes: Array<LessonTime>;
  lessons: Array<Lesson>;
  reminders: Array<Reminder>;
  settings: Settings;
  settingsId: Scalars['String'];
  subjects: Array<Subject>;
  tasks: Array<Task>;
  updatedAt: Scalars['DateTime'];
  userProjectTasks: Array<UserProjectTask>;
  userProjects: Array<UserProject>;
  usesOAuth: Scalars['Boolean'];
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

export type UserProject = {
  __typename?: 'UserProject';
  accepted: Scalars['Boolean'];
  isAdmin: Scalars['Boolean'];
  project: Project;
  projectId: Scalars['String'];
  user: User;
  userId: Scalars['String'];
};

export type UserProjectTask = {
  __typename?: 'UserProjectTask';
  projectTask: Project;
  projectTaskId: Scalars['String'];
  user: User;
  userId: Scalars['String'];
};

export type UserSuccess = {
  __typename?: 'UserSuccess';
  accessToken: Scalars['String'];
  user: User;
};

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'ChangePasswordSuccess', changePassword: boolean } | { __typename?: 'UserFail', errors: Array<{ __typename?: 'UserError', field?: string | null, message: string }> } };

export type VerifyEmailMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: boolean };


export const ResetPasswordDocument = gql`
    mutation ResetPassword($token: String!, $newPassword: String!) {
  resetPassword(token: $token, newPassword: $newPassword) {
    ... on ChangePasswordSuccess {
      changePassword
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
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const VerifyEmailDocument = gql`
    mutation VerifyEmail($token: String!) {
  verifyEmail(token: $token)
}
    `;
export type VerifyEmailMutationFn = Apollo.MutationFunction<VerifyEmailMutation, VerifyEmailMutationVariables>;

/**
 * __useVerifyEmailMutation__
 *
 * To run a mutation, you first call `useVerifyEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyEmailMutation, { data, loading, error }] = useVerifyEmailMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useVerifyEmailMutation(baseOptions?: Apollo.MutationHookOptions<VerifyEmailMutation, VerifyEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument, options);
      }
export type VerifyEmailMutationHookResult = ReturnType<typeof useVerifyEmailMutation>;
export type VerifyEmailMutationResult = Apollo.MutationResult<VerifyEmailMutation>;
export type VerifyEmailMutationOptions = Apollo.BaseMutationOptions<VerifyEmailMutation, VerifyEmailMutationVariables>;