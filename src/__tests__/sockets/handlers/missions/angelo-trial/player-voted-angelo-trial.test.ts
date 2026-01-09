import { MOCKED_PLAYER } from "../../../../../__mocks__/mocked-player";
import { VoteAngeloTrial } from "../../../../../constants/missions";
import playerDb from "../../../../../db/player.db";
import { handlePlayerVotedAngeloTrial } from "../../../../../sockets/handlers/missions/angelo-trial/player-voted-angelo-trial";

describe("'handlePlayerVotedAngeloTrial' socket event handler", () => {
  const playerId = MOCKED_PLAYER._id.toString();
  const vote = VoteAngeloTrial.INNOCENT;

  it("should set voter's 'voteAngeloTrial' field in DB to incoming 'vote'", async () => {
    // Clear voter's "voteAngeloTrial"

    const fieldToFilterBy = { _id: playerId };
    const changeToApply = { voteAngeloTrial: "" };

    await playerDb.updatePlayerByField(fieldToFilterBy, changeToApply);

    // Trigger field update
    await handlePlayerVotedAngeloTrial(playerId, vote);

    // Check field has been set to received value through socket event ("Innocent")

    const fieldToInclude = "voteAngeloTrial";

    const updatedVoter = (await playerDb.getPlayerByField(
      fieldToFilterBy,
      fieldToInclude
    ))!;

    expect(updatedVoter.voteAngeloTrial).toBe(VoteAngeloTrial.INNOCENT);
  });
});
