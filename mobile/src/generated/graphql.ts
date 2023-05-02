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

export type ForgotPasswordResponse = ForgotPasswordSuccess | UserFail;

export type ForgotPasswordSuccess = {
  __typename?: 'ForgotPasswordSuccess';
  forgotPassword: Scalars['Boolean'];
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
  forgotPassword: ForgotPasswordResponse;
  googleSignIn: UserSuccess;
  login: LoginResponse;
  logout: Scalars['Boolean'];
  makeMemberAdmin: Scalars['Boolean'];
  register: RegisterResponse;
  removeAssignedMember: ProjectTask;
  removeMemberFromProject: Project;
  resendVerificationEmail: Scalars['Boolean'];
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


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
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

export type UserFragment = { __typename?: 'User', id: string, email: string, imageURL?: string | null, usesOAuth: boolean, fullName: string, createdAt: any, updatedAt: any, emailVerified: boolean, settings: { __typename?: 'Settings', id: string, startOfWeek: string, startOfRotationDate: any, lengthOfRotation: number, skipWeekends: boolean, darkMode: boolean, sortTasksBy: string, showDoDate: boolean, showCompletedTasks: boolean, isFirstTime: boolean } };

export type CalendarEventFragment = { __typename?: 'CalendarEvent', id: string, name: string, text?: string | null, startDate: any, endDate?: any | null, wholeDay: boolean, subject?: { __typename?: 'Subject', id: string, name: string, colorName: string, extraInfo?: string | null } | null, reminders: Array<{ __typename?: 'Reminder', id: string, minutesBefore: number, title: string, body?: string | null, date: any, taskId?: string | null, eventId?: string | null }> };

export type InviteFragment = { __typename?: 'Invite', adminName: string, projectName: string, projectId: string };

export type LessonFragment = { __typename?: 'Lesson', id: string, dayNumber: number, extraInfo?: string | null, subject: { __typename?: 'Subject', id: string, name: string, colorName: string, extraInfo?: string | null }, lessonTime: { __typename?: 'LessonTime', id: string, startTime: string, endTime: string } };

export type LessonTimeFragment = { __typename?: 'LessonTime', id: string, startTime: string, endTime: string };

export type ProjectFragment = { __typename?: 'Project', isAdmin: boolean, name: string, id: string, text?: string | null, tasks: Array<{ __typename?: 'ProjectTask', id: string, name: string, dueDate?: any | null, doDate?: any | null, done: boolean, projectId: string, createdAt: any, updatedAt: any, publicUsers: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> }>, members: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> };

export type ProjectTaskFragment = { __typename?: 'ProjectTask', id: string, name: string, dueDate?: any | null, doDate?: any | null, done: boolean, projectId: string, createdAt: any, updatedAt: any, publicUsers: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> };

export type ProjectTaskWithProjectFragment = { __typename?: 'ProjectTask', id: string, name: string, dueDate?: any | null, doDate?: any | null, done: boolean, projectId: string, createdAt: any, updatedAt: any, project: { __typename?: 'Project', id: string, name: string }, publicUsers: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> };

export type PublicUserFragment = { __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null };

export type ReminderFragment = { __typename?: 'Reminder', id: string, minutesBefore: number, title: string, body?: string | null, date: any, taskId?: string | null, eventId?: string | null };

export type SettingsFragment = { __typename?: 'Settings', id: string, startOfWeek: string, startOfRotationDate: any, lengthOfRotation: number, skipWeekends: boolean, darkMode: boolean, sortTasksBy: string, showDoDate: boolean, showCompletedTasks: boolean, isFirstTime: boolean };

export type SimpleProjectFragment = { __typename?: 'Project', id: string, name: string };

export type SubjectFragment = { __typename?: 'Subject', id: string, name: string, colorName: string, extraInfo?: string | null };

export type SubtaskFragment = { __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean };

export type TaskFragment = { __typename?: 'Task', id: string, name: string, createdAt: any, done: boolean, updatedAt: any, text?: string | null, dueDate?: any | null, doDate?: any | null, subtasks: Array<{ __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean }>, subject?: { __typename?: 'Subject', id: string, name: string, colorName: string, extraInfo?: string | null } | null, reminders: Array<{ __typename?: 'Reminder', id: string, minutesBefore: number, title: string, body?: string | null, date: any, taskId?: string | null, eventId?: string | null }> };

export type CreateEventMutationVariables = Exact<{
  startDate: Scalars['DateTime'];
  endDate?: InputMaybe<Scalars['DateTime']>;
  wholeDay?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  subjectId?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  reminders?: InputMaybe<Array<RemindersInput> | RemindersInput>;
  text?: InputMaybe<Scalars['String']>;
}>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent: { __typename?: 'CalendarEvent', id: string, name: string, text?: string | null, startDate: any, endDate?: any | null, wholeDay: boolean, subject?: { __typename?: 'Subject', id: string, name: string, colorName: string, extraInfo?: string | null } | null, reminders: Array<{ __typename?: 'Reminder', id: string, minutesBefore: number, title: string, body?: string | null, date: any, taskId?: string | null, eventId?: string | null }> } };

export type DeleteEventMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteEventMutation = { __typename?: 'Mutation', deleteEvent: boolean };

export type EditEventMutationVariables = Exact<{
  startDate: Scalars['DateTime'];
  endDate?: InputMaybe<Scalars['DateTime']>;
  wholeDay?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  subjectId?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  reminders?: InputMaybe<Array<RemindersInput> | RemindersInput>;
  text?: InputMaybe<Scalars['String']>;
}>;


export type EditEventMutation = { __typename?: 'Mutation', editEvent: { __typename?: 'CalendarEvent', id: string, name: string, text?: string | null, startDate: any, endDate?: any | null, wholeDay: boolean, subject?: { __typename?: 'Subject', id: string, name: string, colorName: string, extraInfo?: string | null } | null, reminders: Array<{ __typename?: 'Reminder', id: string, minutesBefore: number, title: string, body?: string | null, date: any, taskId?: string | null, eventId?: string | null }> } };

export type CreateLessonMutationVariables = Exact<{
  dayNumber: Scalars['Float'];
  lessonTimeId: Scalars['String'];
  subjectId: Scalars['String'];
  id: Scalars['String'];
}>;


export type CreateLessonMutation = { __typename?: 'Mutation', createLesson: { __typename?: 'Lesson', id: string, dayNumber: number, extraInfo?: string | null, subject: { __typename?: 'Subject', id: string, name: string, colorName: string, extraInfo?: string | null }, lessonTime: { __typename?: 'LessonTime', id: string, startTime: string, endTime: string } } };

export type DeleteLessonMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteLessonMutation = { __typename?: 'Mutation', deleteLesson: boolean };

export type EditLessonMutationVariables = Exact<{
  id: Scalars['String'];
  subjectId: Scalars['String'];
  extraInfo?: InputMaybe<Scalars['String']>;
}>;


export type EditLessonMutation = { __typename?: 'Mutation', editLesson: { __typename?: 'Lesson', id: string, dayNumber: number, extraInfo?: string | null, subject: { __typename?: 'Subject', id: string, name: string, colorName: string, extraInfo?: string | null }, lessonTime: { __typename?: 'LessonTime', id: string, startTime: string, endTime: string } } };

export type CreateLessonTimeMutationVariables = Exact<{
  endTime: Scalars['String'];
  startTime: Scalars['String'];
  id: Scalars['String'];
}>;


export type CreateLessonTimeMutation = { __typename?: 'Mutation', createLessonTime: { __typename?: 'LessonTime', id: string, startTime: string, endTime: string } };

export type DeleteLessonTimeMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteLessonTimeMutation = { __typename?: 'Mutation', deleteLessonTime: boolean };

