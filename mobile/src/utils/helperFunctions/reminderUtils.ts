import {
  GetAllRemindersDocument,
  GetAllRemindersQuery,
} from '../../generated/graphql';
import notifee from '@notifee/react-native';
import {setNotificationTrigger} from '../services/notifications';
import {ApolloClient} from '@apollo/client';
import dayjs from 'dayjs';

export const setRemindersFromApollo = async (client: ApolloClient<any>) => {
  const notificationIds = await notifee.getTriggerNotificationIds();
  const reminders = await client.query<GetAllRemindersQuery>({
    query: GetAllRemindersDocument,
  });
  const reminderIds = reminders.data.getAllReminders.map(item => item.id);
  const idsToBeDeleted = notificationIds.filter(
    item => !reminderIds.includes(item),
  );
  const idsToBeCreated = reminderIds.filter(
    item => !notificationIds.includes(item),
  );
  idsToBeDeleted.forEach(item => {
    notifee.cancelNotification(item);
  });
  reminders.data.getAllReminders
    .filter(item => idsToBeCreated.includes(item.id))
    .filter(item => dayjs(item.date).isAfter(dayjs()))
    .forEach(item => {
      console.log(item.date);
      setNotificationTrigger({
        title: item.title,
        body: item.body || undefined,
        id: item.id,
        date: new Date(item.date),
      });
    });
};
