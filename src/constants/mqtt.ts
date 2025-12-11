enum MqttEvents {
  CONNECT = "connect",
  MESSAGE = "message",
}

enum MqttTopics {
  TOWER_CARDID = "tower/cardid",
  TOWER_ACCESS = "tower/access",
  TOWER_DOOR = "tower/door",
}

export { MqttEvents, MqttTopics };
