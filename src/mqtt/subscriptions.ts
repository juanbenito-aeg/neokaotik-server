import { client } from "..";
import { MqttTopics } from "../constants/mqtt";

function subscribeToTopics() {
  console.log("Connection to the MQTT broker successful.");

  client.subscribe(MqttTopics.TOWER_CARDID);
  client.subscribe(MqttTopics.TOWER_DOOR);
}

export default subscribeToTopics;
