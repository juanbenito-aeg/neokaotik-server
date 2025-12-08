enum Environment {
  TEST = "test",
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

enum Methods {
  POST = 0,
  PUT = 1,
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
  NotificationTypes,
  ScreenChangingNotificationDestinations,
  ArtifactState,
};
