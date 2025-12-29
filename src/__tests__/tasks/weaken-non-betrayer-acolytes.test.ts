import { PlayerRole } from "../../constants/player";
import playerDb from "../../db/player.db";
import { decreaseResistanceBy10 } from "../../tasks/weaken-non-betrayer-acolytes";

describe("Weakening non-betrayer acolytes", () => {
  describe("decreaseResistanceBy10", () => {
    it("should decrease acolytes' 'resistance' field by 10, or less if their value < 10", async () => {
      const fieldsToFilterBy = { isBetrayer: false, rol: PlayerRole.ACOLYTE };
      const fieldToInclude = "attributes.resistance";

      const acolytesBefore = await playerDb.getPlayersByFields(
        fieldsToFilterBy,
        fieldToInclude
      );

      await decreaseResistanceBy10();

      const acolytesAfter = await playerDb.getPlayersByFields(
        fieldsToFilterBy,
        fieldToInclude
      );

      acolytesBefore.forEach((acolyteBefore, index) => {
        const resistanceBefore = acolyteBefore.attributes.resistance!;

        const resistanceAfter = acolytesAfter[index]!.attributes.resistance!;

        expect(resistanceAfter).toBe(
          resistanceBefore < 10 ? 0 : resistanceBefore - 10
        );
      });
    });
  });
});
