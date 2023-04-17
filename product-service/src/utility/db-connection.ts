import mongoose from "mongoose";

import ENV from "./env";
mongoose.set("strictQuery", false);

const ConnectDB = async () => {
  const DB_URL = `mongodb+srv://product:${ENV.DB_PASSWORD}@cluster0.tb9niil.mongodb.net/node-sls-ms`;

  await mongoose.connect(DB_URL);
};

export { ConnectDB };
