import { SocketServerToClientEvents } from "../../constants/socket";
import User from "../../database/userDatabase";
import { AcolyteDataToBroadcast } from "../../interfaces/socket";
import USER_ROLES from "../../roles/roles";
import { io } from "../..";

async function handleAccessToExitFromLab(
  istvanSocketId: string,
  acolyteEmail: string,
  isInside: boolean
) {
  const updatedIsInside: boolean = !isInside;

  // Toggle the acolyte's "isInside" field
  const updatedAcolyte = await User.updateUserByField(
    { email: acolyteEmail },
    { isInside: updatedIsInside }
  );

  const acolyteNickname: string = updatedAcolyte?.nickname!;

  console.log(
    `${acolyteNickname} is now ${
      updatedIsInside ? "inside" : "outside"
    } Angelo's laboratory.`
  );

  const updatedAcolyteData: AcolyteDataToBroadcast = {
    email: acolyteEmail,
    isInside: updatedIsInside,
    nickname: acolyteNickname,
    avatar: updatedAcolyte?.avatar!,
  };

  // Group & communicate with the relevant socket IDs (Istvan's, the acolyte's & Mortimer's)

  const acolyteSocketId: string = updatedAcolyte?.socketId!;

  const mortimer = await User.getUserByField({
    rol: USER_ROLES.MORTIMER,
  });
  const mortimerSocketId: string = mortimer?.socketId!;

  const relevantSocketIds: string[] = [
    istvanSocketId,
    acolyteSocketId,
    mortimerSocketId,
  ];

  io.to(relevantSocketIds).emit(
    SocketServerToClientEvents.ACOLYTE_INSIDE_OUTSIDE_LAB,
    updatedAcolyteData
  );
}

export { handleAccessToExitFromLab };
