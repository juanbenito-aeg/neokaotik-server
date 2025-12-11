import mqtt from "mqtt";
import { MqttEvents } from "../constants/mqtt";
import subscribeToTopics from "../mqtt/subscriptions";
import handleMessage from "../mqtt/handlers/message";

const client = mqtt.connect("mqtt://broker.hivemq.com");

// Listen for the successful connection to the broker & incoming messages
client.on(MqttEvents.CONNECT, subscribeToTopics);
client.on(MqttEvents.MESSAGE, handleMessage);

export default client;
