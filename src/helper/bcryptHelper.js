import bcrypt from "bcrypt";

const saltRound = 10;
export const hashPassword = (plainPassword) => {
  return bcrypt.hashSync(plainPassword, saltRound);
};

export const comparePassword = (plainPassword, hashPassword) => {
  return bcrypt.compareSync(plainPassword, hashPassword);
};