export type EditLessonTimesMutationVariables = Exact<{
  lessonTimes: Array<LessonTimeInput> | LessonTimeInput;
}>;


export type EditLessonTimesMutation = { __typename?: 'Mutation', editLessonTimes: Array<{ __typename?: 'LessonTime', id: string, startTime: string, endTime: string }> };

export type AcceptProjectInviteMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type AcceptProjectInviteMutation = { __typename?: 'Mutation', acceptProjectInvite: { __typename?: 'Project', isAdmin: boolean, name: string, id: string, text?: string | null, tasks: Array<{ __typename?: 'ProjectTask', id: string, name: string, dueDate?: any | null, doDate?: any | null, done: boolean, projectId: string, createdAt: any, updatedAt: any, publicUsers: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> }>, members: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> } };

export type AddMemberToProjectMutationVariables = Exact<{
  projectId: Scalars['String'];
  memberEmail: Scalars['String'];
}>;


export type AddMemberToProjectMutation = { __typename?: 'Mutation', addMemberToProject: { __typename?: 'Project', isAdmin: boolean, name: string, id: string, text?: string | null, tasks: Array<{ __typename?: 'ProjectTask', id: string, name: string, dueDate?: any | null, doDate?: any | null, done: boolean, projectId: string, createdAt: any, updatedAt: any, publicUsers: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> }>, members: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> } };

export type CreateProjectMutationVariables = Exact<{
  name: Scalars['String'];
  memberEmails: Array<Scalars['String']> | Scalars['String'];
  id: Scalars['String'];
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject: { __typename?: 'Project', isAdmin: boolean, name: string, id: string, text?: string | null, tasks: Array<{ __typename?: 'ProjectTask', id: string, name: string, dueDate?: any | null, doDate?: any | null, done: boolean, projectId: string, createdAt: any, updatedAt: any, publicUsers: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> }>, members: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> } };

export type DeclineProjectInviteMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeclineProjectInviteMutation = { __typename?: 'Mutation', declineProjectInvite: boolean };

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteProjectMutation = { __typename?: 'Mutation', deleteProject: boolean };

export type EditProjectMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
  text?: InputMaybe<Scalars['String']>;
}>;


export type EditProjectMutation = { __typename?: 'Mutation', editProject: { __typename?: 'Project', isAdmin: boolean, name: string, id: string, text?: string | null, tasks: Array<{ __typename?: 'ProjectTask', id: string, name: string, dueDate?: any | null, doDate?: any | null, done: boolean, projectId: string, createdAt: any, updatedAt: any, publicUsers: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> }>, members: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> } };

export type MakeMemberAdminMutationVariables = Exact<{
  memberId: Scalars['String'];
  projectId: Scalars['String'];
}>;


export type MakeMemberAdminMutation = { __typename?: 'Mutation', makeMemberAdmin: boolean };

export type RemoveMemberFromProjectMutationVariables = Exact<{
  projectId: Scalars['String'];
  memberId: Scalars['String'];
}>;


export type RemoveMemberFromProjectMutation = { __typename?: 'Mutation', removeMemberFromProject: { __typename?: 'Project', isAdmin: boolean, name: string, id: string, text?: string | null, tasks: Array<{ __typename?: 'ProjectTask', id: string, name: string, dueDate?: any | null, doDate?: any | null, done: boolean, projectId: string, createdAt: any, updatedAt: any, publicUsers: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> }>, members: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> } };

export type AddProjectTaskMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
  dueDate?: InputMaybe<Scalars['DateTime']>;
  doDate?: InputMaybe<Scalars['DateTime']>;
  projectId: Scalars['String'];
}>;


export type AddProjectTaskMutation = { __typename?: 'Mutation', addProjectTask: { __typename?: 'ProjectTask', id: string, name: string, dueDate?: any | null, doDate?: any | null, done: boolean, projectId: string, createdAt: any, updatedAt: any, publicUsers: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> } };

export type AssignMemberMutationVariables = Exact<{
  userId: Scalars['String'];
  taskId: Scalars['String'];
}>;


export type AssignMemberMutation = { __typename?: 'Mutation', assignMember: { __typename?: 'ProjectTask', id: string, name: string, dueDate?: any | null, doDate?: any | null, done: boolean, projectId: string, createdAt: any, updatedAt: any, publicUsers: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> } };

export type DeleteProjectTaskMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteProjectTaskMutation = { __typename?: 'Mutation', deleteProjectTask: boolean };

export type EditProjectTaskMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
  dueDate?: InputMaybe<Scalars['DateTime']>;
  doDate?: InputMaybe<Scalars['DateTime']>;
}>;


export type EditProjectTaskMutation = { __typename?: 'Mutation', editProjectTask: { __typename?: 'ProjectTask', id: string, name: string, dueDate?: any | null, doDate?: any | null, done: boolean, projectId: string, createdAt: any, updatedAt: any, publicUsers: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> } };

export type RemoveAssignedMemberMutationVariables = Exact<{
  userId: Scalars['String'];
  taskId: Scalars['String'];
}>;


export type RemoveAssignedMemberMutation = { __typename?: 'Mutation', removeAssignedMember: { __typename?: 'ProjectTask', id: string, name: string, dueDate?: any | null, doDate?: any | null, done: boolean, projectId: string, createdAt: any, updatedAt: any, publicUsers: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> } };

export type ToggleProjectTaskMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type ToggleProjectTaskMutation = { __typename?: 'Mutation', toggleProjectTask: { __typename?: 'ProjectTask', id: string, name: string, dueDate?: any | null, doDate?: any | null, done: boolean, projectId: string, createdAt: any, updatedAt: any, publicUsers: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> } };

export type SetSettingsMutationVariables = Exact<{
  startOfWeek?: InputMaybe<Scalars['String']>;
  startOfRotationDate?: InputMaybe<Scalars['DateTime']>;
  lengthOfRotation?: InputMaybe<Scalars['Float']>;
  skipWeekends?: InputMaybe<Scalars['Boolean']>;
  darkMode?: InputMaybe<Scalars['Boolean']>;
  sortTasksBy?: InputMaybe<Scalars['String']>;
  showDoDate?: InputMaybe<Scalars['Boolean']>;
  showCompletedTasks?: InputMaybe<Scalars['Boolean']>;
  isFirstTime?: InputMaybe<Scalars['Boolean']>;
}>;


export type SetSettingsMutation = { __typename?: 'Mutation', setSettings: { __typename?: 'Settings', id: string, startOfWeek: string, startOfRotationDate: any, lengthOfRotation: number, skipWeekends: boolean, darkMode: boolean, sortTasksBy: string, showDoDate: boolean, showCompletedTasks: boolean, isFirstTime: boolean } };

export type CreateSubjectMutationVariables = Exact<{
  name: Scalars['String'];
  id: Scalars['String'];
  colorName: Scalars['String'];
  extraInfo?: InputMaybe<Scalars['String']>;
}>;


export type CreateSubjectMutation = { __typename?: 'Mutation', createSubject: { __typename?: 'Subject', id: string, name: string, colorName: string, extraInfo?: string | null } };

export type DeleteSubjectMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteSubjectMutation = { __typename?: 'Mutation', deleteSubject: boolean };

export type EditSubjectMutationVariables = Exact<{
  name: Scalars['String'];
  id: Scalars['String'];
  colorName: Scalars['String'];
  extraInfo?: InputMaybe<Scalars['String']>;
}>;


export type EditSubjectMutation = { __typename?: 'Mutation', editSubject: { __typename?: 'Subject', id: string, name: string, colorName: string, extraInfo?: string | null } };

export type CreateSubtaskMutationVariables = Exact<{
  taskId: Scalars['String'];
  name: Scalars['String'];
  id: Scalars['String'];
}>;


