import { client } from "../..";
import { MqttTopics } from "../../constants";

function handleConnect() {
  console.log("Connection to the MQTT broker successful.");

  client.subscribe(MqttTopics.TOWER_CARDID);
}

export { handleConnect };
