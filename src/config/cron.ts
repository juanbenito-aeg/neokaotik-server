import cron from "node-cron";
import { weakenNonBetrayerAcolytes } from "../tasks/weaken-non-betrayer-acolytes";

const CRON_EXPRESSION = "*/30 * * * *"; // Change it to "*/15 * * * * *" to run the task every 15 seconds for testing purposes

cron.schedule(CRON_EXPRESSION, weakenNonBetrayerAcolytes);