export type CreateSubtaskMutation = { __typename?: 'Mutation', createSubtask: { __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean } };

export type CreateTaskMutationVariables = Exact<{
  name: Scalars['String'];
  subjectId?: InputMaybe<Scalars['String']>;
  dueDate?: InputMaybe<Scalars['DateTime']>;
  doDate?: InputMaybe<Scalars['DateTime']>;
  id: Scalars['String'];
}>;


export type CreateTaskMutation = { __typename?: 'Mutation', createTask: { __typename?: 'Task', id: string, name: string, createdAt: any, done: boolean, updatedAt: any, text?: string | null, dueDate?: any | null, doDate?: any | null, subtasks: Array<{ __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean }>, subject?: { __typename?: 'Subject', id: string, name: string, colorName: string, extraInfo?: string | null } | null, reminders: Array<{ __typename?: 'Reminder', id: string, minutesBefore: number, title: string, body?: string | null, date: any, taskId?: string | null, eventId?: string | null }> } };

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
  reminders?: InputMaybe<Array<RemindersInput> | RemindersInput>;
  subjectId?: InputMaybe<Scalars['String']>;
}>;


export type EditTaskMutation = { __typename?: 'Mutation', editTask: { __typename?: 'Task', id: string, name: string, createdAt: any, done: boolean, updatedAt: any, text?: string | null, dueDate?: any | null, doDate?: any | null, subtasks: Array<{ __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean }>, subject?: { __typename?: 'Subject', id: string, name: string, colorName: string, extraInfo?: string | null } | null, reminders: Array<{ __typename?: 'Reminder', id: string, minutesBefore: number, title: string, body?: string | null, date: any, taskId?: string | null, eventId?: string | null }> } };

export type ToggleSubtaskMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type ToggleSubtaskMutation = { __typename?: 'Mutation', toggleSubtask: { __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean } };

export type ToggleTaskMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type ToggleTaskMutation = { __typename?: 'Mutation', toggleTask: { __typename?: 'Task', id: string, name: string, createdAt: any, done: boolean, updatedAt: any, text?: string | null, dueDate?: any | null, doDate?: any | null, subtasks: Array<{ __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean }>, subject?: { __typename?: 'Subject', id: string, name: string, colorName: string, extraInfo?: string | null } | null, reminders: Array<{ __typename?: 'Reminder', id: string, minutesBefore: number, title: string, body?: string | null, date: any, taskId?: string | null, eventId?: string | null }> } };

export type ChangePasswordMutationVariables = Exact<{
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'ChangePasswordSuccess' } | { __typename?: 'UserFail', errors: Array<{ __typename?: 'UserError', field?: string | null, message: string }> } };

export type DeleteAccountMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteAccountMutation = { __typename?: 'Mutation', deleteAccount: boolean };

export type EditUserMutationVariables = Exact<{
  email?: InputMaybe<Scalars['String']>;
  fullName?: InputMaybe<Scalars['String']>;
}>;


export type EditUserMutation = { __typename?: 'Mutation', editUser: { __typename?: 'User', id: string, email: string, imageURL?: string | null, usesOAuth: boolean, fullName: string, createdAt: any, updatedAt: any, emailVerified: boolean, settings: { __typename?: 'Settings', id: string, startOfWeek: string, startOfRotationDate: any, lengthOfRotation: number, skipWeekends: boolean, darkMode: boolean, sortTasksBy: string, showDoDate: boolean, showCompletedTasks: boolean, isFirstTime: boolean } } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: { __typename?: 'ForgotPasswordSuccess' } | { __typename?: 'UserFail', errors: Array<{ __typename?: 'UserError', field?: string | null, message: string }> } };

export type GoogleSignInMutationVariables = Exact<{
  idToken: Scalars['String'];
}>;


export type GoogleSignInMutation = { __typename?: 'Mutation', googleSignIn: { __typename?: 'UserSuccess', accessToken: string, user: { __typename?: 'User', id: string, email: string, fullName: string } } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserFail', errors: Array<{ __typename?: 'UserError', field?: string | null, message: string }> } | { __typename?: 'UserSuccess', accessToken: string, user: { __typename?: 'User', id: string, email: string, fullName: string } } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserFail', errors: Array<{ __typename?: 'UserError', field?: string | null, message: string }> } | { __typename?: 'UserSuccess', accessToken: string, user: { __typename?: 'User', id: string, email: string, fullName: string } } };

export type ResendVerificationEmailMutationVariables = Exact<{ [key: string]: never; }>;


export type ResendVerificationEmailMutation = { __typename?: 'Mutation', resendVerificationEmail: boolean };

export type GetAllEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllEventsQuery = { __typename?: 'Query', getAllEvents: Array<{ __typename?: 'CalendarEvent', id: string, name: string, text?: string | null, startDate: any, endDate?: any | null, wholeDay: boolean, subject?: { __typename?: 'Subject', id: string, name: string, colorName: string, extraInfo?: string | null } | null, reminders: Array<{ __typename?: 'Reminder', id: string, minutesBefore: number, title: string, body?: string | null, date: any, taskId?: string | null, eventId?: string | null }> }> };

export type GetAllLessonTimesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllLessonTimesQuery = { __typename?: 'Query', getAllLessonTimes: Array<{ __typename?: 'LessonTime', id: string, startTime: string, endTime: string }> };

export type GetAllLessonsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllLessonsQuery = { __typename?: 'Query', getAllLessons: Array<{ __typename?: 'Lesson', id: string, dayNumber: number, extraInfo?: string | null, subject: { __typename?: 'Subject', id: string, name: string, colorName: string, extraInfo?: string | null }, lessonTime: { __typename?: 'LessonTime', id: string, startTime: string, endTime: string } }> };

export type GetAllRemindersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllRemindersQuery = { __typename?: 'Query', getAllReminders: Array<{ __typename?: 'Reminder', id: string, minutesBefore: number, title: string, body?: string | null, date: any, taskId?: string | null, eventId?: string | null }> };

export type GetAllSubjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSubjectsQuery = { __typename?: 'Query', getAllSubjects: Array<{ __typename?: 'Subject', id: string, name: string, colorName: string, extraInfo?: string | null }> };

export type GetAllTasksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTasksQuery = { __typename?: 'Query', getAllTasks: Array<{ __typename?: 'Task', id: string, name: string, createdAt: any, done: boolean, updatedAt: any, text?: string | null, dueDate?: any | null, doDate?: any | null, subtasks: Array<{ __typename?: 'Subtask', name: string, id: string, taskId: string, done: boolean }>, subject?: { __typename?: 'Subject', id: string, name: string, colorName: string, extraInfo?: string | null } | null, reminders: Array<{ __typename?: 'Reminder', id: string, minutesBefore: number, title: string, body?: string | null, date: any, taskId?: string | null, eventId?: string | null }> }> };

export type GetInvitesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInvitesQuery = { __typename?: 'Query', getInvites: Array<{ __typename?: 'Invite', adminName: string, projectName: string, projectId: string }> };

export type GetProjectTasksOfUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectTasksOfUserQuery = { __typename?: 'Query', getProjectTasksOfUser: Array<{ __typename?: 'ProjectTask', id: string, name: string, dueDate?: any | null, doDate?: any | null, done: boolean, projectId: string, createdAt: any, updatedAt: any, project: { __typename?: 'Project', id: string, name: string }, publicUsers: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> }> };

export type GetProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectsQuery = { __typename?: 'Query', getProjects: Array<{ __typename?: 'Project', isAdmin: boolean, name: string, id: string, text?: string | null, tasks: Array<{ __typename?: 'ProjectTask', id: string, name: string, dueDate?: any | null, doDate?: any | null, done: boolean, projectId: string, createdAt: any, updatedAt: any, publicUsers: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> }>, members: Array<{ __typename?: 'PublicUser', name: string, email: string, id: string, userId: string, isAdmin?: boolean | null }> }> };

