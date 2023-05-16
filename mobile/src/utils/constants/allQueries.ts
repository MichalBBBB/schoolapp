import {
  GetAllEventsDocument,
  GetAllLessonsDocument,
  GetAllRemindersDocument,
  GetAllSchedulesDocument,
  GetAllSubjectsDocument,
  GetAllTasksDocument,
  GetInvitesDocument,
  GetProjectsDocument,
  GetProjectTasksOfUserDocument,
  MeDocument,
} from '../../generated/graphql';

export const allQueries = [
  GetAllEventsDocument,
  GetAllLessonsDocument,
  GetAllSubjectsDocument,
  GetAllTasksDocument,
  GetInvitesDocument,
  GetProjectsDocument,
  GetAllRemindersDocument,
  GetProjectTasksOfUserDocument,
  GetAllSchedulesDocument,
  MeDocument,
];
