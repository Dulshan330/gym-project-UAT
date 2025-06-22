import * as crypto from "crypto";

export const generateRandomToken = () => {
  return crypto.randomBytes(64).toString("hex");
};
