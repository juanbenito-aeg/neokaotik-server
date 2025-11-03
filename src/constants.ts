enum SocketServerToClientEvents {
  ACOLYTE_INSIDE_OUTSIDE_LAB = "acolyte inside/outside lab",
  ACOLYTE_TOWER_ACCESS = "acolyte tower access",
  ACOLYTE_DISCONNECTED = "acolyte disconnected",
}

enum SocketClientToServerEvents {
  CONNECTION_OPEN = "connection open",
  ACCESS_TO_EXIT_FROM_LAB = "access to/exit from lab",
}

enum SocketGeneralEvents {
  CONNECTION = "connection",
  DISCONNECT = "disconnect",
}

enum Methods {
  POST = 0,
  PUT = 1,
}

enum MqttEvents {
  CONNECT = "connect",
  MESSAGE = "message",
}

enum MqttTopics {
  TOWER_CARDID = "tower/cardid",
  TOWER_ACCESS = "tower/access",
  TOWER_DOOR = "tower/door",
}

export {
  SocketServerToClientEvents,
  SocketClientToServerEvents,
  SocketGeneralEvents,
  Methods,
  MqttEvents,
  MqttTopics,
};
