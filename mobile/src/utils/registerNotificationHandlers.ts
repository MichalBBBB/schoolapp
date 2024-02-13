import dayjs from 'dayjs';
import {persistentQueueLink} from '../App';
import {GetAllTasksQuery, GetAllTasksDocument} from '../generated/graphql';
import {createApolloClient} from './createApolloClient';
import {setBadgeCount} from './notifications';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

export const handler = async (
  message: FirebaseMessagingTypes.RemoteMessage,
) => {
  // if received notification to refresh badge, check if it's start of the day
  // if yes, set the badge number
  if (message.data && message.data.action == 'refresh') {
    if (dayjs().get('hours') == 0) {
      const client = await createApolloClient(persistentQueueLink);
      const tasks = client.readQuery<GetAllTasksQuery>({
        query: GetAllTasksDocument,
      });

      if (tasks) {
        let number = 0;

        tasks.getAllTasks.forEach(task => {
          if (dayjs(task.doDate).isSame(dayjs(), 'date')) {
            number += 1;
          }
        });
        setBadgeCount(number);
      }
    }
  }
};

export const registerNotificationHandlers = () => {
  messaging().setBackgroundMessageHandler(handler);
};
