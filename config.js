import crypto from "crypto";

export const PORT = 3002;

export const mongodbURL =
  "mongodb+srv://school:Gx8o1yBLksBBWF2w@school.uokqbr2.mongodb.net/school?retryWrites=true&w=majority";

export function mySecretKey() {
  const randomNums = crypto.randomBytes(32);
  return randomNums.toString("hex");
}
