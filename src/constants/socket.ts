enum SocketServerToClientEvents {
  ACOLYTE_INSIDE_OUTSIDE_LAB = "acolyte inside/outside lab",
  ACOLYTE_DISCONNECTED = "acolyte disconnected",
  ACOLYTE_TOWER_ACCESS = "acolyte tower access",
  ACOLYTE_POSITION_CHANGED = "acolyte's position changed",
  ARTIFACT_PRESS_MANAGED = "artifact press managed",
  PLAYER_ENTERED_EXITED_HS = "player entered/exited HS",
  REQUESTED_TO_SHOW_ARTIFACTS = "requested to show artifacts",
  ARTIFACTS_SEARCH_VALIDATION_RESET_MANAGED = "artifacts search validation/reset managed",
  ACOLYTE_BECAME_BETRAYER = "acolyte became betrayer",
  ANGELO_SUBDUED = "Angelo subdued",
  ACOLYTE_RESISTANCE_RESTORED = "acolyte resistance restored",
  CRON_TASK_EXECUTED = "cron task executed",
  ACOLYTE_INFECTED = "acolyte infected",
  ACOLYTE_CURSED = "acolyte cursed",
  MORTIMER_AIDED_ACOLYTE = "Mortimer aided acolyte",
}

enum SocketClientToServerEvents {
  CONNECTION_OPEN = "connection open",
  ACCESS_TO_EXIT_FROM_LAB = "access to/exit from lab",
  ACOLYTE_INSIDE_OUTSIDE_TOWER = "acolyte inside/outside tower",
  SCROLL_PRESS = "scroll press",
  REMOVE_SPELL_PRESS = "remove spell press",
  ACOLYTE_MOVED = "acolyte moved",
  ARTIFACT_PRESSED = "artifact pressed",
  PLAYER_ENTERED_EXITED_HS = "player entered/exited HS",
  REQUESTED_TO_SHOW_ARTIFACTS = "requested to show artifacts",
  ARTIFACTS_SEARCH_VALIDATED_RESET = "artifacts search validated/reset",
  ACOLYTE_ACCEPTED_BETRAYAL = "acolyte accepted betrayal",
  ANGELO_SUBDUED = "Angelo subdued",
  ACOLYTE_RESTED = "acolyte rested",
  ACOLYTE_INFECTED = "acolyte infected",
  ACOLYTE_CURSED = "acolyte cursed",
  MORTIMER_AIDED_ACOLYTE = "Mortimer aided acolyte",
  MORTIMER_NOTIFIED_FOR_ANGELO_DELIVERY = "Mortimer notified for Angelo's delivery",
}

enum SocketGeneralEvents {
  CONNECTION = "connection",
  DISCONNECT = "disconnect",
}

export {
  SocketServerToClientEvents,
  SocketClientToServerEvents,
  SocketGeneralEvents,
};
