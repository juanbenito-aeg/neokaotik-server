import handleAngeloTrialValidatedOrCanceled from "../../../../../sockets/handlers/missions/angelo-trial/angelo-trial-validated-or-canceled";
import playerDb from "../../../../../db/player.db";
import { PlayerRole } from "../../../../../constants/player";
import {
  AngeloLocation,
  VoteAngeloTrial,
} from "../../../../../constants/missions";

describe("handleAngeloTrialValidatedOrCanceled", () => {
  it("should send Angelo to dungeon when 'isTrialValidated' is false", async () => {
    await handleAngeloTrialValidatedOrCanceled(false);

    const angelo = (await playerDb.getPlayerByField({
      rol: PlayerRole.ANGELO,
    }))!;

    expect(angelo.location).toBe(AngeloLocation.DUNGEON);
  });

  it("should release Angelo when majority votes innocent", async () => {
    const acolytes = await playerDb.getPlayersByFields({
      isBetrayer: false,
      rol: PlayerRole.ACOLYTE,
    });

    await playerDb.updatePlayersByField(
      { _id: { $in: acolytes.map((acolyte) => acolyte._id) } },
      { voteAngeloTrial: VoteAngeloTrial.INNOCENT }
    );

    await handleAngeloTrialValidatedOrCanceled(true);

    const angelo = (await playerDb.getPlayerByField({
      rol: PlayerRole.ANGELO,
    }))!;

    expect(angelo.location).toBe(AngeloLocation.INN_FORGOTTEN);
    expect(angelo.isCaptured).toBe(false);
  });
});