export type HelloQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQuery = { __typename?: 'Query', hello: string };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, email: string, imageURL?: string | null, usesOAuth: boolean, fullName: string, createdAt: any, updatedAt: any, emailVerified: boolean, settings: { __typename?: 'Settings', id: string, startOfWeek: string, startOfRotationDate: any, lengthOfRotation: number, skipWeekends: boolean, darkMode: boolean, sortTasksBy: string, showDoDate: boolean, showCompletedTasks: boolean, isFirstTime: boolean } } };

export const SettingsFragmentDoc = gql`
    fragment Settings on Settings {
  id
  startOfWeek
  startOfRotationDate
  lengthOfRotation
  skipWeekends
  darkMode
  sortTasksBy
  showDoDate
  showCompletedTasks
  isFirstTime
}
    `;
export const UserFragmentDoc = gql`
    fragment User on User {
  id
  email
  imageURL
  usesOAuth
  fullName
  createdAt
  updatedAt
  emailVerified
  settings {
    ...Settings
  }
}
    ${SettingsFragmentDoc}`;
export const SubjectFragmentDoc = gql`
    fragment Subject on Subject {
  id
  name
  colorName
  extraInfo
}
    `;
export const ReminderFragmentDoc = gql`
    fragment Reminder on Reminder {
  id
  minutesBefore
  title
  body
  date
  taskId
  eventId
}
    `;
export const CalendarEventFragmentDoc = gql`
    fragment CalendarEvent on CalendarEvent {
  id
  name
  text
  startDate
  endDate
  wholeDay
  subject {
    ...Subject
  }
  reminders {
    ...Reminder
  }
}
    ${SubjectFragmentDoc}
${ReminderFragmentDoc}`;
export const InviteFragmentDoc = gql`
    fragment Invite on Invite {
  adminName
  projectName
  projectId
}
    `;
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
  dayNumber
  extraInfo
  subject {
    ...Subject
  }
  lessonTime {
    ...LessonTime
  }
}
    ${SubjectFragmentDoc}
${LessonTimeFragmentDoc}`;
export const PublicUserFragmentDoc = gql`
    fragment PublicUser on PublicUser {
  name
  email
  id
  userId
  isAdmin
}
    `;
export const ProjectTaskFragmentDoc = gql`
    fragment ProjectTask on ProjectTask {
  id
  name
  dueDate
  doDate
  done
  projectId
  createdAt
  updatedAt
  publicUsers {
    ...PublicUser
  }
}
    ${PublicUserFragmentDoc}`;
export const ProjectFragmentDoc = gql`
    fragment Project on Project {
  isAdmin
  name
  id
  text
  tasks {
    ...ProjectTask
  }
  members {
    ...PublicUser
  }
}
    ${ProjectTaskFragmentDoc}
${PublicUserFragmentDoc}`;
export const SimpleProjectFragmentDoc = gql`
    fragment SimpleProject on Project {
  id
  name
}
    `;
export const ProjectTaskWithProjectFragmentDoc = gql`
    fragment ProjectTaskWithProject on ProjectTask {
  id
  name
  dueDate
  doDate
  done
  projectId
  createdAt
  updatedAt
  project {
    ...SimpleProject
  }
  publicUsers {
    ...PublicUser
  }
}
    ${SimpleProjectFragmentDoc}
