import { Types } from "mongoose";
import { Fields } from "../../../../interfaces/generics";
import io from "../../../../config/sockets";
import { SocketServerToClientEvents } from "../../../../constants/socket";

function handleCronTask(
  acolyteId: Types.ObjectId,
  acolyteUpdatedFields: Fields
) {
  io.emit(
    SocketServerToClientEvents.CRON_TASK_EXECUTED,
    acolyteId,
    acolyteUpdatedFields
  );
}

export { handleCronTask };
