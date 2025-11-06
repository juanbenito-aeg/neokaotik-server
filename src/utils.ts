import admin from "firebase-admin";

async function sendMessage(
  token: string,
  data: { [key: string]: string },
  notificationBody: string,
  notificationTitle: string
) {
  await admin.messaging().send({
    token,
    data,
    notification: {
      body: notificationBody,
      title: notificationTitle,
    },
  });
}

export { sendMessage };
