enum SocketServerToClientEvents {
  ACOLYTE_INSIDE_OUTSIDE_LAB = "acolyte inside/outside lab",
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

export {
  SocketServerToClientEvents,
  SocketClientToServerEvents,
  SocketGeneralEvents,
  Methods,
};
