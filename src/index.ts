import "./config/firebase-admin";
import "./config/server";
import "./config/sockets";
import "./config/mqtt";
import "dotenv/config";
import "./config/db";
import { httpServer } from "./config/server";

const PORT = +(process.env.PORT || 3000);

httpServer.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}.`);
});
