import admin from "firebase-admin";

async function sendMessage(
  token: string,
  data: { [key: string]: string },
  notificationBody: string
) {
  await admin.messaging().send({
    token,
    data,
    notification: {
      body: notificationBody,
      title: "NeoKaotik",
    },
  });
}

export { sendMessage };
