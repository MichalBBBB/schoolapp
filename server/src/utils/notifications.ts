import admin from "firebase-admin";
export const sendRefreshNotification = () => {
  admin.messaging().send({
    token: user?.tokens[8]!,
    notification: {
      title: "New Notification",
      body: "It works!",
    },
    apns: {
      headers: {
        "apns-push-type": "background",
        "apns-priority": "5",
        "apns-topic": "app.dayto.dayto",
      },
      payload: {
        aps: {
          sound: "default",
          contentAvailable: true,
        },
      },
    },
    android: {
      priority: "high",
    },
  });
};
