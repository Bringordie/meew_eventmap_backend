import * as bcrypt from "bcryptjs";
const SALT_ROUNDS = 10;

const bryptAsync = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(SALT_ROUNDS, function (err: any, salt: any) {
      bcrypt.hash(password, SALT_ROUNDS, function (err, hash) {
        if (err) {
          reject(err);
        }
        return resolve(hash);
      });
    });
  });
};

const bryptCheckAsync = (
  password: string,
  hashed: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashed, function (err, res) {
      if (err || !res) {
        reject(false);
      }
      return resolve(true);
    });
  });
};
export { bryptAsync, bryptCheckAsync };
