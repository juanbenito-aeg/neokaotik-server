import fs from "node:fs";
import mqtt from "mqtt";
import { MqttEvents } from "../constants/mqtt";
import subscribeToTopics from "../mqtt/subscriptions";
import handleMessage from "../mqtt/handlers/message";

// Securely connect to the broker
const options = {
  key: fs.readFileSync("confidential-data/node.key"),
  cert: fs.readFileSync("confidential-data/node.crt"),
  ca: fs.readFileSync("confidential-data/ca.crt"),
  rejectUnauthorized: true,
};
const client = mqtt.connect("mqtts://10.50.0.50:8883", options);

// Listen for the successful connection to the broker & incoming messages
client.on(MqttEvents.CONNECT, subscribeToTopics);
client.on(MqttEvents.MESSAGE, handleMessage);

export default client;
