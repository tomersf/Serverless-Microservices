import { ConnectDB } from "./db-connection";

ConnectDB()
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.error(err));
