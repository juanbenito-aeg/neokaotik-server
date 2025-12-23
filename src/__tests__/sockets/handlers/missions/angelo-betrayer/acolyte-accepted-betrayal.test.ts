import { PlayerRole } from "../../../../../constants/player";
import playerDb from "../../../../../db/player.db";
import handleAcolyteAcceptedBetrayal from "../../../../../sockets/handlers/missions/angelo-betrayer/acolyte-accepted-betrayal";

describe("'handleAcolyteAcceptedBetrayal' socket event handler", () => {
  const GOLD_TO_GIVE_NEW_BETRAYER = 50000;

  it(`should increase the new betrayer's gold coins by ${GOLD_TO_GIVE_NEW_BETRAYER}`, async () => {
    const fieldToFilterBy = { rol: PlayerRole.ACOLYTE };
    const fieldToInclude = "gold";

    const { _id: acolyteId, gold: acolyteGoldBeforeTurningIntoBetrayer } =
      (await playerDb.getPlayerByField(fieldToFilterBy, fieldToInclude))!;

    await handleAcolyteAcceptedBetrayal(acolyteId);

    const { gold: acolyteGoldAfterTurningIntoBetrayer } =
      (await playerDb.getPlayerByField(fieldToFilterBy, fieldToInclude))!;

    expect(acolyteGoldAfterTurningIntoBetrayer).toBe(
      acolyteGoldBeforeTurningIntoBetrayer + GOLD_TO_GIVE_NEW_BETRAYER
    );
  });
});
