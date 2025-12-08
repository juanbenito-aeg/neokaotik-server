enum Environment {
  TEST = "test",
  DEVELOPMENT = "development",
  PRODUCTION = "production",
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

enum NotificationTypes {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
}

enum ScreenChangingNotificationDestinations {
  SWAMP_TOWER = "Swamp Tower",
  REMOVE_SPEEL = "Remove spell",
  HALL_SAGES = "The Hall of Sages",
}

enum ArtifactState {
  ACTIVE = "active",
  COLLECTED = "collected",
}

export {
  Environment,
  Methods,
  MqttEvents,
  MqttTopics,
  NotificationTypes,
  ScreenChangingNotificationDestinations,
  ArtifactState,
};