${PublicUserFragmentDoc}`;
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
  reminders {
    ...Reminder
  }
}
    ${SubtaskFragmentDoc}
${SubjectFragmentDoc}
${ReminderFragmentDoc}`;
export const CreateEventDocument = gql`
    mutation CreateEvent($startDate: DateTime!, $endDate: DateTime, $wholeDay: Boolean, $name: String!, $subjectId: String, $id: String!, $reminders: [RemindersInput!], $text: String) {
  createEvent(
    id: $id
    startDate: $startDate
    endDate: $endDate
    wholeDay: $wholeDay
    name: $name
    subjectId: $subjectId
    reminders: $reminders
    text: $text
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
 *      id: // value for 'id'
 *      reminders: // value for 'reminders'
 *      text: // value for 'text'
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
export const EditEventDocument = gql`
    mutation EditEvent($startDate: DateTime!, $endDate: DateTime, $wholeDay: Boolean, $name: String!, $subjectId: String, $id: String!, $reminders: [RemindersInput!], $text: String) {
  editEvent(
    id: $id
    startDate: $startDate
    endDate: $endDate
    wholeDay: $wholeDay
    name: $name
    subjectId: $subjectId
    reminders: $reminders
    text: $text
  ) {
    ...CalendarEvent
  }
}
    ${CalendarEventFragmentDoc}`;
export type EditEventMutationFn = Apollo.MutationFunction<EditEventMutation, EditEventMutationVariables>;

/**
 * __useEditEventMutation__
 *
 * To run a mutation, you first call `useEditEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editEventMutation, { data, loading, error }] = useEditEventMutation({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *      wholeDay: // value for 'wholeDay'
 *      name: // value for 'name'
 *      subjectId: // value for 'subjectId'
 *      id: // value for 'id'
 *      reminders: // value for 'reminders'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useEditEventMutation(baseOptions?: Apollo.MutationHookOptions<EditEventMutation, EditEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditEventMutation, EditEventMutationVariables>(EditEventDocument, options);
      }
export type EditEventMutationHookResult = ReturnType<typeof useEditEventMutation>;
export type EditEventMutationResult = Apollo.MutationResult<EditEventMutation>;
export type EditEventMutationOptions = Apollo.BaseMutationOptions<EditEventMutation, EditEventMutationVariables>;
export const CreateLessonDocument = gql`
    mutation CreateLesson($dayNumber: Float!, $lessonTimeId: String!, $subjectId: String!, $id: String!) {
  createLesson(
    id: $id
    dayNumber: $dayNumber
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
 *      dayNumber: // value for 'dayNumber'
 *      lessonTimeId: // value for 'lessonTimeId'
 *      subjectId: // value for 'subjectId'
 *      id: // value for 'id'
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
    mutation EditLesson($id: String!, $subjectId: String!, $extraInfo: String) {
  editLesson(id: $id, subjectId: $subjectId, extraInfo: $extraInfo) {
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
 *      extraInfo: // value for 'extraInfo'
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
export const CreateLessonTimeDocument = gql`
    mutation CreateLessonTime($endTime: String!, $startTime: String!, $id: String!) {
  createLessonTime(endTime: $endTime, startTime: $startTime, id: $id) {
    ...LessonTime
  }
}
    ${LessonTimeFragmentDoc}`;
export type CreateLessonTimeMutationFn = Apollo.MutationFunction<CreateLessonTimeMutation, CreateLessonTimeMutationVariables>;

/**
 * __useCreateLessonTimeMutation__
 *
 * To run a mutation, you first call `useCreateLessonTimeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLessonTimeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLessonTimeMutation, { data, loading, error }] = useCreateLessonTimeMutation({
 *   variables: {
 *      endTime: // value for 'endTime'
 *      startTime: // value for 'startTime'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCreateLessonTimeMutation(baseOptions?: Apollo.MutationHookOptions<CreateLessonTimeMutation, CreateLessonTimeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLessonTimeMutation, CreateLessonTimeMutationVariables>(CreateLessonTimeDocument, options);
      }
export type CreateLessonTimeMutationHookResult = ReturnType<typeof useCreateLessonTimeMutation>;
export type CreateLessonTimeMutationResult = Apollo.MutationResult<CreateLessonTimeMutation>;
export type CreateLessonTimeMutationOptions = Apollo.BaseMutationOptions<CreateLessonTimeMutation, CreateLessonTimeMutationVariables>;
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
export const AcceptProjectInviteDocument = gql`
    mutation AcceptProjectInvite($id: String!) {
  acceptProjectInvite(id: $id) {
    ...Project
  }
}
    ${ProjectFragmentDoc}`;
export type AcceptProjectInviteMutationFn = Apollo.MutationFunction<AcceptProjectInviteMutation, AcceptProjectInviteMutationVariables>;

/**
 * __useAcceptProjectInviteMutation__
 *
 * To run a mutation, you first call `useAcceptProjectInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptProjectInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptProjectInviteMutation, { data, loading, error }] = useAcceptProjectInviteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAcceptProjectInviteMutation(baseOptions?: Apollo.MutationHookOptions<AcceptProjectInviteMutation, AcceptProjectInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptProjectInviteMutation, AcceptProjectInviteMutationVariables>(AcceptProjectInviteDocument, options);
      }
export type AcceptProjectInviteMutationHookResult = ReturnType<typeof useAcceptProjectInviteMutation>;
export type AcceptProjectInviteMutationResult = Apollo.MutationResult<AcceptProjectInviteMutation>;
export type AcceptProjectInviteMutationOptions = Apollo.BaseMutationOptions<AcceptProjectInviteMutation, AcceptProjectInviteMutationVariables>;
export const AddMemberToProjectDocument = gql`
    mutation AddMemberToProject($projectId: String!, $memberEmail: String!) {
  addMemberToProject(projectId: $projectId, memberEmail: $memberEmail) {
    ...Project
  }
}
    ${ProjectFragmentDoc}`;
export type AddMemberToProjectMutationFn = Apollo.MutationFunction<AddMemberToProjectMutation, AddMemberToProjectMutationVariables>;

/**
 * __useAddMemberToProjectMutation__
 *
 * To run a mutation, you first call `useAddMemberToProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMemberToProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMemberToProjectMutation, { data, loading, error }] = useAddMemberToProjectMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      memberEmail: // value for 'memberEmail'
 *   },
 * });
 */
export function useAddMemberToProjectMutation(baseOptions?: Apollo.MutationHookOptions<AddMemberToProjectMutation, AddMemberToProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddMemberToProjectMutation, AddMemberToProjectMutationVariables>(AddMemberToProjectDocument, options);
      }
export type AddMemberToProjectMutationHookResult = ReturnType<typeof useAddMemberToProjectMutation>;
export type AddMemberToProjectMutationResult = Apollo.MutationResult<AddMemberToProjectMutation>;
export type AddMemberToProjectMutationOptions = Apollo.BaseMutationOptions<AddMemberToProjectMutation, AddMemberToProjectMutationVariables>;
export const CreateProjectDocument = gql`
    mutation CreateProject($name: String!, $memberEmails: [String!]!, $id: String!) {
  createProject(name: $name, memberEmails: $memberEmails, id: $id) {
    ...Project
  }
}
    ${ProjectFragmentDoc}`;
export type CreateProjectMutationFn = Apollo.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      name: // value for 'name'
 *      memberEmails: // value for 'memberEmails'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCreateProjectMutation(baseOptions?: Apollo.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, options);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
export const DeclineProjectInviteDocument = gql`
    mutation DeclineProjectInvite($id: String!) {
  declineProjectInvite(id: $id)
}
    `;
export type DeclineProjectInviteMutationFn = Apollo.MutationFunction<DeclineProjectInviteMutation, DeclineProjectInviteMutationVariables>;

/**
 * __useDeclineProjectInviteMutation__
 *
 * To run a mutation, you first call `useDeclineProjectInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeclineProjectInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [declineProjectInviteMutation, { data, loading, error }] = useDeclineProjectInviteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeclineProjectInviteMutation(baseOptions?: Apollo.MutationHookOptions<DeclineProjectInviteMutation, DeclineProjectInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeclineProjectInviteMutation, DeclineProjectInviteMutationVariables>(DeclineProjectInviteDocument, options);
      }
export type DeclineProjectInviteMutationHookResult = ReturnType<typeof useDeclineProjectInviteMutation>;
export type DeclineProjectInviteMutationResult = Apollo.MutationResult<DeclineProjectInviteMutation>;
export type DeclineProjectInviteMutationOptions = Apollo.BaseMutationOptions<DeclineProjectInviteMutation, DeclineProjectInviteMutationVariables>;
export const DeleteProjectDocument = gql`
    mutation DeleteProject($id: String!) {
  deleteProject(id: $id)
}
    `;
export type DeleteProjectMutationFn = Apollo.MutationFunction<DeleteProjectMutation, DeleteProjectMutationVariables>;

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMutation, { data, loading, error }] = useDeleteProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectMutation, DeleteProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, options);
      }
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = Apollo.MutationResult<DeleteProjectMutation>;
export type DeleteProjectMutationOptions = Apollo.BaseMutationOptions<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const EditProjectDocument = gql`
    mutation EditProject($id: String!, $name: String!, $text: String) {
  editProject(id: $id, name: $name, text: $text) {
    ...Project
  }
}
    ${ProjectFragmentDoc}`;
export type EditProjectMutationFn = Apollo.MutationFunction<EditProjectMutation, EditProjectMutationVariables>;

/**
 * __useEditProjectMutation__
 *
 * To run a mutation, you first call `useEditProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editProjectMutation, { data, loading, error }] = useEditProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useEditProjectMutation(baseOptions?: Apollo.MutationHookOptions<EditProjectMutation, EditProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditProjectMutation, EditProjectMutationVariables>(EditProjectDocument, options);
      }
export type EditProjectMutationHookResult = ReturnType<typeof useEditProjectMutation>;
export type EditProjectMutationResult = Apollo.MutationResult<EditProjectMutation>;
export type EditProjectMutationOptions = Apollo.BaseMutationOptions<EditProjectMutation, EditProjectMutationVariables>;
export const MakeMemberAdminDocument = gql`
    mutation MakeMemberAdmin($memberId: String!, $projectId: String!) {
  makeMemberAdmin(memberId: $memberId, projectId: $projectId)
}
    `;
export type MakeMemberAdminMutationFn = Apollo.MutationFunction<MakeMemberAdminMutation, MakeMemberAdminMutationVariables>;

/**
 * __useMakeMemberAdminMutation__
 *
 * To run a mutation, you first call `useMakeMemberAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMakeMemberAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [makeMemberAdminMutation, { data, loading, error }] = useMakeMemberAdminMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useMakeMemberAdminMutation(baseOptions?: Apollo.MutationHookOptions<MakeMemberAdminMutation, MakeMemberAdminMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MakeMemberAdminMutation, MakeMemberAdminMutationVariables>(MakeMemberAdminDocument, options);
      }
export type MakeMemberAdminMutationHookResult = ReturnType<typeof useMakeMemberAdminMutation>;
export type MakeMemberAdminMutationResult = Apollo.MutationResult<MakeMemberAdminMutation>;
export type MakeMemberAdminMutationOptions = Apollo.BaseMutationOptions<MakeMemberAdminMutation, MakeMemberAdminMutationVariables>;
export const RemoveMemberFromProjectDocument = gql`
    mutation removeMemberFromProject($projectId: String!, $memberId: String!) {
  removeMemberFromProject(projectId: $projectId, memberId: $memberId) {
    ...Project
  }
}
    ${ProjectFragmentDoc}`;
export type RemoveMemberFromProjectMutationFn = Apollo.MutationFunction<RemoveMemberFromProjectMutation, RemoveMemberFromProjectMutationVariables>;

/**
 * __useRemoveMemberFromProjectMutation__
 *
 * To run a mutation, you first call `useRemoveMemberFromProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveMemberFromProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeMemberFromProjectMutation, { data, loading, error }] = useRemoveMemberFromProjectMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useRemoveMemberFromProjectMutation(baseOptions?: Apollo.MutationHookOptions<RemoveMemberFromProjectMutation, RemoveMemberFromProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveMemberFromProjectMutation, RemoveMemberFromProjectMutationVariables>(RemoveMemberFromProjectDocument, options);
      }
export type RemoveMemberFromProjectMutationHookResult = ReturnType<typeof useRemoveMemberFromProjectMutation>;
export type RemoveMemberFromProjectMutationResult = Apollo.MutationResult<RemoveMemberFromProjectMutation>;
export type RemoveMemberFromProjectMutationOptions = Apollo.BaseMutationOptions<RemoveMemberFromProjectMutation, RemoveMemberFromProjectMutationVariables>;
export const AddProjectTaskDocument = gql`
    mutation AddProjectTask($id: String!, $name: String!, $dueDate: DateTime, $doDate: DateTime, $projectId: String!) {
  addProjectTask(
    name: $name
    dueDate: $dueDate
    projectId: $projectId
    doDate: $doDate
    id: $id
  ) {
    ...ProjectTask
  }
}
    ${ProjectTaskFragmentDoc}`;
export type AddProjectTaskMutationFn = Apollo.MutationFunction<AddProjectTaskMutation, AddProjectTaskMutationVariables>;

/**
 * __useAddProjectTaskMutation__
 *
 * To run a mutation, you first call `useAddProjectTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddProjectTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addProjectTaskMutation, { data, loading, error }] = useAddProjectTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      dueDate: // value for 'dueDate'
 *      doDate: // value for 'doDate'
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useAddProjectTaskMutation(baseOptions?: Apollo.MutationHookOptions<AddProjectTaskMutation, AddProjectTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddProjectTaskMutation, AddProjectTaskMutationVariables>(AddProjectTaskDocument, options);
      }
export type AddProjectTaskMutationHookResult = ReturnType<typeof useAddProjectTaskMutation>;
export type AddProjectTaskMutationResult = Apollo.MutationResult<AddProjectTaskMutation>;
export type AddProjectTaskMutationOptions = Apollo.BaseMutationOptions<AddProjectTaskMutation, AddProjectTaskMutationVariables>;
export const AssignMemberDocument = gql`
    mutation AssignMember($userId: String!, $taskId: String!) {
  assignMember(userId: $userId, taskId: $taskId) {
    ...ProjectTask
  }
}
    ${ProjectTaskFragmentDoc}`;
export type AssignMemberMutationFn = Apollo.MutationFunction<AssignMemberMutation, AssignMemberMutationVariables>;

/**
 * __useAssignMemberMutation__
 *
 * To run a mutation, you first call `useAssignMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignMemberMutation, { data, loading, error }] = useAssignMemberMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      taskId: // value for 'taskId'
 *   },
 * });
 */
export function useAssignMemberMutation(baseOptions?: Apollo.MutationHookOptions<AssignMemberMutation, AssignMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AssignMemberMutation, AssignMemberMutationVariables>(AssignMemberDocument, options);
      }
export type AssignMemberMutationHookResult = ReturnType<typeof useAssignMemberMutation>;
export type AssignMemberMutationResult = Apollo.MutationResult<AssignMemberMutation>;
export type AssignMemberMutationOptions = Apollo.BaseMutationOptions<AssignMemberMutation, AssignMemberMutationVariables>;
export const DeleteProjectTaskDocument = gql`
    mutation DeleteProjectTask($id: String!) {
  deleteProjectTask(id: $id)
}
    `;
export type DeleteProjectTaskMutationFn = Apollo.MutationFunction<DeleteProjectTaskMutation, DeleteProjectTaskMutationVariables>;

/**
 * __useDeleteProjectTaskMutation__
 *
 * To run a mutation, you first call `useDeleteProjectTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectTaskMutation, { data, loading, error }] = useDeleteProjectTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProjectTaskMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectTaskMutation, DeleteProjectTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProjectTaskMutation, DeleteProjectTaskMutationVariables>(DeleteProjectTaskDocument, options);
      }
export type DeleteProjectTaskMutationHookResult = ReturnType<typeof useDeleteProjectTaskMutation>;
export type DeleteProjectTaskMutationResult = Apollo.MutationResult<DeleteProjectTaskMutation>;
export type DeleteProjectTaskMutationOptions = Apollo.BaseMutationOptions<DeleteProjectTaskMutation, DeleteProjectTaskMutationVariables>;
export const EditProjectTaskDocument = gql`
    mutation EditProjectTask($id: String!, $name: String!, $dueDate: DateTime, $doDate: DateTime) {
  editProjectTask(id: $id, name: $name, dueDate: $dueDate, doDate: $doDate) {
    ...ProjectTask
  }
}
    ${ProjectTaskFragmentDoc}`;
export type EditProjectTaskMutationFn = Apollo.MutationFunction<EditProjectTaskMutation, EditProjectTaskMutationVariables>;

/**
 * __useEditProjectTaskMutation__
 *
 * To run a mutation, you first call `useEditProjectTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditProjectTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editProjectTaskMutation, { data, loading, error }] = useEditProjectTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      dueDate: // value for 'dueDate'
 *      doDate: // value for 'doDate'
 *   },
 * });
 */
export function useEditProjectTaskMutation(baseOptions?: Apollo.MutationHookOptions<EditProjectTaskMutation, EditProjectTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditProjectTaskMutation, EditProjectTaskMutationVariables>(EditProjectTaskDocument, options);
      }
export type EditProjectTaskMutationHookResult = ReturnType<typeof useEditProjectTaskMutation>;
export type EditProjectTaskMutationResult = Apollo.MutationResult<EditProjectTaskMutation>;
export type EditProjectTaskMutationOptions = Apollo.BaseMutationOptions<EditProjectTaskMutation, EditProjectTaskMutationVariables>;
export const RemoveAssignedMemberDocument = gql`
    mutation RemoveAssignedMember($userId: String!, $taskId: String!) {
  removeAssignedMember(userId: $userId, taskId: $taskId) {
    ...ProjectTask
  }
}
    ${ProjectTaskFragmentDoc}`;
export type RemoveAssignedMemberMutationFn = Apollo.MutationFunction<RemoveAssignedMemberMutation, RemoveAssignedMemberMutationVariables>;

/**
 * __useRemoveAssignedMemberMutation__
 *
 * To run a mutation, you first call `useRemoveAssignedMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveAssignedMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeAssignedMemberMutation, { data, loading, error }] = useRemoveAssignedMemberMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      taskId: // value for 'taskId'
 *   },
 * });
 */
export function useRemoveAssignedMemberMutation(baseOptions?: Apollo.MutationHookOptions<RemoveAssignedMemberMutation, RemoveAssignedMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveAssignedMemberMutation, RemoveAssignedMemberMutationVariables>(RemoveAssignedMemberDocument, options);
      }
export type RemoveAssignedMemberMutationHookResult = ReturnType<typeof useRemoveAssignedMemberMutation>;
export type RemoveAssignedMemberMutationResult = Apollo.MutationResult<RemoveAssignedMemberMutation>;
export type RemoveAssignedMemberMutationOptions = Apollo.BaseMutationOptions<RemoveAssignedMemberMutation, RemoveAssignedMemberMutationVariables>;
export const ToggleProjectTaskDocument = gql`
    mutation ToggleProjectTask($id: String!) {
  toggleProjectTask(id: $id) {
    ...ProjectTask
  }
}
    ${ProjectTaskFragmentDoc}`;
export type ToggleProjectTaskMutationFn = Apollo.MutationFunction<ToggleProjectTaskMutation, ToggleProjectTaskMutationVariables>;

/**
 * __useToggleProjectTaskMutation__
 *
 * To run a mutation, you first call `useToggleProjectTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleProjectTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleProjectTaskMutation, { data, loading, error }] = useToggleProjectTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useToggleProjectTaskMutation(baseOptions?: Apollo.MutationHookOptions<ToggleProjectTaskMutation, ToggleProjectTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleProjectTaskMutation, ToggleProjectTaskMutationVariables>(ToggleProjectTaskDocument, options);
      }
export type ToggleProjectTaskMutationHookResult = ReturnType<typeof useToggleProjectTaskMutation>;
export type ToggleProjectTaskMutationResult = Apollo.MutationResult<ToggleProjectTaskMutation>;
export type ToggleProjectTaskMutationOptions = Apollo.BaseMutationOptions<ToggleProjectTaskMutation, ToggleProjectTaskMutationVariables>;
export const SetSettingsDocument = gql`
    mutation SetSettings($startOfWeek: String, $startOfRotationDate: DateTime, $lengthOfRotation: Float, $skipWeekends: Boolean, $darkMode: Boolean, $sortTasksBy: String, $showDoDate: Boolean, $showCompletedTasks: Boolean, $isFirstTime: Boolean) {
  setSettings(
    startOfWeek: $startOfWeek
    startOfRotationDate: $startOfRotationDate
    lengthOfRotation: $lengthOfRotation
    skipWeekends: $skipWeekends
    darkMode: $darkMode
    sortTasksBy: $sortTasksBy
    showDoDate: $showDoDate
    showCompletedTasks: $showCompletedTasks
    isFirstTime: $isFirstTime
  ) {
    ...Settings
  }
}
    ${SettingsFragmentDoc}`;
export type SetSettingsMutationFn = Apollo.MutationFunction<SetSettingsMutation, SetSettingsMutationVariables>;

/**
 * __useSetSettingsMutation__
 *
 * To run a mutation, you first call `useSetSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setSettingsMutation, { data, loading, error }] = useSetSettingsMutation({
 *   variables: {
 *      startOfWeek: // value for 'startOfWeek'
 *      startOfRotationDate: // value for 'startOfRotationDate'
 *      lengthOfRotation: // value for 'lengthOfRotation'
 *      skipWeekends: // value for 'skipWeekends'
 *      darkMode: // value for 'darkMode'
 *      sortTasksBy: // value for 'sortTasksBy'
 *      showDoDate: // value for 'showDoDate'
 *      showCompletedTasks: // value for 'showCompletedTasks'
 *      isFirstTime: // value for 'isFirstTime'
 *   },
 * });
 */
export function useSetSettingsMutation(baseOptions?: Apollo.MutationHookOptions<SetSettingsMutation, SetSettingsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetSettingsMutation, SetSettingsMutationVariables>(SetSettingsDocument, options);
      }
export type SetSettingsMutationHookResult = ReturnType<typeof useSetSettingsMutation>;
export type SetSettingsMutationResult = Apollo.MutationResult<SetSettingsMutation>;
export type SetSettingsMutationOptions = Apollo.BaseMutationOptions<SetSettingsMutation, SetSettingsMutationVariables>;
export const CreateSubjectDocument = gql`
    mutation CreateSubject($name: String!, $id: String!, $colorName: String!, $extraInfo: String) {
  createSubject(
    name: $name
    id: $id
    colorName: $colorName
    extraInfo: $extraInfo
  ) {
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
 *      id: // value for 'id'
 *      colorName: // value for 'colorName'
 *      extraInfo: // value for 'extraInfo'
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
export const DeleteSubjectDocument = gql`
    mutation DeleteSubject($id: String!) {
  deleteSubject(id: $id)
}
    `;
export type DeleteSubjectMutationFn = Apollo.MutationFunction<DeleteSubjectMutation, DeleteSubjectMutationVariables>;

/**
 * __useDeleteSubjectMutation__
 *
 * To run a mutation, you first call `useDeleteSubjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSubjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSubjectMutation, { data, loading, error }] = useDeleteSubjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSubjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSubjectMutation, DeleteSubjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSubjectMutation, DeleteSubjectMutationVariables>(DeleteSubjectDocument, options);
      }
