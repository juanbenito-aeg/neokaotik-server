import { client } from "../..";
import { MqttTopics } from "../../constants";
import handleTowerCardid from "./tower-cardid";

function handleConnect() {
  console.log("Connection to the MQTT broker successful.");

  client.subscribe(MqttTopics.TOWER_CARDID);
}

function handleMessage(topic: string, message: Buffer) {
  let informativeMessage = "";

  const messageString = message.toString();

  switch (topic) {
    case MqttTopics.TOWER_CARDID: {
      informativeMessage = `A message under the topic "${MqttTopics.TOWER_CARDID}" containing the card ID "${messageString}" has been received.`;
      handleTowerCardid(messageString);
      break;
    }
  }

  console.log(informativeMessage);
}

export { handleConnect, handleMessage };
