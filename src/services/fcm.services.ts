import admin from "firebase-admin";

async function sendMessageToOneOrMoreRecipients(
  tokenOrTokens: string | string[],
  data: { [key: string]: string },
  notificationBody: string,
  notificationTitle: string
) {
  const messageChunkForAnyNumberOfRecipients = {
    data,
    notification: {
      body: notificationBody,
      title: notificationTitle,
    },
  };

  if (typeof tokenOrTokens === "string") {
    await admin.messaging().send({
      token: tokenOrTokens,
      ...messageChunkForAnyNumberOfRecipients,
    });
  } else {
    await admin.messaging().sendEachForMulticast({
      tokens: tokenOrTokens,
      ...messageChunkForAnyNumberOfRecipients,
    });
  }
}

export { sendMessageToOneOrMoreRecipients };
