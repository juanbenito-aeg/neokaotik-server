import { MOCKED_PLAYER } from "../../../__mocks__/mocked-player";
import IPlayer from "../../../interfaces/IPlayer";
import playerServices from "../../../services/player.services";

describe("Applying attribute modifiers", () => {
  let player = {} as unknown as IPlayer;

  beforeEach(() => {
    player = { ...MOCKED_PLAYER } as unknown as IPlayer;
  });

  describe("applyEthaziumCurseModifier", () => {
    it("should leave player's attributes as is if they aren't cursed", () => {
      player.isCursed = false;

      const nonCursedPlayerResistance = player.attributes.resistance!;

      playerServices.applyEthaziumCurseModifier(player);

      expect(player.attributes.resistance).toBe(nonCursedPlayerResistance);
    });

    it("should reduce player's attributes by 40% if they are cursed", () => {
      player.isCursed = true;

      const cursedPlayerResistance = player.attributes.resistance!;

      playerServices.applyEthaziumCurseModifier(player);

      expect(player.attributes.resistance).toBe(cursedPlayerResistance * 0.6);
    });
  });
});