export type DeleteSubjectMutationHookResult = ReturnType<typeof useDeleteSubjectMutation>;
export type DeleteSubjectMutationResult = Apollo.MutationResult<DeleteSubjectMutation>;
export type DeleteSubjectMutationOptions = Apollo.BaseMutationOptions<DeleteSubjectMutation, DeleteSubjectMutationVariables>;
export const EditSubjectDocument = gql`
    mutation EditSubject($name: String!, $id: String!, $colorName: String!, $extraInfo: String) {
  editSubject(name: $name, id: $id, colorName: $colorName, extraInfo: $extraInfo) {
    ...Subject
  }
}
    ${SubjectFragmentDoc}`;
export type EditSubjectMutationFn = Apollo.MutationFunction<EditSubjectMutation, EditSubjectMutationVariables>;

/**
 * __useEditSubjectMutation__
 *
 * To run a mutation, you first call `useEditSubjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditSubjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editSubjectMutation, { data, loading, error }] = useEditSubjectMutation({
 *   variables: {
 *      name: // value for 'name'
 *      id: // value for 'id'
 *      colorName: // value for 'colorName'
 *      extraInfo: // value for 'extraInfo'
 *   },
 * });
 */
export function useEditSubjectMutation(baseOptions?: Apollo.MutationHookOptions<EditSubjectMutation, EditSubjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditSubjectMutation, EditSubjectMutationVariables>(EditSubjectDocument, options);
      }
