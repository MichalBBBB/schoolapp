import {
  GetAllEventsDocument,
  GetAllLessonsDocument,
  GetAllLessonTimesDocument,
  GetAllRemindersDocument,
  GetAllSubjectsDocument,
  GetAllTasksDocument,
  GetInvitesDocument,
  GetProjectsDocument,
  GetProjectTasksOfUserDocument,
  MeDocument,
} from '../generated/graphql';

export const allQueries = [
  GetAllEventsDocument,
  GetAllLessonsDocument,
  GetAllLessonTimesDocument,
  GetAllSubjectsDocument,
  GetAllTasksDocument,
  GetInvitesDocument,
  GetProjectsDocument,
  GetAllRemindersDocument,
  GetProjectTasksOfUserDocument,
  MeDocument,
];
