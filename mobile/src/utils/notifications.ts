import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

export const reminderChannelId = 'reminders';

let channel;

export const createRemindersChannel = async () => {
  channel = await notifee.createChannel({
    id: reminderChannelId,
    name: 'Reminders',
    sound: 'default',
    importance: AndroidImportance.HIGH,
  });
};

interface SendNotificationProps {
  title: string;
  body?: string;
}

export const sendNotification = async ({
  title,
  body,
}: SendNotificationProps) => {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: title,
    body: body,
    android: {
      channelId,
      smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
};

interface SetNotificationTriggerProps extends SendNotificationProps {
  date: Date;
  id?: string;
}

export const setNotificationTrigger = async ({
  title,
  body,
  date,
  id,
}: SetNotificationTriggerProps) => {
  await notifee.requestPermission();

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
  };

  return await notifee.createTriggerNotification(
    {
      id,
      title: title,
      body: body,
      android: {
        channelId: reminderChannelId,
      },
    },
    trigger,
  );
};