export type EditSubjectMutationHookResult = ReturnType<typeof useEditSubjectMutation>;
export type EditSubjectMutationResult = Apollo.MutationResult<EditSubjectMutation>;
export type EditSubjectMutationOptions = Apollo.BaseMutationOptions<EditSubjectMutation, EditSubjectMutationVariables>;
export const CreateSubtaskDocument = gql`
    mutation CreateSubtask($taskId: String!, $name: String!, $id: String!) {
  createSubtask(taskId: $taskId, name: $name, id: $id) {
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
 *      id: // value for 'id'
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
    mutation CreateTask($name: String!, $subjectId: String, $dueDate: DateTime, $doDate: DateTime, $id: String!) {
  createTask(
    id: $id
    name: $name
    subjectId: $subjectId
    dueDate: $dueDate
    doDate: $doDate
  ) {
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
 *      doDate: // value for 'doDate'
 *      id: // value for 'id'
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
    mutation EditTask($id: String!, $name: String!, $text: String, $dueDate: DateTime, $doDate: DateTime, $reminders: [RemindersInput!], $subjectId: String) {
  editTask(
    id: $id
    name: $name
    text: $text
    dueDate: $dueDate
    doDate: $doDate
    reminders: $reminders
    subjectId: $subjectId
  ) {
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
 *      reminders: // value for 'reminders'
 *      subjectId: // value for 'subjectId'
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
export const ChangePasswordDocument = gql`
    mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
  changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
    ... on UserFail {
      errors {
        field
        message
      }
    }
  }
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      oldPassword: // value for 'oldPassword'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const DeleteAccountDocument = gql`
    mutation DeleteAccount {
  deleteAccount
}
    `;
export type DeleteAccountMutationFn = Apollo.MutationFunction<DeleteAccountMutation, DeleteAccountMutationVariables>;

/**
 * __useDeleteAccountMutation__
 *
 * To run a mutation, you first call `useDeleteAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAccountMutation, { data, loading, error }] = useDeleteAccountMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteAccountMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAccountMutation, DeleteAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAccountMutation, DeleteAccountMutationVariables>(DeleteAccountDocument, options);
      }
