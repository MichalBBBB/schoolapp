import {
  GetAllEventsDocument,
  GetAllLessonsDocument,
  GetAllLessonTimesDocument,
  GetAllRemindersDocument,
  GetAllSubjectsDocument,
  GetAllTasksDocument,
  GetInvitesDocument,
  GetProjectsDocument,
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
  MeDocument,
];
