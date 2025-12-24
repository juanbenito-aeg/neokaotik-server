enum ArtifactState {
  ACTIVE = "active",
  COLLECTED = "collected",
}

enum AngeloLocation {
  INN_FORGOTTEN = "The Inn of the Forgotten",
  HALL_SAGES = "The Hall of Sages",
  DUNGEON = "Dungeon",
}

const ROTTEN_SET_DECREPIT_BETRAYER = {
  weapon: {
    modifiers: {
      intelligence: -1,
      dexterity: 1,
      charisma: -2,
      constitution: 1,
      strength: 4,
      insanity: 1,
    },
    name: "Betrayer’s Rotten Blade",
    description:
      "A corroded sword once wielded by a traitor, its edge festering with decay and madness.",
    type: "weapon",
    image: "/images/equipment/weapons/sword_rotten_betrayer.png",
    value: 180,
    min_lvl: 5,
    base_percentage: 9,
    die_faces: 6,
    die_modifier: 5,
    die_num: 3,
    isUnique: true,
    isActive: true,
  },
  pieceArmor: {
    modifiers: {
      intelligence: -1,
      dexterity: -2,
      charisma: -3,
      constitution: 4,
      strength: 2,
      insanity: 5,
    },
    name: "Carapace of the Decrepit Betrayer",
    description:
      "A corroded armor fused with rotting flesh and broken oaths. It protects its bearer by feeding on madness and decay.",
    type: "armor",
    image: "/images/equipment/armors/rotten_armor_betrayer.png",
    value: 18000,
    min_lvl: 26,
    defense: 235,
    isUnique: true,
    isActive: false,
  },
  pairBoots: {
    modifiers: {
      intelligence: 1,
      dexterity: -1,
      charisma: -1,
      constitution: 1,
      strength: 0,
      insanity: 1,
    },
    name: "Betrayer’s Putrid Treads",
    description:
      "Boots soaked in rot and betrayal, leaving a trail of decay with every step.",
    type: "boot",
    image: "/images/equipment/boots/boot_rotten_1.png",
    value: 280,
    min_lvl: 10,
    defense: 24,
    isActive: true,
    isUnique: true,
  },
  helmet: {
    modifiers: {
      intelligence: 1,
      dexterity: 0,
      charisma: -2,
      constitution: 2,
      strength: 2,
      insanity: 3,
    },
    name: "Crown of the Decrepit Betrayer",
    description:
      "A corroded helm once worn by a traitor lord, whispering promises of survival through decay and madness.",
    type: "helmet",
    image: "/images/equipment/helmets/rotten_helmet_betrayer.png",
    value: 5400,
    min_lvl: 26,
    defense: 85,
    isUnique: true,
    isActive: false,
  },
  shield: {
    modifiers: {
      intelligence: 0,
      dexterity: -1,
      charisma: -1,
      constitution: 2,
      strength: 1,
      insanity: 2,
    },
    name: "Putrid Oathbearer Shield",
    description:
      "A corroded shield once sworn in betrayal, whispering broken vows into the mind of its bearer.",
    type: "shield",
    image: "/images/equipment/shields/shield_rotten_01.png",
    value: 180,
    min_lvl: 12,
    defense: 42,
    isUnique: true,
    isActive: true,
  },
};

export { ArtifactState, AngeloLocation, ROTTEN_SET_DECREPIT_BETRAYER };