export type DeleteAccountMutationHookResult = ReturnType<typeof useDeleteAccountMutation>;
export type DeleteAccountMutationResult = Apollo.MutationResult<DeleteAccountMutation>;
export type DeleteAccountMutationOptions = Apollo.BaseMutationOptions<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const EditUserDocument = gql`
    mutation EditUser($email: String, $fullName: String) {
  editUser(email: $email, fullName: $fullName) {
    ...User
  }
}
    ${UserFragmentDoc}`;
export type EditUserMutationFn = Apollo.MutationFunction<EditUserMutation, EditUserMutationVariables>;

/**
 * __useEditUserMutation__
 *
 * To run a mutation, you first call `useEditUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editUserMutation, { data, loading, error }] = useEditUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *      fullName: // value for 'fullName'
 *   },
 * });
 */
export function useEditUserMutation(baseOptions?: Apollo.MutationHookOptions<EditUserMutation, EditUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditUserMutation, EditUserMutationVariables>(EditUserDocument, options);
      }
export type EditUserMutationHookResult = ReturnType<typeof useEditUserMutation>;
export type EditUserMutationResult = Apollo.MutationResult<EditUserMutation>;
export type EditUserMutationOptions = Apollo.BaseMutationOptions<EditUserMutation, EditUserMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    ... on UserFail {
      errors {
        field
        message
      }
    }
  }
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const GoogleSignInDocument = gql`
    mutation GoogleSignIn($idToken: String!) {
  googleSignIn(idToken: $idToken) {
    user {
      id
      email
      fullName
    }
    accessToken
  }
}
    `;
export type GoogleSignInMutationFn = Apollo.MutationFunction<GoogleSignInMutation, GoogleSignInMutationVariables>;

/**
 * __useGoogleSignInMutation__
 *
 * To run a mutation, you first call `useGoogleSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGoogleSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [googleSignInMutation, { data, loading, error }] = useGoogleSignInMutation({
 *   variables: {
 *      idToken: // value for 'idToken'
 *   },
 * });
 */
export function useGoogleSignInMutation(baseOptions?: Apollo.MutationHookOptions<GoogleSignInMutation, GoogleSignInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GoogleSignInMutation, GoogleSignInMutationVariables>(GoogleSignInDocument, options);
      }
export type GoogleSignInMutationHookResult = ReturnType<typeof useGoogleSignInMutation>;
export type GoogleSignInMutationResult = Apollo.MutationResult<GoogleSignInMutation>;
export type GoogleSignInMutationOptions = Apollo.BaseMutationOptions<GoogleSignInMutation, GoogleSignInMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    ... on UserSuccess {
      accessToken
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
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!, $name: String!) {
  register(email: $email, password: $password, name: $name) {
    ... on UserSuccess {
      accessToken
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
export const ResendVerificationEmailDocument = gql`
    mutation ResendVerificationEmail {
  resendVerificationEmail
}
    `;
export type ResendVerificationEmailMutationFn = Apollo.MutationFunction<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>;

/**
 * __useResendVerificationEmailMutation__
 *
 * To run a mutation, you first call `useResendVerificationEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendVerificationEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendVerificationEmailMutation, { data, loading, error }] = useResendVerificationEmailMutation({
 *   variables: {
 *   },
 * });
 */
export function useResendVerificationEmailMutation(baseOptions?: Apollo.MutationHookOptions<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>(ResendVerificationEmailDocument, options);
      }
export type ResendVerificationEmailMutationHookResult = ReturnType<typeof useResendVerificationEmailMutation>;
export type ResendVerificationEmailMutationResult = Apollo.MutationResult<ResendVerificationEmailMutation>;
export type ResendVerificationEmailMutationOptions = Apollo.BaseMutationOptions<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>;
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
export const GetAllRemindersDocument = gql`
    query GetAllReminders {
  getAllReminders {
    ...Reminder
  }
}
    ${ReminderFragmentDoc}`;

/**
 * __useGetAllRemindersQuery__
 *
 * To run a query within a React component, call `useGetAllRemindersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllRemindersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllRemindersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllRemindersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllRemindersQuery, GetAllRemindersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllRemindersQuery, GetAllRemindersQueryVariables>(GetAllRemindersDocument, options);
      }
export function useGetAllRemindersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllRemindersQuery, GetAllRemindersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllRemindersQuery, GetAllRemindersQueryVariables>(GetAllRemindersDocument, options);
        }
export type GetAllRemindersQueryHookResult = ReturnType<typeof useGetAllRemindersQuery>;
export type GetAllRemindersLazyQueryHookResult = ReturnType<typeof useGetAllRemindersLazyQuery>;
export type GetAllRemindersQueryResult = Apollo.QueryResult<GetAllRemindersQuery, GetAllRemindersQueryVariables>;
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
export const GetInvitesDocument = gql`
    query GetInvites {
  getInvites {
    ...Invite
  }
}
    ${InviteFragmentDoc}`;

/**
 * __useGetInvitesQuery__
 *
 * To run a query within a React component, call `useGetInvitesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInvitesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInvitesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetInvitesQuery(baseOptions?: Apollo.QueryHookOptions<GetInvitesQuery, GetInvitesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInvitesQuery, GetInvitesQueryVariables>(GetInvitesDocument, options);
      }
export function useGetInvitesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInvitesQuery, GetInvitesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInvitesQuery, GetInvitesQueryVariables>(GetInvitesDocument, options);
        }
export type GetInvitesQueryHookResult = ReturnType<typeof useGetInvitesQuery>;
export type GetInvitesLazyQueryHookResult = ReturnType<typeof useGetInvitesLazyQuery>;
export type GetInvitesQueryResult = Apollo.QueryResult<GetInvitesQuery, GetInvitesQueryVariables>;
export const GetProjectTasksOfUserDocument = gql`
    query GetProjectTasksOfUser {
  getProjectTasksOfUser {
    ...ProjectTaskWithProject
  }
}
    ${ProjectTaskWithProjectFragmentDoc}`;

/**
 * __useGetProjectTasksOfUserQuery__
 *
 * To run a query within a React component, call `useGetProjectTasksOfUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectTasksOfUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectTasksOfUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProjectTasksOfUserQuery(baseOptions?: Apollo.QueryHookOptions<GetProjectTasksOfUserQuery, GetProjectTasksOfUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProjectTasksOfUserQuery, GetProjectTasksOfUserQueryVariables>(GetProjectTasksOfUserDocument, options);
      }
export function useGetProjectTasksOfUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectTasksOfUserQuery, GetProjectTasksOfUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProjectTasksOfUserQuery, GetProjectTasksOfUserQueryVariables>(GetProjectTasksOfUserDocument, options);
        }
export type GetProjectTasksOfUserQueryHookResult = ReturnType<typeof useGetProjectTasksOfUserQuery>;
export type GetProjectTasksOfUserLazyQueryHookResult = ReturnType<typeof useGetProjectTasksOfUserLazyQuery>;
export type GetProjectTasksOfUserQueryResult = Apollo.QueryResult<GetProjectTasksOfUserQuery, GetProjectTasksOfUserQueryVariables>;
export const GetProjectsDocument = gql`
    query GetProjects {
  getProjects {
    ...Project
  }
}
    ${ProjectFragmentDoc}`;

/**
 * __useGetProjectsQuery__
 *
 * To run a query within a React component, call `useGetProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProjectsQuery(baseOptions?: Apollo.QueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, options);
      }
export function useGetProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, options);
        }
export type GetProjectsQueryHookResult = ReturnType<typeof useGetProjectsQuery>;
export type GetProjectsLazyQueryHookResult = ReturnType<typeof useGetProjectsLazyQuery>;
export type GetProjectsQueryResult = Apollo.QueryResult<GetProjectsQuery, GetProjectsQueryVariables>;
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
    ...User
  }
}
    ${UserFragmentDoc}`;

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