import { PublicKey, StakeProgram } from "@solana/web3.js";

const validate = (name, obj) => {
  if (!Object.prototype.hasOwnProperty.call(obj, name)) {
    throw new TypeError(`${name} argument is missing`);
  }
};

export const createPublicKeysBatchWithSeed = (args = {}) => {
  validate("publicKey", args);
  validate("batch", args);
  validate("batchSize", args);

  const { publicKey, batch, batchSize, seedPrefix = "" } = args;

  return Promise.all(
    Array.from(Array(batchSize)).map((_, i) => {
      // Solana staking best practice: derive stake account public keys from the
      // owners public key and a zero-based index. This allows discovery of
      // owner's stake accounts by tools and apps (like SendIt) without sharing
      // state. Some apps (Solflare for example) also use a custom seed prefix
      // to allow them to uniquely identify which stake accounts they created.
      // However, this is not foolproof as anyone could create a stake account
      // using their same prefix and there wouldn't be anyway to tell them
      // apart.
      const seed = `${seedPrefix}${batch + i}`;
      return PublicKey.createWithSeed(publicKey, seed, StakeProgram.programId).then((publicKey) => {
        return {
          publicKey,
          seed
        }
      })
    })
  );
};
